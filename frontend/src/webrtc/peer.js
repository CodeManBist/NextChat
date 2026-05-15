export const createPeerConnection = () => {
    const peer = new RTCPeerConnection({
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            // Add TURN servers here if needed
        ],  
    })
    return peer;
}