import { useRef } from "react";

/**
 * Custom hook for handling typing indicators with debouncing
 * Reusable for both 1-on-1 and group chats
 * 
 * @param {Function} onTypingStart - Callback when typing starts
 * @param {Function} onTypingStop - Callback when typing stops (after debounce)
 * @param {number} debounceMs - Debounce delay in milliseconds (default: 2000)
 * @returns {Object} { handleTyping } - Function to call on input change
 */
export const useTypingIndicator = (onTypingStart, onTypingStop, debounceMs = 2000) => {
  const isTypingRef = useRef(false);
  const typingTimeoutRef = useRef(null);

  const handleTyping = (text) => {
    // Check if this is the start of typing
    if (!isTypingRef.current && text.trim()) {
      isTypingRef.current = true;
      onTypingStart?.();
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout for stopping typing
    typingTimeoutRef.current = setTimeout(() => {
      if (text.trim() === "") {
        // If text is empty, stop typing immediately
        isTypingRef.current = false;
        onTypingStop?.();
      } else {
        // If text still has content but user stopped typing, emit stop
        isTypingRef.current = false;
        onTypingStop?.();
      }
    }, debounceMs);
  };

  return { handleTyping };
};

export default useTypingIndicator;
