import React, { useState } from 'react';
import UserTabPage from '../../features/Admin/UserTab/container/UserTabPage';
import ProductTabPage from '../../features/Admin/ProductTab/container/ProductTabPage';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="p-4">
      <div className="flex justify-around mb-4">
        <div className="flex w-1/2 justify-center">
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full px-4 py-2 ${activeTab === 'users' ? 'bg-[#FEE715] text-white' : 'bg-gray-300'}`}
          >
            회원 관리
          </button>
        </div>
        <div className="flex w-1/2 justify-center">
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full px-4 py-2 ${activeTab === 'products' ? 'bg-[#FEE715] text-white' : 'bg-gray-300'}`}
          >
            상품 관리
          </button>
        </div>
      </div>

      <div>{activeTab === 'users' ? <UserTabPage /> : <ProductTabPage />}</div>
    </div>
  );
};

export default AdminPage;
