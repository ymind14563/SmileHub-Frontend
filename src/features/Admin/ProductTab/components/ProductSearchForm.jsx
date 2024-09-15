import React, { useState } from 'react';

const ProductSearchForm = ({ onSearch, onReset, onStatusChange }) => {
  const [searchType, setSearchType] = useState('name');
  const [value, setValue] = useState('');
  const [includeSoldOut, setIncludeSoldOut] = useState(true);

  const handleSearch = () => {
    onSearch({ searchType, value, includeSoldOut });
  };

  const handleReset = () => {
    setSearchType('name');
    setValue('');
    setIncludeSoldOut(true);
    onReset(); // 상위 컴포넌트에서 전체 리스트를 다시 보여줌
  };

  const handleCheckboxChange = (e) => {
    setIncludeSoldOut(e.target.checked);
    onStatusChange(e.target.checked); // 체크박스 변경 상태를 상위 컴포넌트로 전달
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md mb-6">
      {/* 판매완료포함 체크박스 */}
      <div className="mb-4 flex justify-center py-2">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={includeSoldOut}
            onChange={handleCheckboxChange}
            className="form-checkbox appearance-none h-5 w-5 border border-gray-300 rounded-sm bg-[#FEE715] checked:bg-[#FEE715] focus:outline-none"
          />
          <span>판매완료 포함</span>
        </label>
      </div>

      {/* 검색 */}
      <div className="flex space-x-4 justify-center items-center py-2">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="p-2 border rounded-md w-1/6 text-center"
        >
          <option value="name">상품명</option>
          <option value="seller">판매자</option>
        </select>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="검색어를 입력하세요"
          className="p-2 border rounded-md w-3/6"
        />

        {/* 버튼 */}
        <div className="flex space-x-2">
          <button
            onClick={handleReset}
            className="bg-gray-500 text-white py-1 px-2 rounded-md hover:bg-gray-600"
            style={{
              display: 'inline-block',
              minWidth: '80px',
              textAlign: 'center',
            }}
          >
            초기화
          </button>
          <button
            onClick={handleSearch}
            className="bg-[#FEE715] text-white py-1 px-2 rounded-md hover:bg-[#FFF599]"
            style={{
              display: 'inline-block',
              minWidth: '80px',
              textAlign: 'center',
            }}
          >
            검색
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSearchForm;
