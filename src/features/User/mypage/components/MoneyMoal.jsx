import React, { useState, useRef } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { addMoney } from '../../store/userSlice';
import axios from 'axios';
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const MoneyMoal = ({ isModalOpen, closeModal }) => {
  const [isMoneyInput, setIsMoneyInput] = useState(''); // 충전할 금액 상태 관리
  const userId = useSelector((state) => state.user.currentUser.userId);
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  const chargeMoney = async () => {
    const token = localStorage.getItem('token'); // 토큰 가져오기
    try {
      const res = await axios.post(
        `${REACT_APP_API_URL}/user/money/${userId}`,
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
        <input
          type="number"
          placeholder="충전할 금액을 작성해주세요."
          value={isMoneyInput}
          onChange={(e) => setIsMoneyInput(Number(e.target.value))}
          ref={inputRef}
          className="w-full border-2 border-[#101820] focus:border-4 focus:border-black focus:ring-0 rounded-md py-2 px-3 mb-4 sm:mb-6"
        />
        <div className="flex flex-col sm:flex-row my-4 space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            className="px-6 py-2 bg-[#FEE715] text-[#101820] hover:bg-[#101820] hover:text-[#FEE715] rounded-md transition-colors duration-300"
            onClick={chargeMoney}
          >
            충전하기
          </button>
          <button
            className="px-6 py-2 bg-gray-200 text-[#101820] rounded-md transition-colors duration-300"
            onClick={closeModal}
          >
            닫기
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MoneyMoal;
