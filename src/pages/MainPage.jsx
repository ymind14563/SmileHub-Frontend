import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../shared/input';

export default function MainPage() {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);

  const limit = 20;
  const navigate = useNavigate();

  useEffect(() => {
    const getProductList = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:8000/product/list?page=${page}&limit=${limit}`,
        );

        const newProductInfo = res.data.productInfo;
        const newImages = res.data.images;

        console.log('New Product Info:', newProductInfo);

        setProductList((prevProductList) => {
          const existingIds = new Set(
            prevProductList.map((item) => item.productId),
          );

          const updatedList = [
            ...prevProductList,
            ...newProductInfo.filter(
              (newItem) => !existingIds.has(newItem.productId),
            ),
          ];

          console.log('Updated Product List:', updatedList);
          return updatedList;
        });
        setImages((prevImages) => [...prevImages, ...newImages]);
      } catch (error) {
        console.log(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getProductList();
  }, [page]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 1
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const renderProduct = (productInfo, index) => {
    const productImages = images[index] || [];
    return (
      <section className="mx-5">
        <div
          key={productInfo.productId}
          className="flexcard back w-full mt-3  p-3 "
        >
          <Link to={`/product/read?productId=${productInfo.productId}`}>
            <div
              className="flex  md:w-80 w-full  flex-col bg-white border border-coolGray-100 shadow-dashboard rounded-xl 
              h-auto hover:border-[#FEE715]  hover:border-2 hover:duration-200 overflow-hidden transform origin-bottom transition duration-400 ease-in 
              min-w-60 relative"
            >
              <div className="flex justify-center items-center">
                {productImages.length > 0 ? (
                  <img
                    src={productImages[0].productImage}
                    alt={productInfo.productName}
                    className="w-24 sm:w-32 md:w-40 lg:w-48 h-auto object-cover"
                  />
                ) : (
                  <img
                    src="/images/product.png"
                    alt="기본 이미지"
                    className="w-24 sm:w-32 md:w-40 lg:w-48 h-auto object-cover"
                  />
                )}
              </div>

              <div className="flex flex-col justify-center items-start px-4 pt-4 pb-4">
                <h2 className="tracking-tight text-gray-900 text-lg font-bold hover:underline block mb-2">
                  {productInfo.productName}
                </h2>
                <h3 className="mt-2 text-sm text-gray-700 line-clamp-3">
                  {productInfo.content.length > 100
                    ? `${productInfo.content.slice(0, 100)}...`
                    : productInfo.content}
                </h3>
                <div className="border-t border-gray-300 pt-2 mt-2 w-full">
                  <div className="flex flex-wrap items-center text-gray-400 text-xs mt-1">
                    <span className="font-medium text-gray-400 text-sm w-1/2">
                      {productInfo.price}
                    </span>
                    <span className="font-medium text-gray-400 text-sm w-1/2">
                      <div>
                        {productInfo['Location.depth1']
                          ? `${productInfo['Location.depth1']} ${productInfo['Location.depth2']} ${productInfo['Location.depth3']}`
                          : '주소 정보가 없습니다.'}
                      </div>
                    </span>

                    <span className="font-medium text-gray-400 text-sm w-1/2">
                      {productInfo.nickname}
                    </span>
                    <span className="font-medium text-gray-400 text-sm w-1/2">
                      {new Date(productInfo.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>
    );
  };

  const [searchKeyword, setSearchKeyword] = useState('');

  const submitSearch = async () => {
    if (!searchKeyword.trim()) {
      alert('검색어를 입력해주세요.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:8000/product/search', {
        searchKeyword: searchKeyword,
        searchType: 'name',
      });
      console.log('submitSearch res =>', res.data.result);

      if (res.data && res.data.result) {
        console.log('submitSearch res =>', res.data.result);
        navigate('/search', {
          state: { results: res.data.result },
        });
      } else {
        alert('검색 결과가 없습니다.');
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      console.log(e.target.value);

      submitSearch();
    }
  };

  return (
    <>
      {/* 검색창 */}
      <section className="flex justify-center items-center mb-8">
        <div className="w-1/2">
          <Input
            type="text"
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="판매 물품 검색"
          />
        </div>

        {/* <input className="w-1/2 m-3 rounded-md border-[#FEE715] hover:border-black focus-visible:outline  border-4 h-10" /> */}
        <button
          onClick={submitSearch}
          className="px-3 ml-4 h-10 bg-[#FEE715] text-[#101820] hover:bg-[#101820] hover:text-[#FEE715] transition rounded-xl" // 높이 추가
        >
          검색
        </button>
      </section>

      <section className="flex flex-wrap px-16 py-8 bg-gray-50 min-h-screen justify-center">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-900">{error}</p>}
        {productList.map(renderProduct)}
      </section>
    </>
  );
}
