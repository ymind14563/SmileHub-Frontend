import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import ChatRoomList from '../components/ChatRoomList';
import { setCurrentChatRoom } from '../../ChatRoom/store/chatRoomSlice'; // 현재 선택된 채팅방 관리
import {
  setRooms,
  updateLastMessage,
} from '../../ChatRoomList/store/chatRoomListSlice'; // 전체 채팅방 목록 관리
import socket from '../../socket';
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const ChatRoomListContainer = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const chatRooms = useSelector((state) => state.chatRoomList.rooms);
  console.log(
    "🚀 ~ useEffect ~  localStorage.getItem('token'):",
    localStorage.getItem('token'),
  );
  useEffect(() => {
    if (!currentUser || !currentUser.userId) return;

    // 서버에서 채팅방 목록과 마지막 메시지 불러오기
    axios
      .get(`${REACT_APP_API_URL}/api/room/list/${currentUser.userId}`, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
      .then((response) => {
        const rooms = response.data.map((room) => ({
          ...room,
          lastMessage:
            room.Messages && room.Messages.length > 0
              ? room.Messages[0].messageText // 서버에서 받은 마지막 메시지 설정
              : '아직 메세지가 없습니다.',
        }));

        dispatch(setRooms(rooms)); // 채팅방 목록에 마지막 메시지 포함하여 state에 저장
      })
      .catch((error) => {
        console.error('채팅방 목록을 불러오는 중 오류 발생:', error);
      });

    // 소켓으로부터 마지막 메시지 실시간 업데이트 수신
    socket.on('updateLastMessage', ({ roomId, lastMessage }) => {
      dispatch(updateLastMessage({ roomId, lastMessage }));
    });

    return () => {
      socket.off('updateLastMessage'); // 컴포넌트 언마운트 시 해제
    };
  }, [dispatch, currentUser]);

  const handleSelectRoom = (roomId) => {
    const selectedRoom = chatRooms.find((room) => room.roomId === roomId);

    if (!selectedRoom) {
      console.error('선택한 채팅방을 찾을 수 없습니다.');
      return;
    }

    const buyerId = currentUser.userId;

    // 방이 있으면 선택한 방의 상품 아이디
    // 방이 없으면 채팅시작 버튼이 있는 상품의 아이디를 가져와야 함
    const productId = selectedRoom.productId;

    socket.emit('joinRoom', {
      roomId,
      buyerId,
      productId,
      token: localStorage.getItem('token'),
    });

    // 선택한 현재 채팅방 설정
    dispatch(setCurrentChatRoom(selectedRoom));

    // 해당 채팅방의 메시지를 불러와서 마지막 메시지를 업데이트
    if (
      !selectedRoom.lastMessage ||
      selectedRoom.lastMessage === '아직 메세지가 없습니다.'
    ) {
      axios
        .get(`${REACT_APP_API_URL}/api/message/${roomId}`, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        })
        .then((response) => {
          if (response.data.length > 0) {
            const lastMessage =
              response.data[response.data.length - 1].messageText;
            dispatch(updateLastMessage({ roomId, lastMessage }));
          }
        })
        .catch((error) => {
          console.error('메시지를 불러오는 중 오류 발생:', error);
        });
    }
  };

  return (
    <ChatRoomList
      chatRooms={chatRooms || []}
      handleSelectRoom={handleSelectRoom}
    />
  );
};

export default ChatRoomListContainer;
