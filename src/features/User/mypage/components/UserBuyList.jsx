import React, { useEffect, useState } from 'react';
import { Avatar } from 'flowbite-react';
import axios from 'axios';
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const UserBuyList = () => {
  const [buys, setBuys] = useState(''); // 구매내역 상태 관리
  console.log('buys >>>', buys);

  // 구매내역 불러오기
  const fetchBuysList = async () => {
    const token = localStorage.getItem('token'); // 토큰 가져오기
    try {
      const res = await axios.post(
        `${REACT_APP_API_URL}/api/mypage`,
        {
          mypageList: 'buy',
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );

      setBuys(res.data);
    } catch (error) {
      console.error('구매내역 불러오기 오류', error);
    }
  };

  useEffect(() => {
    console.log('구매내역 업데이트 완료', buys);
    fetchBuysList();
  }, []);

  // 상품 확인 완료 버튼 클릭
  const handleConfirmDelivery = async (productId, userId) => {
    const token = localStorage.getItem('token'); // 토큰 가져오기
    try {
      const res = await axios.post(
        `${REACT_APP_API_URL}/api/mypage/check`,
        {
          productId,
          status: 'yes',
          userId,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );
      if (res.status === 200) {
        fetchBuysList();
      }
    } catch (error) {
      console.error('상품 확인 완료 버튼 클릭 오류', error);
    }
  };

  // 거절 버튼 클릭
  // const handleRejectBuy = async (productId, userId) => {
  //   const token = localStorage.getItem('token'); // 토큰 가져오기
  //   try {
  //     const res = await axios.post(
  //       'http://localhost:8000/mypage/check',
  //       {
  //         productId,
  //         status: 'no',
  //         userId,
  //       },
  //       {
  //         headers: {
  //           Authorization: token,
  //         },
  //       },
  //     );
  //     if (res.status === 200) {
  //       fetchBuysList();
  //     }
  //   } catch (error) {
  //     console.error('거절 버튼 클릭 오류', error);
  //   }
  // };
  return (
    <section className="border-b border-gray-200">
      <div className="flex flex-col p-4">
        {buys.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {buys.map((buy) => (
              <div
                key={buy.productId}
                className="flex items-center bg-white shadow-md p-4 rounded-lg"
              >
                <Avatar
                  img={
                    buy.ProductImages.length === 0 ||
                    !buy.ProductImages[0].productImage
                      ? '/images/product.png'
                      : buy.ProductImages[0].productImage
                  }
                  size="lg"
                  className="flex items-center justify-center rounded-lg"
                />
                <div className="ml-6 flex-1">
                  <h2 className="text-lg font-semibold">{buy.productName}</h2>
                  <p className="text-xl font-bold text-gray-800 mt-2">
                    {buy.price}원
                  </p>
                  <p className="text-gray-500 mt-1">{buy.status}</p>
                </div>

                {buy.status === '배송완료' && (
                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      className="px-2 py-1 bg-gray-200 text-black hover:bg-[#FEE715] hover:text-[#101820] rounded-md transition-colors duration-300"
                      onClick={() =>
                        handleConfirmDelivery(buy.productId, buy.userId)
                      }
                    >
                      상태확인 완료
                    </button>
                    {/* <button
                      className="px-2 py-1 bg-gray-200 text-[#101820] hover:bg-red-500 hover:text-white rounded-md transition-colors duration-300"
                      onClick={() => handleRejectBuy(buy.productId, buy.userId)}
                    >
                      거절
                    </button> */}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">구매 내역이 없습니다.</p>
        )}
      </div>
    </section>
  );
};

export default UserBuyList;
