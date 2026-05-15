import { useEffect, useRef } from "react";

const AudioCall = ({ remoteStream }) => {

    const audioRef = useRef();

    useEffect(() => {

        if(remoteStream) {

            audioRef.current.srcObject = remoteStream;
            // Try to play (some browsers require explicit play after setting srcObject)
            const p = audioRef.current.play();
            if (p && p.catch) {
                p.catch((err) => {
                    console.warn('Audio play was prevented:', err);
                });
            }

        }

    }, [remoteStream]);

    return (
        <audio
            ref={audioRef}
            autoPlay
            // keep hidden but available to play remote audio
            style={{ display: 'none' }}
        />
    );
};

export default AudioCall;