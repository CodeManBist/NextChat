import { BsCheck, BsCheck2All, BsEmojiSmile, BsPlusLg, BsSendFill } from "react-icons/bs";
import { HiMiniMicrophone } from "react-icons/hi2";

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
}) => {
  return (
    <div className="h-full w-full bg-[#07141d] overflow-hidden relative flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-25 -left-25 h-125 w-125 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-37.5 -right-25 h-125 w-125 rounded-full bg-green-500/10 blur-3xl" />

        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 h-40 w-40 rounded-full border border-cyan-400/20" />
          <div className="absolute bottom-20 right-10 h-72 w-72 rounded-full border border-green-400/10" />
          <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 px-5 py-4 border-b border-white/5 bg-black/10 backdrop-blur-md flex items-center justify-between">
        <div>
          <p className="text-white font-semibold">{selectedUser?.username}</p>
          <p className="text-xs text-[#8EA7A3]">
            {selectedUser ? "Ready to chat" : ""}
          </p>
          {isTyping && (
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#18242c] px-3 py-2 shadow-lg border border-white/5">
              <span className="sr-only">typing</span>
              <span className="h-2 w-2 rounded-full bg-green-400 animate-bounce [animation-delay:-0.3s]" />
              <span className="h-2 w-2 rounded-full bg-green-400 animate-bounce [animation-delay:-0.15s]" />
              <span className="h-2 w-2 rounded-full bg-green-400 animate-bounce" />
            </div>
          )}
        </div>

        <div className="text-xs text-[#8EA7A3]">
          {currentUsername ? `You are ${currentUsername}` : ""}
        </div>
      </div>

      {/* Messages */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-6 space-y-5 chat-scrollbar" ref={chatContainerRef} onScroll={handleScroll}>
        {isEmpty ? (
          <div className="h-full min-h-75 flex items-center justify-center text-[#8EA7A3] text-center px-6">
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
                  className={`max-w-[75%] rounded-2xl overflow-hidden shadow-2xl border border-white/5 ${
                    isMe
                      ? "bg-[#0f9d7a] text-white rounded-br-md"
                      : "bg-[#1a2630]/95 text-gray-200 rounded-bl-md"
                  }`}
                >
                  {msg.image && (
                    <div className="p-2 pb-0">
                      <img
                        src={msg.image}
                        alt="preview"
                        className="rounded-xl h-64 w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="px-4 py-3">
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
      <div className="relative z-10 px-3 py-3 bg-[#16232c]/90 border-t border-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button type="button" className="text-gray-400 hover:text-white transition">
            <BsPlusLg size={20} />
          </button>

          <div className="flex-1 h-12 bg-[#243540] rounded-xl px-4 flex items-center gap-3 border border-white/5">
            <BsEmojiSmile size={20} className="text-gray-400" />

            <input
              type="text"
              placeholder={`Type a message to ${selectedUser?.username || "user"}`}
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping?.(e.target.value);
              }}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              onBlur={() => handleTyping?.("")}
              className="bg-transparent outline-none text-white placeholder:text-gray-500 w-full text-sm"
            />

            <HiMiniMicrophone
              size={20}
              className="text-gray-400 cursor-pointer hover:text-white transition"
            />
          </div>

          <button
            type="button"
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="h-12 w-12 rounded-full bg-[#1ecf8b] flex items-center justify-center text-black shadow-lg hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100"
          >
            <BsSendFill size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
