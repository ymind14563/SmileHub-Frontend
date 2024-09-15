import { useEffect, useState } from 'react';
import io from 'socket.io-client';

let socket;
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

// WebSocket용 custom hook
const useSocket = (roomId) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 소켓 중복 생성 방지
    if (!socket) {
      socket = io(`${REACT_APP_API_URL}`);
    } else {
    }

    socket.on('connect', () => {
      console.log('소켓 연결 성공:', socket.id);
      setIsConnected(true);
    });

    socket.on('disconnect', (reason) => {
      console.log('소켓 연결 끊김, 이유:', reason);
      setIsConnected(false);
    });

    // 방에 입장
    if (roomId) {
      const token = localStorage.getItem('token');

      // 토큰을 디코딩하여 buyerId 추출
      const actualToken = token.split(' ')[1];
      const decoded = JSON.parse(atob(actualToken.split('.')[1]));
      const buyerId = decoded.userId;

      socket.emit('joinRoom', { roomId, buyerId, token });
      console.log('방에 입장 요청:', roomId, buyerId);
    }

    return () => {
      console.log('소켓 연결 해제:', socket.id); // 컴포넌트 언마운트 시 해제 확인
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [roomId]);

  // 메시지 전송
  const sendMessage = (message) => {
    if (socket) {
      console.log('메시지 전송:', message);

      socket.emit('sendMessage', {
        roomId: message.roomId,
        senderId: message.senderId,
        messageText: message.messageText,
      });
    }
  };

  // 메시지 수신
  const receiveMessage = (callback) => {
    if (socket) {
      socket.on('receiveMessage', (message) => {
        console.log('클라이언트에서 수신된 메시지:', message);
        callback({
          roomId: message.roomId,
          senderId: message.senderId,
          messageText: message.messageText,
        });
      });
    }
  };

  return { socket, sendMessage, receiveMessage, isConnected };
};

export default useSocket;
