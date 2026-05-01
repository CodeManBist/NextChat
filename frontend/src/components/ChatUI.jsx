import { BsCheck, BsCheck2All, BsEmojiSmile, BsPlusLg, BsSendFill } from "react-icons/bs";
import Input from "./ui/Input";
import Button from "./ui/Button";

const ChatUI = ({
  selectedUser,
  messages = [],
  newMessage,
  setNewMessage,
  sendMessage,
  handleTyping,
  currentUserId,
  currentUsername,
  isEmpty,
  isTyping,
  chatContainerRef,
  handleScroll,
  onlineUsers,
}) => {
  return (
    <div className="h-full w-full bg-[#07111B] overflow-hidden relative flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-25 -left-25 h-125 w-125 rounded-full bg-blue-500/12 blur-3xl" />
        <div className="absolute -bottom-37.5 -right-25 h-125 w-125 rounded-full bg-sky-500/10 blur-3xl" />

        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 h-40 w-40 rounded-full border border-blue-400/20" />
          <div className="absolute bottom-20 right-10 h-72 w-72 rounded-full border border-sky-400/10" />
          <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-300/10" />
        </div>
      </div>

      {/* Messages Container */}
      <div className="relative z-10 flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-5 chat-scrollbar" ref={chatContainerRef} onScroll={handleScroll}>
        {isEmpty ? (
          <div className="h-full min-h-75 flex items-center justify-center text-[#8EA7A3] text-center px-4 sm:px-6">
            Start chatting with {selectedUser?.username}.
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.senderId === currentUserId || msg.sender === "me";
            const messageTime =
              msg.time ||
              (msg.createdAt
                ? new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "");
            return (
              <div
                key={msg._id || msg.id || index}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] sm:max-w-[60%] rounded-2xl overflow-hidden shadow-2xl border border-white/5 ${
                    isMe
                      ? "bg-[#1E5EC7] text-white rounded-br-md"
                      : "bg-[#13263E]/95 text-gray-200 rounded-bl-md"
                  }`}
                >
                  {msg.image && (
                    <div className="p-2 pb-0">
                      <img
                        src={msg.image}
                        alt="preview"
                        className="rounded-xl h-40 sm:h-64 w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="px-3 sm:px-4 py-2 sm:py-3">
                    <p className="text-sm leading-relaxed">{msg.text}</p>

                    <div
                      className={`text-[11px] mt-2 flex justify-end ${
                        isMe ? "text-white/70" : "text-gray-400"
                      }`}
                    >
                      {isMe ? (
                        <div className="flex items-center gap-1.5">
                          <span>{messageTime}</span>
                          {msg.seen ? (
                            <BsCheck2All className="text-[#7dd3fc]" size={14} />
                          ) : (
                            <BsCheck className="text-white/60" size={14} />
                          )}
                        </div>
                      ) : (
                        <span>{messageTime}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="relative z-10 px-2 sm:px-3 py-2 sm:py-3 bg-[#0F1E35]/90 border-t border-[#1A3A5C] backdrop-blur-xl">
        <div className="flex items-center gap-2 sm:gap-3">
          <button type="button" className="text-gray-400 hover:text-white transition shrink-0">
            <BsPlusLg size={18} className="sm:w-5 sm:h-5" />
          </button>

          <div className="flex-1">
            <Input
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping?.(e.target.value);
              }}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              onBlur={() => handleTyping?.("")}
              placeholder={`Message ${selectedUser?.username || 'user'}`}
            />
          </div>

          <div className="flex items-center gap-2">
            <button type="button" className="text-gray-400 hover:text-white">
              <BsEmojiSmile size={18} />
            </button>

            <Button
              size="sm"
              variant="primary"
              onClick={sendMessage}
              disabled={!newMessage.trim()}
            >
              <BsSendFill />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
