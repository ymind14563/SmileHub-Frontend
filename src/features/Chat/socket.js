import { io } from 'socket.io-client';
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

// Socket.IO 서버에 연결 (서버 URL 및 옵션 설정)
const socket = io(`${REACT_APP_API_URL}`, {
  auth: {
    token: localStorage.getItem('token'), // 로컬 스토리지에 저장된 토큰을 통해 인증
  },
  transports: ['websocket'], // 웹소켓을 이용한 연결 설정
  reconnectionAttempts: 3, // 재연결 시도 횟수 설정
  timeout: 10000, // 서버 응답 대기 시간 설정 (ms)
});

export default socket;
