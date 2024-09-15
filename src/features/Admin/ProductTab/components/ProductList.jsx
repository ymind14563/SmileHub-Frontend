import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { removeProduct } from '../store/productTabSlice';
import { Modal } from '../../../../shared/Modal';
import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
const ProductList = ({ searchResults, setSearchResults }) => {
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleRemove = (productId) => {
    setSelectedProduct(productId);
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    const token = localStorage.getItem('token');

    try {
      await axios.delete(
        `${REACT_APP_API_URL}/api/product/delete?productId=${selectedProduct}`,
        {
          headers: { Authorization: token },
        },
      );

      dispatch(removeProduct(selectedProduct));

      setIsModalOpen(false);
    } catch (error) {
      console.error('삭제 요청 중 오류 발생:', error);
    }
  };

  return (
    <div>
      <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 text-center align-middle">상품번호</th>
            <th className="px-4 py-2 text-center align-middle">상품명</th>
            <th className="px-4 py-2 text-center align-middle">가격</th>
            <th className="px-4 py-2 text-center align-middle">판매자</th>
            <th className="px-4 py-2 text-center align-middle">등록일</th>
            <th className="px-4 py-2 text-center align-middle">신고수</th>
            <th className="px-4 py-2 text-center align-middle">현재상태</th>
            <th className="px-4 py-2 text-center align-middle">삭제</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center py-4 text-lg">
                등록된 상품이 없습니다.
              </td>
            </tr>
          ) : (
            searchResults.map((product) => {
              const formattedDate = new Date(product.createdAt)
                .toISOString()
                .slice(0, 10);
              return (
                <tr key={product.productId} className="border-b">
                  <td className="px-4 py-2 text-center align-middle">
                    {product.productId}
                  </td>
                  <td className="px-4 py-2 text-center align-middle">
                    {product.productName}
                  </td>
                  <td className="px-4 py-2 text-center align-middle">
                    {product.price}
                  </td>
                  <td className="px-4 py-2 text-center align-middle">
                    {product.seller}
                  </td>
                  <td className="px-4 py-2 text-center align-middle">
                    {formattedDate}
                  </td>
                  <td className="px-4 py-2 text-center align-middle">
                    {product.reports}
                  </td>
                  <td className="px-4 py-2 text-center align-middle">
                    <span
                      className={`${
                        product.status === '판매완료'
                          ? 'text-red-400'
                          : 'text-green-400'
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center align-middle">
                    <button
                      onClick={() => handleRemove(product.productId)}
                      className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        message="정말 삭제하시겠습니까?"
      />
    </div>
  );
};

export default ProductList;
