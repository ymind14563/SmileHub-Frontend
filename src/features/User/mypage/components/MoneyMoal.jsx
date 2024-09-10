import React, { useState } from 'react';
import Modal from 'react-modal';
import { Button, TextInput } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { addMoney } from '../../store/userSlice';
import axios from 'axios';

const MoneyMoal = ({ isModalOpen, closeModal }) => {
  const [isMoneyInput, setIsMoneyInput] = useState(''); // 충전할 금액 상태 관리
  const userId = useSelector((state) => state.user.currentUser.userId);
  console.log('userId', userId);

  const dispatch = useDispatch();

  const chargeMoney = async () => {
    const token = localStorage.getItem('token'); // 토큰 가져오기
    try {
      const res = await axios.post(
        `http://localhost:8000/user/money/${userId}`,
        {
          money: isMoneyInput,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );
      if (res.status === 201) {
        dispatch(addMoney(isMoneyInput));
        setIsMoneyInput('');
        closeModal();
      }
    } catch (error) {
      console.error('머니 충전하기 중 오류', error);
    }
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      className="fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-3 sm:max-w-xl h-auto">
        <h2 className="text-xl font-bold mb-4">머니 충전하기</h2>
        <TextInput
          type="number"
          placeholder="충전할 금액을 작성해주세요."
          value={isMoneyInput}
          onChange={(e) => setIsMoneyInput(Number(e.target.value))}
        />
        <div className="flex my-3">
          <Button className="mr-3" onClick={chargeMoney}>
            충전하기
          </Button>
          <Button onClick={closeModal}>닫기</Button>
        </div>
      </div>
    </Modal>
  );
};

export default MoneyMoal;
