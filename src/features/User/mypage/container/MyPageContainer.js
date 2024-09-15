import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteUser, setUserField } from '../../store/userSlice';
import axios from 'axios';
import MyPage from '../../../../pages/User/MyPage';
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const MyPageContainer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // 충전하기 버튼 클릭시 모달 상태 관리

  const currentUser = useSelector((state) => state.user.currentUser);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleEdit = () => {
    navigate('/mypageEdit');
  };

  // 회원 탈퇴
  const handleDelete = async () => {
    const isDelete = window.confirm('회원을 탈퇴하시겠습니까?');

    if (isDelete) {
      try {
        const userId = currentUser.userId; // 현재 사용자 ID
        const token = localStorage.getItem('token'); // 토큰 가져오기

        console.log('userId:', userId);
        console.log('Token:', token);

        // DELETE 요청에 Authorization 헤더 추가
        await axios.delete(`${REACT_APP_API_URL}/user/${userId}`, {
          headers: {
            Authorization: token,
          },
        });

        dispatch(deleteUser()); // Redux 상태 업데이트 (회원 삭제 처리)
        // 토큰 제거
        localStorage.removeItem('token');
        alert('그동안 이용해주셔서 감사합니다.');
        navigate('/');
      } catch (error) {
        console.error('회원 탈퇴 중 오류가 발생했습니다:', error);
        alert('회원 탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  // 충전하기 버튼 클릭시
  const openModal = () => {
    console.log('충전하기 버튼 클릭');
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <MyPage
      currentUser={currentUser}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      isModalOpen={isModalOpen}
      openModal={openModal}
      closeModal={closeModal}
    />
  );
};

export default MyPageContainer;
