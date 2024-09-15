import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ChatRoom from '../components/ChatRoom';
import { addMessage, setMessages } from '../store/chatRoomSlice';
import { updateLastMessage } from '../../ChatRoomList/store/chatRoomListSlice';
import useSocket from '../../hooks/useSocket'; // 소켓 연결
import axios from 'axios';
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const ChatRoomContainer = () => {
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.user.currentUser);
  const currentChatRoom = useSelector((state) => state.chat.currentChatRoom);
  const messages = useSelector((state) => state.chat.messages);
  const messagesEndRef = useRef(null); // 스크롤 제어 ref

  // 스크롤 자동 하단 배치
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 메시지 받으면 스크롤 자동 하단 배치
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 소켓 연결
  const { socket, sendMessage, receiveMessage } = useSocket(
    currentChatRoom?.roomId,
  );

  // 서버에서 메시지 가져오기
  useEffect(() => {
    if (currentChatRoom) {
      axios
        .get(`${REACT_APP_API_URL}/message/${currentChatRoom.roomId}`, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        })
        .then((response) => {
          const formattedMessages = response.data.map((msg) => ({
            roomId: currentChatRoom.roomId,
            senderId: msg.senderId,
            messageText: msg.messageText,
            senderNickname: msg.Sender.nickname,
            timestamp: msg.createdAt,
          }));
          dispatch(setMessages(formattedMessages)); // 메시지 업데이트
          scrollToBottom();
        })
        .catch((error) => {
          console.error('메시지를 불러오는 중 오류 발생:', error);
        });
    }
  }, [currentChatRoom, dispatch]);

  // WebSocket 메시지 수신
  useEffect(() => {
    if (socket && currentChatRoom) {
      socket.off('receiveMessage'); // 기존 핸들러 해제

      receiveMessage((newMessage) => {
        console.log('새 메시지 수신:', newMessage);

        // 본인이 보낸 메시지는 무시
        if (newMessage.senderId === currentUser.userId) {
          console.log('본인이 보낸 메시지입니다. 무시합니다.');
          return;
        }

        const formattedMessage = {
          roomId: newMessage.roomId,
          senderId: newMessage.senderId,
          messageText: newMessage.messageText,
          senderNickname: newMessage.senderNickname,
        };

        dispatch(addMessage(formattedMessage));
        dispatch(
          updateLastMessage({
            roomId: newMessage.roomId,
            lastMessage: newMessage.messageText,
          }),
        );
        scrollToBottom();
      });

      return () => {
        socket.off('receiveMessage'); // 핸들러 해제
      };
    }
  }, [socket, currentChatRoom, dispatch, receiveMessage, currentUser.userId]);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        senderId: currentUser.userId,
        roomId: currentChatRoom.roomId,
        messageText: message,
      };

      // 소켓을 통해 서버로 메시지 전송
      sendMessage(newMessage);

      dispatch(addMessage(newMessage));
      dispatch(
        updateLastMessage({
          roomId: currentChatRoom.roomId,
          lastMessage: message,
        }),
      );

      setMessage('');
    }
  };

  return currentChatRoom ? (
    <ChatRoom
      messages={messages.filter((msg) => msg.roomId === currentChatRoom.roomId)}
      message={message}
      handleInputChange={handleInputChange}
      handleKeyPress={handleKeyPress}
      handleSendMessage={handleSendMessage}
      currentUser={currentUser}
      messagesEndRef={messagesEndRef} // 스크롤 제어 ref 전달
    />
  ) : (
    <div className="flex justify-center items-center h-full text-l">
      왼쪽 채팅방을 선택해주세요!
    </div>
  );
};

export default ChatRoomContainer;
