import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const AddProduct = () => {
  const [imageFiles, setImageFiles] = useState([]);
  const [price, setPrice] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setImageFiles(event.target.files); // 선택된 파일 목록
  };

  function formDataFunc() {
    // FormData 객체 생성
    const formData = new FormData();
    formData.append('productName', title);
    formData.append('content', description);
    formData.append('price', price);
    formData.append('categoryId', 3); //카테고리아이디

    // 선택된 모든 파일을 FormData에 추가
    Array.from(imageFiles).forEach((file, index) => {
      console.log('formData >> ', index, file);
      formData.append(`productImg`, file);
    });

    return formData;
  }

  const handleSubmit = async (event) => {
    event.preventDefault(); // 기본 제출 이벤트 방지

    const formData = formDataFunc();

    try {
      const token = localStorage.getItem('token');
      console.log('token >> ', token);
      const response = await axios.post(
        `${REACT_APP_API_URL}/api/product/write`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: token,
          },
        },
      );

      console.log('응답 >>>>> ', response.data);
      alert('상품이 성공적으로 추가되었습니다.');
      navigate('/');
    } catch (error) {
      console.error('상품 추가 중 오류 발생:', error);
      alert('상품 추가에 실패했습니다.');
    }
  };

  return (
    <main className="p-4 bg-gray-50 h-full">
      <h1 className="text-center text-2xl font-bold m-5">판매 글 작성</h1>
      <div className="flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl w-full max-w-3xl space-y-4"
        >
          <div>
            <label className="block text-lg font-semibold  text-gray-700  mb-2">
              파일
              <input
                type="file"
                id="productImg"
                name="productImg"
                multiple
                onChange={handleFileChange}
                required
                className="mt-1 block w-full focus:border-none   focus:ring-yellow-300 focus:ring-2  text-gray-800 border border-gray-300 rounded-xl "
              />
            </label>
            <p className="text-red-500 mb-2 text-sm">
              파일 형식은 png, jpeg, jpg 만 업로드 가능합니다.
            </p>
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              제목
              <input
                type="text"
                className="mt-1 block w-full focus:border-none  focus:ring-yellow-300 focus:ring-2  rounded-xl p-2"
                id="productName"
                name="productName"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label className="block text-gray-700 text-lg font-semibold mb-2">
              내용
              <textarea
                className="mt-1 block w-full border border-gray-300 rounded-xl p-2 h-40 resize-none focus:border-none  focus:ring-yellow-300 focus:ring-2 "
                id="content"
                name="content"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label className="block text-gray-700 text-lg font-semibold mb-2">
              가격
              <input
                type="number"
                className="mt-1 block w-full border border-gray-300 rounded p-2 focus:border-none  focus:ring-yellow-300 focus:ring-2 "
                id="price"
                name="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-[#FEE715] text-black p-2 py-4 text-xl font-semibold rounded-xl hover:bg-black hover:text-[#FEE715] focus:outline-none focus:ring-2 focus:ring-[#FEE715]"
          >
            상품 추가
          </button>
        </form>
      </div>
    </main>
  );
};

export default AddProduct;
