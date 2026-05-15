import React from 'react';
import { useCall } from '../../context/CallContext';

const IncomingCallModal = () => {
  const { incomingCall, answerCall, setIncomingCall, endCall } = useCall();

  if (!incomingCall) return null;

  const handleAccept = async () => {
    try {
      await answerCall();
    } catch (err) {
      console.error('Error answering call:', err);
    }
  };

  const handleDecline = () => {
    // notify caller we declined
    endCall(incomingCall.from, incomingCall.callId);
    setIncomingCall(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="pointer-events-auto bg-[#0b141a] border border-white/6 theme-panel rounded-xl p-4 shadow-lg">
        <p className="text-white font-semibold">Incoming call</p>
        <p className="text-sm text-white/60">From: {incomingCall.from}</p>
        <div className="mt-3 flex gap-2">
          <button onClick={handleAccept} className="px-3 py-1 bg-green-600 rounded text-white">Accept</button>
          <button onClick={handleDecline} className="px-3 py-1 bg-red-600 rounded text-white">Decline</button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
