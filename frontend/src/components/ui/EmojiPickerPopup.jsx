import React, { useEffect, useMemo, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";

const EmojiPickerPopup = ({
  show,
  onClose,
  onEmojiSelect,
  position = "bottom-16 right-2",
  theme = "dark",
  width = "100%",
  height = 400,
  previewConfig = { showPreview: false },
  className = "",
  closeOnEscape = true,
  style,
}) => {
  const pickerRef = useRef(null);
  const positionClass = style ? "" : position;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(window.innerWidth < 640);
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => {
      window.removeEventListener("resize", updateViewport);
    };
  }, []);

  const pickerSize = useMemo(
    () => ({
      width: isMobile ? "min(92vw, 320px)" : width,
      height: isMobile ? 320 : height,
    }),
    [height, isMobile, width]
  );

  useEffect(() => {
    if (!show) return undefined;

    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    const handleKeyDown = (event) => {
      if (closeOnEscape && event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };

  }, [show, onClose, closeOnEscape]);

  if (!show) return null;

  return (
    <div
      ref={pickerRef}
      style={style}
      className={`
        ${style ? "" : "absolute"}
        z-50
        ${positionClass}
        w-[min(92vw,320px)]
        sm:w-auto
        max-w-[320px]
        sm:max-w-none
        max-h-[70vh]
        overflow-hidden
        ${className}
      `}
    >
      <EmojiPicker
        onEmojiClick={onEmojiSelect}
        theme={theme}
        width={pickerSize.width}
        height={pickerSize.height}
        previewConfig={previewConfig}
      />
    </div>
  );
};

export default EmojiPickerPopup;