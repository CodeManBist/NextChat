import React from 'react';
import { useCall } from '../../context/CallContext';

const InCallControls = () => {
  const { inCall, currentPeerId, endCall } = useCall();

  if (!inCall) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button onClick={() => endCall(currentPeerId)} className="px-4 py-2 bg-red-600 rounded-full text-white shadow-lg">
        End Call
      </button>
    </div>
  );
};

export default InCallControls;
