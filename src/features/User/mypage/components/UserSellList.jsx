import React, { useEffect, useState } from 'react';
import { Avatar } from 'flowbite-react';
import axios from 'axios';
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const UserSellList = ({ fetchSellsList }) => {
  const [sells, setSells] = useState([]); // 판매내역 상태관리

  // 판매내역 불러오기
  const fetchSells = async () => {
    const token = localStorage.getItem('token'); // 토큰 가져오기
    try {
      const res = await axios.post(
        `${REACT_APP_API_URL}/mypage`,
        {
          mypageList: 'sell',
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );
      console.log('판매 내역:', res.data);
      setSells(res.data);
    } catch (error) {
      console.error('판매내역 불러오기 오류', error);
    }
  };

  // 컴포넌트가 마운트될 때 판매 내역 불러오기
  useEffect(() => {
    fetchSells();
  }, []);

  // 수락 버튼 클릭
  const handleAcceptSell = async (productId) => {
    const token = localStorage.getItem('token'); // 토큰 가져오기
    try {
      const res = await axios.post(
        `${REACT_APP_API_URL}/mypage/issell`,
        {
          productId,
          status: 'yes',
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );
      if (res.status === 200) {
        fetchSells(); // 판매 내역 업데이트
      }
    } catch (error) {
      console.error('수락 버튼 클릭 오류', error);
    }
  };

  // 거절 버튼 클릭
  const handleRejectSell = async (productId) => {
    const token = localStorage.getItem('token'); // 토큰 가져오기
    try {
      const res = await axios.post(
        `${REACT_APP_API_URL}/mypage/issell`,
        {
          productId,
          status: 'no',
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );
      console.log('res?', res.data);

      if (res.status === 200) {
        fetchSells(); // 판매 내역 업데이트
      }
    } catch (error) {
      console.error('거절 버튼 클릭 오류', error);
    }
  };

  // 발송 완료 클릭
  const handleCompleteSell = async (productId) => {
    const token = localStorage.getItem('token'); // 토큰 가져오기
    try {
      const res = await axios.post(
        `${REACT_APP_API_URL}/mypage/issell`,
        {
          productId,
          status: 'send',
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );
      if (res.status === 200) {
        fetchSells(); // 판매 내역 업데이트
      }
    } catch (error) {
      console.error('발송 완료 버튼 클릭 오류', error);
    }
  };

  return (
    <>
      <section className="border-b border-gray-200">
        <div className="flex flex-col p-4">
          {sells.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {sells.map((sell) => (
                <div
                  key={sell.productId}
                  className="flex items-center bg-white shadow-md p-4 rounded-lg"
                >
                  <Avatar
                    img={
                      sell.ProductImages.length === 0 ||
                      !sell.ProductImages[0].productImage
                        ? '/images/product.png'
                        : sell.ProductImages[0].productImage
                    }
                    size="lg"
                    className="flex items-center justify-center rounded-lg"
                  />
                  <div className="ml-6 flex-1">
                    <h2 className="text-lg font-semibold">
                      {sell.productName}
                    </h2>
                    <p className="text-xl font-bold text-gray-800 mt-2">
                      {sell.price}원
                    </p>
                    <p className="text-gray-500 mt-1">{sell.status}</p>
                  </div>

                  {sell.status === '판매중' && (
                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        className="px-4 py-2 bg-gray-200 text-[#101820] hover:bg-[#FEE715] hover:text-[#101820] rounded-md transition-colors duration-300"
                        onClick={() => handleAcceptSell(sell.productId)}
                      >
                        수락
                      </button>
                      <button
                        className="px-4 py-2 bg-gray-200 text-[#101820] hover:bg-red-500 hover:text-white rounded-md transition-colors duration-300"
                        onClick={() => handleRejectSell(sell.productId)}
                      >
                        거절
                      </button>
                    </div>
                  )}
                  {sell.status === '배송대기중' && (
                    <button
                      className="px-2 py-1 bg-gray-200 text-[#101820] hover:bg-[#FEE715] hover:text-[#101820] rounded-md ml-4 transition-colors duration-300"
                      onClick={() => handleCompleteSell(sell.productId)}
                    >
                      발송 완료
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">판매 내역이 없습니다.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default UserSellList;
