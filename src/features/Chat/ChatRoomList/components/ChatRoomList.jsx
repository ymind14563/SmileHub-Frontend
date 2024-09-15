import React from 'react';

const ChatRoomList = ({ chatRooms, handleSelectRoom }) => {
  return (
    <div className="w-full p-4 bg-gray-100 h-full overflow-y-auto">
      {chatRooms.map((room) => (
        <div
          key={room.roomId}
          data-room-id={room.roomId}
          onClick={() => handleSelectRoom(room.roomId)}
          className="p-4 mb-2 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-200"
        >
          <h3 className="font-semibold">{room.Product.productName}</h3>
          <p className="text-sm text-gray-500">
            {room.lastMessage ? room.lastMessage : '아직 메세지가 없습니다.'}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ChatRoomList;
