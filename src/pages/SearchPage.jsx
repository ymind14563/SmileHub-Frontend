// SearchResults.js
import axios from 'axios';
import React, { useState } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';

const SearchResults = () => {
  const location = useLocation();
  const { results } = location.state || { results: [] }; // 결과가 없을 경우를 대비

  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchType, setSearchType] = useState('name');
  // seller

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
  };

  const submitSearch = async () => {
    if (!searchKeyword.trim()) {
      alert('검색어를 입력해주세요.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:8000/product/search', {
        searchKeyword: searchKeyword,
        searchType: searchType,
      });
      console.log('submitSearch res =>', res.data.result);

      if (res.data && res.data.result) {
        console.log('submitSearch res =>', res.data.result);
        Navigate('/search', {
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
      <h1 className="text-2xl font-bold mb-4">검색 결과</h1>
      {/* 검색창 */}
      <section className="flex justify-center items-center mb-8">
        <select
          value={searchType}
          onChange={handleSearchTypeChange}
          className=" border-yellow-300 border-2 rounded-md "
        >
          <option value="name">상품명</option>
          <option value="seller">판매자</option>
        </select>
        <input
          type="text"
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="판매 물품, 판매자 검색"
          className="w-1/2 m-3 rounded-md border-yellow-300 border-4 h-10" // 높이 추가
        />
        <button
          onClick={submitSearch}
          className="px-3 h-10 bg-yellow-300 text-white rounded-md" // 높이 추가
        >
          검색
        </button>
      </section>
      {/* 검색 결과 섹션 */}
      <section className="mx-5">
        {results.length > 0 ? (
          results.map((productInfo) => (
            <div
              key={productInfo.productId}
              className="flexcard back w-full mt-3 p-3"
            >
              <Link to={`/product/read?productId=${productInfo.productId}`}>
                <div
                  className="flex md:w-80 w-full flex-col bg-white border border-coolGray-100 shadow-dashboard rounded-md 
                h-auto hover:border-yellow-300 hover:border-2 hover:duration-200 overflow-hidden transform origin-bottom transition duration-400 ease-in 
                min-w-60 relative"
                >
                  <h2 className="tracking-tight text-gray-900 text-lg font-bold hover:underline block mb-2">
                    {productInfo.productId}번
                  </h2>
                  <div>{productInfo.images}</div>
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
                            {productInfo.Location
                              ? `${productInfo.Location.depth1}, ${productInfo.Location.depth2}, ${productInfo.Location.depth3}`
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
          ))
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </section>
    </>
  );
};
export default SearchResults;
