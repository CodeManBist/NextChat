import React from "react";

const ImagePreviewModal = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative max-h-full max-w-6xl w-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-2 -right-2 sm:top-0 sm:right-0 z-10 h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition flex items-center justify-center"
          aria-label="Close image preview"
        >
          <span className="text-2xl leading-none">×</span>
        </button>

        <img
          src={imageUrl}
          alt="Expanded preview"
          className="max-h-[88vh] max-w-full rounded-2xl shadow-2xl object-contain"
        />
      </div>
    </div>
  );
};

export default ImagePreviewModal;
