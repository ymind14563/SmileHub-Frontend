import React, { useState } from 'react';

const UserSearchForm = ({ onSearch, onReset, onStatusChange }) => {
  const [searchType, setSearchType] = useState('nickname');
  const [value, setValue] = useState('');
  const [status, setStatus] = useState('전체');

  const handleSearch = () => {
    onSearch({ searchType, value, status });
  };

  const handleReset = () => {
    setSearchType('nickname');
    setValue('');
    setStatus('전체');
    onReset(); // 부모 컴포넌트에서 전체 유저 리스트를 다시 보여줌
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    onStatusChange(newStatus);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md mb-6">
      {/* 라디오 버튼 */}
      <div className="mb-4 flex justify-center space-x-4 py-2">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="전체"
            checked={status === '전체'}
            onChange={() => handleStatusChange('전체')}
            className="form-radio appearance-none rounded-full h-4 w-4 border border-gray-300 checked:bg-[#FEE715] checked:border-transparent focus:outline-none"
          />
          <span>전체</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="활동중"
            checked={status === '활동중'}
            onChange={() => handleStatusChange('활동중')}
            className="form-radio appearance-none rounded-full h-4 w-4 border border-gray-300 checked:bg-[#FEE715] checked:border-transparent focus:outline-none"
          />
          <span>활동중</span>
        </label>
        <label className="flex items-center space-x-3">
          <input
            type="radio"
            value="활동정지"
            checked={status === '활동정지'}
            onChange={() => handleStatusChange('활동정지')}
            className="form-radio appearance-none rounded-full h-4 w-4 border border-gray-300 checked:bg-[#FEE715] checked:border-transparent focus:outline-none"
          />
          <span>활동정지</span>
        </label>
      </div>

      {/* 검색 영역 */}
      <div className="flex space-x-4 justify-center items-center py-2">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="p-2 border rounded-md w-1/6 text-center"
        >
          <option value="nickname">닉네임</option>
          <option value="email">이메일</option>
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

export default UserSearchForm;
