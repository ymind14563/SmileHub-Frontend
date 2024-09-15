import React, { useState } from 'react';
import { Modal } from '../shared/Modal';
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const ChatButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const openChatPage = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      // 토큰이 없을 때 로그인 모달을 띄움
      setModalMessage('로그인이 필요합니다.');
      setIsModalOpen(true);
    } else {
      // 토큰이 있을 때 새로운 창을 가운데 정렬하여 열기
      const width = 1000;
      const height = 600;
      const left = (window.innerWidth - width) / 2;
      const top = (window.innerHeight - height) / 2;

      window.open(
        '/chat',
        '_blank',
        `width=${width},height=${height},left=${left},top=${top}`,
      );
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  return (
    <>
      <button
        onClick={openChatPage}
        className="fixed z-10 bottom-16 right-16 bg-blue-500 text-white px-8 py-3 rounded-full shadow-lg text-lg tracking-widest hover:bg-blue-600"
      >
        Chat
      </button>

      {/* 로그인 모달 */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleCloseModal}
        message={modalMessage}
        showCancelButton={false} // 취소 버튼 숨김
      />
    </>
  );
};

export default ChatButton;

// const handleChatButtonClick = async (productId, buyerId, sellerId) => {
//   try {
//     // 채팅방이 이미 존재하는지 서버에 확인 후 방 생성
//     const response = await axios.post(`${REACT_APP_API_URL}/room`, {
//       productId,
//       buyerId,
//       sellerId,
//     }, {
//       headers: {
//         Authorization: localStorage.getItem('token'),
//       }
//     });

//     const { roomId } = response.data; // 생성되거나 이미 존재하는 roomId

//     // 채팅방 페이지를 새로운 창으로 열기
//     window.open(`/chat/${roomId}`, '_blank');
//   } catch (error) {
//     console.error('채팅방을 생성하는 중 오류 발생:', error);
//   }
// };

// {
// <button onClick={() => handleChatButtonClick(productId, buyerId, sellerId)}>
//  채팅하기
// </button>
// }
