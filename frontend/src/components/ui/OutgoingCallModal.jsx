import React from 'react';
import { useCall } from '../../context/CallContext';

const OutgoingCallModal = () => {
  const { outgoingCall, currentPeerId, endCall } = useCall();

  if (!outgoingCall) return null;

  const handleCancel = () => {
    endCall(currentPeerId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="pointer-events-auto bg-[#0b141a] border border-white/6 theme-panel rounded-xl p-4 shadow-lg">
        <p className="text-white font-semibold">Calling...</p>
        <p className="text-sm text-white/60">To: {currentPeerId}</p>
        <div className="mt-3 flex gap-2">
          <button onClick={handleCancel} className="px-3 py-1 bg-red-600 rounded text-white">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default OutgoingCallModal;
