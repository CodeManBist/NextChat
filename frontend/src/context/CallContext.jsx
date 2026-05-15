import {
    createContext,
    useContext,
    useRef,
    useState,
    useEffect
} from "react";

import socket from "../socket";

import { createPeerConnection } from "../webrtc/peer";

const CallContext = createContext();

export const CallProvider = ({ children }) => {

    const peerRef = useRef(null);

    const [localStream, setLocalStream] = useState(null);

    const [remoteStream, setRemoteStream] = useState(null);

    const [incomingCall, setIncomingCall] = useState(null);
    const [inCall, setInCall] = useState(false);
    const [outgoingCall, setOutgoingCall] = useState(false);
    const [callId, setCallId] = useState(null);
    const [currentPeerId, setCurrentPeerId] = useState(null);

    // START CALL
    const callUser = async (userId) => {

        if (inCall || outgoingCall) {
            console.warn('Already in or dialing a call');
            return;
        }

        setOutgoingCall(true);

        // microphone access
        const stream =
            await navigator.mediaDevices.getUserMedia({
                audio: true
            });

        setLocalStream(stream);

        const peer = createPeerConnection();

        peerRef.current = peer;

        // add tracks
        stream.getTracks().forEach(track => {
            peer.addTrack(track, stream);
        });

        // receive remote stream
        peer.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
        };

        // send ICE candidates
        peer.onicecandidate = (event) => {

            if(event.candidate) {

                socket.emit("ice-candidate", {
                    to: userId,
                    candidate: event.candidate
                });

            }

        };

        // create offer
        const offer = await peer.createOffer();

        await peer.setLocalDescription(offer);

        // send offer
        const newCallId = Date.now().toString();
        setCallId(newCallId);
        setCurrentPeerId(userId);

        socket.emit("offer", {
            to: userId,
            offer,
            callId: newCallId
        });

        // keep outgoingCall until answered or busy/end

    };

    // RECEIVE CALL
    const answerCall = async () => {

        const stream =
            await navigator.mediaDevices.getUserMedia({
                audio: true
            });

        setLocalStream(stream);

        const peer = createPeerConnection();

        peerRef.current = peer;

        stream.getTracks().forEach(track => {
            peer.addTrack(track, stream);
        });

        peer.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
        };

        peer.onicecandidate = (event) => {

            if(event.candidate) {

                socket.emit("ice-candidate", {
                    to: incomingCall.from,
                    candidate: event.candidate
                });

            }

        };

        // SET REMOTE OFFER
        await peer.setRemoteDescription(
            new RTCSessionDescription(
                incomingCall.offer
            )
        );

        // CREATE ANSWER
        const answer = await peer.createAnswer();

        await peer.setLocalDescription(answer);

        socket.emit("answer-call", {
            to: incomingCall.from,
            answer,
            callId: incomingCall.callId
        });

        setInCall(true);
        setCurrentPeerId(incomingCall.from);
        setCallId(incomingCall.callId || null);
        setIncomingCall(null);

    };

    // Helper to end call from remote or local
    const handleRemoteEnd = () => {
        if (peerRef.current) {
            try { peerRef.current.close(); } catch (e) {}
            peerRef.current = null;
        }
        setRemoteStream(null);
        setIncomingCall(null);
        setInCall(false);
        setOutgoingCall(false);
        setCallId(null);
        setCurrentPeerId(null);
    };

    // expose endCall function (local/end)
    const endCall = (toUserId = currentPeerId, callIdOverride = callId) => {
        try {
            socket.emit('end-call', { to: toUserId, callId: callIdOverride });
        } catch (e) {
            console.error('Error emitting end-call', e);
        }

        if (peerRef.current) {
            try { peerRef.current.close(); } catch (e) {}
            peerRef.current = null;
        }

        setRemoteStream(null);
        setIncomingCall(null);
        setInCall(false);
        setOutgoingCall(false);
        setCallId(null);
        setCurrentPeerId(null);
    };

    useEffect(() => {

    // INCOMING CALL
    socket.on("incoming-call", ({ from, offer, callId: incomingCallId } = {}) => {

        setIncomingCall({
            from,
            offer,
            callId: incomingCallId
        });

    });

    // USER BUSY
    socket.on("user-busy", ({ reason, callId }) => {
        console.warn('User busy:', reason, callId);
        setOutgoingCall(false);
        setCallId(null);
        setCurrentPeerId(null);
        // Optionally surface a UI notification here
        try {
            if (typeof window !== 'undefined' && window.alert) {
                alert('User is busy.');
            }
        } catch (e) {}
    });

    // CALL ANSWERED
    socket.on("call-answered", async ({ answer }) => {

        if (!peerRef.current) return;

        try {
            await peerRef.current.setRemoteDescription(
                new RTCSessionDescription(answer)
            );
            setOutgoingCall(false);
            setInCall(true);
        } catch (err) {
            console.error("Failed to set remote description on answer:", err);
        }

    });


    // ICE CANDIDATE
    socket.on("ice-candidate", async ({ candidate }) => {

        if(candidate) {

            if (!peerRef.current) return;

            try {
                await peerRef.current.addIceCandidate(
                    new RTCIceCandidate(candidate)
                );
            } catch (err) {
                console.error("Failed to add ICE candidate:", err);
            }

        }

    });

    // END CALL
    socket.on("call-ended", () => {
        handleRemoteEnd();
    });

    
        return () => {
            socket.off("incoming-call");
            socket.off("call-answered");
            socket.off("ice-candidate");
            socket.off("call-ended");
            socket.off("user-busy");
        };

    }, []);

    return (
        <CallContext.Provider
            value={{
                callUser,
                answerCall,
                localStream,
                remoteStream,
                incomingCall,
                setIncomingCall,
                inCall,
                outgoingCall
                    ,
                    callId,
                    currentPeerId,
                    endCall
            }}
        >
            {children}
        </CallContext.Provider>
    );
};

export const useCall = () => useContext(CallContext);