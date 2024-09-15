import React from 'react';

const ChatRoom = ({
  messages,
  message,
  handleInputChange,
  handleKeyPress,
  handleSendMessage,
  currentUser,
  messagesEndRef,
}) => {
  return (
    <div className="flex flex-col h-full p-4 bg-gray-100">
      {/* 채팅 메시지 목록 */}
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.senderId === currentUser.userId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-3 p-2 mx-1 my-1 rounded-lg max-w-sm ${
                msg.senderId === currentUser.userId
                  ? 'bg-[#FEE715] text-white'
                  : 'bg-gray-300 text-black'
              }`}
            >
              {msg.messageText}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* 자동 스크롤 위치 */}
      </div>

      {/* 메시지 입력 인풋 */}
      <div className="flex">
        <input
          type="text"
          value={message}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="flex-1 p-2 border border-gray-300 rounded-l-lg"
          placeholder="메시지를 입력하세요."
        />
        <button
          onClick={handleSendMessage}
          className="bg-[#FEE715] text-white px-4 py-2 rounded-r-lg"
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
