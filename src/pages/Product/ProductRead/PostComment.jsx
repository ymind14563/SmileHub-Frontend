import axios from 'axios';
import React from 'react';
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

export default function PostComment() {
  const submitComment = async (data) => {
    try {
      const res = axios.post(`${REACT_APP_API_URL}/api/review`, {
        productId: data.productId,
        sellerId: 2,
        reviewContent: '리뷰 시작',
        reviewScore: 0,
      });
      console.log('응답 >>>>> ', res);
    } catch (error) {
      console.error('Error posting product:', error);
      if (error.response) {
        console.error('서버 응답:', error.response.data);
      }
    }
  };
  // {
  //   "productId": "any",
  //   "sellerId": "any",
  //   "reviewContent": "any",
  //   "reviewScore": "any"
  // }

  return (
    <>
      <span class="font-semibold mr-2 text-lg">댓글</span>
      <form
        id="commentForm"
        name="comment"
        onSubmit={submitComment}
        class="space-y-4 mt-4"
      >
        <textarea
          id="comment"
          name="text"
          placeholder=".(100자 이하)"
          maxlength="100"
          class="w-full h-24 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        ></textarea>
        <div class="flex justify-end">
          <button
            type="submit"
            class="bg-[#FEE715] text-black font-semibold py-1 p-1 md:py-1 md:px-3 rounded hover:bg-black hover:text-[#FEE715]"
          >
            댓글 작성
          </button>
        </div>
      </form>
    </>
  );
}
