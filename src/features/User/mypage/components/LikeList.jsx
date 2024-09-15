import React, { useEffect, useState } from 'react';
import { Avatar } from 'flowbite-react';
import axios from 'axios';
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const LikeList = () => {
  const [likeProducts, setLikeProducts] = useState([]); // 찜 목록 상태 관리
  console.log('likeProducts', likeProducts);

  // 찜목록 가져오기
  const fetchLikesList = async () => {
    try {
      const token = localStorage.getItem('token'); // 토큰 가져오기
      const res = await axios.post(
        `${REACT_APP_API_URL}/mypage`,
        {
          mypageList: 'likes',
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );
      console.log('백엔드에서 받아온 데이터:', res.data);

      // 서버 응답 데이터가 배열인지 확인
      if (Array.isArray(res.data)) {
        setLikeProducts(res.data);
      } else {
        console.error('서버 응답 데이터가 배열이 아닙니다:', res.data);
        setLikeProducts([]); // 데이터가 배열이 아닌 경우 빈 배열로 설정
      }
    } catch (error) {
      console.error('마운트시 찜목록 불러오기 오류', error);
    }
  };

  useEffect(() => {
    fetchLikesList();
  }, []);

  // 찜목록 삭제
  const deleteLike = async (productId) => {
    const token = localStorage.getItem('token'); // 토큰 가져오기
    try {
      const res = await axios.delete(
        `${REACT_APP_API_URL}/mypage/likesdelete?productId=${productId}`,
        {
          headers: {
            Authorization: token,
          },
        },
      );
      if (res.status === 200) {
        setLikeProducts(
          likeProducts.filter((product) => product.productId !== productId),
        );
        fetchLikesList();
      }
    } catch (error) {
      console.error('찜목록 삭제 오류', error);
    }
  };

  return (
    <section className="flex flex-wrap">
      {likeProducts.length > 0 ? (
        <div className="flex flex-wrap">
          {likeProducts.map((product) => (
            <div key={product.productId} className="p-2 w-full sm:w-1/2">
              <div className="relative flex items-center bg-white p-4 rounded-lg border border-gray-200">
                <img
                  src="/images/likeY.png"
                  alt="Like"
                  className="absolute top-2 right-2 w-6 h-6 cursor-pointer"
                  onClick={() => deleteLike(product.productId)}
                />
                <Avatar
                  img={
                    product.ProductImages.length === 0 ||
                    !product.ProductImages[0].productImage
                      ? '/images/product.png'
                      : product.ProductImages[0].productImage
                  }
                  size="lg"
                  className="flex items-center justify-center rounded-lg"
                />
                {product.status === '배송완료' && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                    <span className="text-white text-xl font-bold">
                      판매완료
                    </span>
                  </div>
                )}
                <div className="ml-4 flex-1">
                  <h2 className="text-lg">{product.productName}</h2>
                  <p className="text-xl font-bold text-gray-800 mt-1">
                    {product.price}원
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>찜목록이 없습니다.</p>
      )}
    </section>
  );
};

export default LikeList;
