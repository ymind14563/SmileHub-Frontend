import React, { useState } from 'react';
import { Avatar, Label, Checkbox } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import AddressSearch from '../../features/User/Register/components/AddressSearch';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MoneyMoal from '../../features/User/mypage/components/MoneyMoal';
import { pay } from '../../features/User/store/userSlice';
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const PaymentPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // 주소 modal 상태관리
  const [isMoneyModal, setIsMoneyModal] = useState(false); // 충전하기 버튼 클릭시 모달 상태 관리
  const [temporaryAddress, setTemporaryAddress] = useState(''); // 일회성 주소 상태
  const [temporaryDetailAddress, setTemporaryDetailAddress] = useState(''); // 상세 주소 상태
  const [isDetailAddressComplete, setIsDetailAddressComplete] = useState(false); // 상세 주소 입력 완료 상태
  const [moneyInput, setMoneyInput] = useState(''); // 결제 금액 입력 상태
  const [error, setError] = useState(''); // 에러 상태
  const [checkError, setCheckError] = useState(''); // 체크박스 에러 상태
  const [isCheck, setIsCheck] = useState({
    paymentCheck: false,
    infoCheck: false,
    eventCheck: false,
  }); // 각각 동의 상태

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const address = useSelector((state) => state.user.currentUser.address);
  const detailAddress = useSelector(
    (state) => state.user.currentUser.address.detailAddress,
  );
  const nickname = useSelector((state) => state.user.currentUser.nickname);
  const money = useSelector((status) => status.user.currentUser.money);

  const location = useLocation();
  // const productId = location.state?.productId; // 상세 페이지에서 전달받은 productId
  // console.log('productId>>>>', productId);
  // const product = location.state;
  // console.log('product >>>', product);
  const { state } = location;
  const productId = state?.productId;
  const product = state?.product;
  console.log('product >>>>', product);

  // 주소 변경 클릭시
  const handleAddressChange = (newAddress) => {
    setTemporaryAddress(newAddress);
    setIsDetailAddressComplete(false); // 주소 변경 시 상세주소 입력 상태 초기화
    setTemporaryDetailAddress(''); // 상세 주소 초기화
  };

  // 상세주소 입력
  const handleDetailAddressChange = (event) => {
    setTemporaryDetailAddress(event.target.value);
  };

  // 상세주소 입력 후 완료버튼 클릭시
  const handleComplete = () => {
    setIsDetailAddressComplete(true);
  };

  // 금액 입력 변경될 때 에러 메시지 초기화
  const handleInputChange = (event) => {
    setMoneyInput(event.target.value);
    setError('');
  };

  // 각각 체크박스 상태 변경
  const handleCheckChange = (name) => {
    setIsCheck((prev) => {
      const newCheck = { ...prev, [name]: !prev[name] }; // 체크박스 상태반전
      const allChecked = Object.values(newCheck).every((checked) => checked); // 모든 체크 상태 확인
      return {
        ...newCheck,
        allCheck: allChecked,
      };
    });
  };

  // 모두 동의 체크
  const handleAllCheck = () => {
    const newAllCheck = !isCheck.paymentCheck;
    setIsCheck({
      paymentCheck: newAllCheck,
      infoCheck: newAllCheck,
      eventCheck: newAllCheck,
    });
  };

  // 충전하기 버튼 클릭시
  const openModal = () => {
    console.log('충전하기 버튼 클릭');
    setIsMoneyModal(true);
  };
  const closeModal = () => {
    setIsMoneyModal(false);
  };

  // 결제하기
  const handlePayment = async () => {
    // 유효성 검사
    if (!moneyInput || isNaN(moneyInput) || Number(moneyInput) <= 0) {
      setError('유효한 금액을 입력하세요.');
      return;
    }

    if (Number(moneyInput) > money) {
      setError('잔액이 부족합니다.');
      return;
    }

    // 금액이 상품 가격과 동일한지 확인
    if (Number(moneyInput) !== product.price) {
      setError('결제 금액이 상품 가격과 일치하지 않습니다.');
      return;
    }

    // 필수 체크박스 확인
    if (!isCheck.paymentCheck || !isCheck.infoCheck) {
      setCheckError('필수 약관에 동의해야 결제가 가능합니다.');
      return;
    }

    const token = localStorage.getItem('token'); // 토큰 가져오기

    try {
      const res = await axios.post(
        `${REACT_APP_API_URL}/mypage/payment`,
        {
          productId,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );
      if (res.status === 200) {
        dispatch(pay(moneyInput));
        alert('결제가 완료되었습니다.');
        setMoneyInput('');
        setError('');
        setCheckError('');
        navigate('/mypage');
      }
    } catch (error) {
      console.error('결제중 오류', error);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center px-2 pt-4 sm:px-5 sm:pt-4 bg-gray-50">
        <img
          src="/images/back.png"
          alt="back"
          onClick={() => navigate(-1)}
          className="w-5"
        />
      </div>
      <main className="flex justify-center p-2 sm:p-5 bg-gray-50">
        <div className="flex flex-col justify-between gap-3 w-full max-w-xl sm:max-w-2xl mt-3 sm:mt-5">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 sm:mb-3">
            안전결제하기
          </h1>

          <div className="font-semibold my-2 sm:mb-2 text-xl">주문상품정보</div>
          <section className="border p-3 sm:p-4 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="ml-3 sm:ml-4 flex-1">
                <h2 className="text-base sm:text-lg font-semibold">
                  {product.productName}
                </h2>
                <p className="text-lg sm:text-xl font-bold text-gray-800 mt-1">
                  {product.price}원
                </p>
              </div>
            </div>
          </section>

          <div className="font-semibold my-2 text-xl">배송지</div>
          <section className="border p-3 sm:p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <div className="font-semibold text-sm sm:text-base">
                {nickname}
              </div>
              <div
                className="text-blue-500 cursor-pointer text-sm sm:text-base"
                onClick={() => setIsModalOpen(true)}
              >
                주소변경
              </div>
            </div>
            <div className="mt-1 sm:mt-2 text-sm sm:text-base">
              {temporaryAddress
                ? `${temporaryAddress}${isDetailAddressComplete ? `, ${temporaryDetailAddress}` : ''}`
                : `${address.sido} ${address.sigungu} ${address.bname} ${detailAddress}`}
            </div>

            {!isDetailAddressComplete && temporaryAddress && (
              <div className="flex items-center gap-2 mt-2 sm:mt-3 w-full sm:max-w-md">
                <input
                  id="detailAddress"
                  type="text"
                  className="flex-1"
                  placeholder="상세주소를 입력하세요"
                  value={temporaryDetailAddress}
                  onChange={handleDetailAddressChange}
                />
                <button className="h-full ml-2" onClick={handleComplete}>
                  완료
                </button>
              </div>
            )}
          </section>

          <div className="font-semibold my-2 text-xl">머니 사용하기</div>
          <section className="border p-3 sm:p-4 rounded-lg shadow-md">
            <div className="font-semibold text-sm sm:text-base ">결제 금액</div>
            <div className="text-lg sm:text-xl font-bold text-red-500 mb-2">
              {product.price}원
            </div>
            <div className="flex justify-between items-center ">
              <div className="text-sm sm:text-base">
                <span>사용할 머니</span>
                <span className="text-green-500 ml-2">
                  (사용 가능 : {money} 원)
                </span>
              </div>
              <div
                className="text-blue-500 cursor-pointer text-sm sm:text-base"
                onClick={openModal}
              >
                충전하기
              </div>
            </div>
            <input
              id="money"
              type="number"
              value={moneyInput}
              onChange={handleInputChange}
              className="w-full sm:max-w-md mt-2 sm:mt-3 border-2 border-[#101820] focus:border-4 focus:border-black focus:ring-0 rounded-md"
              placeholder="사용할 금액을 입력하세요"
            />
            {error && <p className="text-red-500">{error}</p>}
          </section>

          <div className="font-semibold my-2 text-xl">약관동의</div>
          <section className="border p-3 sm:p-4 rounded-lg shadow-md">
            {checkError && <p className="text-red-500 mb-1">{checkError}</p>}
            <div
              className="flex max-w-md flex-col gap-3 sm:gap-4"
              id="checkbox"
            >
              <div className="flex items-center gap-2">
                <Checkbox
                  id="allCheck"
                  name="allCheck"
                  checked={
                    isCheck.paymentCheck &&
                    isCheck.infoCheck &&
                    isCheck.eventCheck
                  }
                  color="gray"
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  onChange={handleAllCheck}
                />
                <Label htmlFor="allCheck" className="flex font-medium text-sm">
                  모두 동의
                </Label>
              </div>
              <div className="flex items-center gap-2 ml-4 sm:ml-5">
                <Checkbox
                  id="payment"
                  name="paymentCheck"
                  required
                  checked={isCheck.paymentCheck}
                  onChange={() => handleCheckChange('paymentCheck')}
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  color="gray"
                />
                <Label htmlFor="payment" className="font-medium text-sm">
                  (필수) 결제 서비스 이용약관 동의
                </Label>
              </div>
              <div className="flex items-center gap-2 ml-4 sm:ml-5">
                <Checkbox
                  id="personalInfo"
                  name="infoCheck"
                  required
                  checked={isCheck.infoCheck}
                  onChange={() => handleCheckChange('infoCheck')}
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  color="gray"
                />
                <Label htmlFor="personalInfo" className="font-medium text-sm">
                  (필수) 개인정보 수집 및 이용 동의
                </Label>
              </div>
              <div className="flex items-center gap-2 ml-4 sm:ml-5">
                <Checkbox
                  id="eventCheck"
                  name="eventCheck"
                  checked={isCheck.eventCheck}
                  onChange={() => handleCheckChange('eventCheck')}
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  color="gray"
                />
                <Label htmlFor="eventCheck" className="font-medium text-sm">
                  (선택) 이벤트 및 혜택 알림 수신 동의
                </Label>
              </div>
            </div>
          </section>

          <button
            className="w-full h-10 mt-2 sm:mt-3 rounded-md text-sm font-semibold sm:text-base bg-[#FEE715] text-black hover:bg-black hover:text-[#FEE715] transition-colors duration-300"
            onClick={handlePayment}
          >
            결제하기
          </button>

          <MoneyMoal isModalOpen={isMoneyModal} closeModal={closeModal} />

          <AddressSearch
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            onAddressSelect={handleAddressChange}
            updateRedux={false} // Redux 상태 업데이트 방지
          />
        </div>
      </main>
    </>
  );
};

export default PaymentPage;
