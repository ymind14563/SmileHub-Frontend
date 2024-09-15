import React, { useState } from 'react';
import { Avatar } from 'flowbite-react';
import UserSellList from '../../features/User/mypage/components/UserSellList';
import UserBuyList from '../../features/User/mypage/components/UserBuyList';
import LikeList from '../../features/User/mypage/components/LikeList';
import MoneyMoal from '../../features/User/mypage/components/MoneyMoal';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setUserField } from '../../features/User/store/userSlice';
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const MyPage = ({
  currentUser,
  handleEdit,
  handleDelete,
  isModalOpen,
  openModal,
  closeModal,
}) => {
  // 기본 프로필 이미지
  const defaultUrl =
    'https://sesac-2nd-pro-bucket.s3.ap-northeast-2.amazonaws.com/null';

  const [activeTab, setActiveTab] = useState('찜 목록'); // 기본 활성 탭 설정
  const [profileEdit, setProfileEdit] = useState(false); // 수정 상태관리
  const [image, setImage] = useState(null); // 사용자가 업로드할 이미지 상태관리

  const dispatch = useDispatch();

  // 파일 업로드 input에 넣은 이미지
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // 업로드 버튼 클릭
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    const formData = new FormData();
    formData.append('profileImg', image);

    const token = localStorage.getItem('token');

    try {
      const res = await axios.post(
        `${REACT_APP_API_URL}/uploadImg/user/${currentUser.userId}`,
        formData,
        {
          headers: {
            Authorization: token,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      dispatch(
        setUserField({ field: 'profileImage', value: res.data.profileImgUrl }),
      );
      console.log('res.data.imageUrl', res.data.profileImgUrl);

      setProfileEdit(false);
    } catch (error) {
      console.error('이미지 업로드 중 에러', error);
    }
  };

  // 프로필 수정버튼 클릭
  const handleProfileClick = () => {
    setProfileEdit(true);
  };

  // 프로필 수정 중 취소버튼 클릭
  const handleCancel = () => {
    setProfileEdit(false);
    setImage(null);
  };

  // 프로필 초기화 버튼(기본 이미지로)
  const handleProfileReset = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.delete(
        `${REACT_APP_API_URL}/uploadImg/user/${currentUser.userId}`,
        {
          headers: {
            Authorization: token,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      if (res.status === 200) {
        dispatch(setUserField({ field: 'profileImage', value: defaultUrl }));
        console.log('프로필 이미지가 기본 이미지로 초기화되었습니다.');
      }
    } catch (error) {
      console.error('프로필 초기화 오류', error);
    }
  };

  return (
    <main className="bg-gray-50">
      <section className="flex justify-center py-10 w-full">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full max-w-3xl border p-6 bg-white mx-auto rounded-lg">
          <div className="flex flex-col items-center">
            {profileEdit ? (
              // 수정 상태일 때: 이미지 업로드 폼 및 버튼
              <form onSubmit={handleSubmit} className="w-full">
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="mb-4 w-full"
                />
                <div className="flex flex-col space-y-2 mt-3 sm:space-y-0 sm:flex-row sm:space-x-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2 sm:px-4 sm:py-2 font-semibold bg-[#FEE715] text-[#101820] hover:bg-[#101820] hover:text-[#FEE715] rounded-md transition-colors duration-300"
                  >
                    업로드
                  </button>
                  <button
                    onClick={handleCancel}
                    className="w-full sm:w-auto px-4 py-2 sm:px-4 sm:py-2 font-semibold bg-gray-200 text-[#101820] hover:bg-red-500 hover:text-white rounded-md transition-colors duration-300"
                  >
                    취소
                  </button>
                </div>
              </form>
            ) : (
              // 수정 상태가 아닐 때: 프로필 이미지 및 수정하기 버튼
              <>
                <Avatar
                  img={
                    currentUser.profileImage === defaultUrl
                      ? '/images/profile.png'
                      : currentUser.profileImage
                  }
                  size="xl"
                />
                <div className="flex mt-2 space-y-2 sm:space-y-0 sm:space-x-2">
                  <button
                    onClick={handleProfileClick}
                    className="w-full px-2 sm:px-4 py-2 sm:py-2 mr-2 font-semibold bg-[#FEE715] text-[#101820] hover:bg-[#101820] hover:text-[#FEE715] rounded-md transition-colors duration-300"
                  >
                    업로드
                  </button>
                  <button
                    onClick={handleProfileReset}
                    className="w-full px-2 py-2 sm:px-4 sm:py-2 font-semibold bg-gray-200 text-[#101820] hover:bg-red-500 hover:text-white rounded-md transition-colors duration-300"
                  >
                    초기화
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="flex flex-1 flex-col justify-between pl-0 sm:pl-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
              <div className="mb-2 sm:mb-0">
                <div className="text-2xl font-bold pb-1">
                  {currentUser.nickname}
                </div>
                <div className="text-lg text-gray-700">{currentUser.temp}</div>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  onClick={handleEdit}
                  className="w-full sm:w-auto px-4 py-2 sm:px-4 sm:py-2 font-semibold bg-[#FEE715] text-[#101820] hover:bg-[#101820] hover:text-[#FEE715] rounded-md transition-colors duration-300"
                >
                  내 정보 수정
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full sm:w-auto px-4 py-2 sm:px-4 sm:py-2 font-semibold bg-gray-200 text-[#101820] hover:bg-red-500 hover:text-white rounded-md transition-colors duration-300"
                >
                  회원 탈퇴
                </button>
              </div>
            </div>
            <div className="border-2 bg-gray-50 rounded-lg p-4 mt-4 w-full">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <div className="flex mb-2 sm:mb-0">
                  <div className="mr-2">현재 머니:</div>
                  <div className="font-semibold text-green-500">
                    {currentUser.money}
                  </div>
                </div>
                <button
                  className="w-full sm:w-auto px-4 py-2 sm:px-4 sm:py-2 bg-gray-200 text-[#101820] hover:bg-green-500 hover:text-white rounded-md transition-colors duration-300"
                  onClick={openModal}
                >
                  충전하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <nav>
        <div className="flex justify-center w-full">
          <div className="flex items-center w-full max-w-3xl mx-auto border-b border-gray-500">
            <div
              onClick={() => setActiveTab('찜 목록')}
              className={`cursor-pointer flex items-center justify-center w-full py-4 px-6 text-center transition-colors duration-200 ${
                activeTab === '찜 목록'
                  ? 'bg-[#101820] text-[#FEE715] border-b-4 border-[#FEE715]'
                  : 'bg-transparent text-[#101820]'
              }`}
            >
              <span className="font-semibold">찜 목록</span>
            </div>
            <div
              onClick={() => setActiveTab('판매 내역')}
              className={`cursor-pointer flex items-center justify-center w-full py-4 px-6 text-center transition-colors duration-200 ${
                activeTab === '판매 내역'
                  ? 'bg-[#101820] text-[#FEE715] border-b-4 border-[#FEE715]'
                  : 'bg-transparent text-[#101820]'
              }`}
            >
              <span className="font-semibold">판매 내역</span>
            </div>
            <div
              onClick={() => setActiveTab('구매 내역')}
              className={`cursor-pointer flex items-center justify-center w-full py-4 px-6 text-center transition-colors duration-200 ${
                activeTab === '구매 내역'
                  ? 'bg-[#101820] text-[#FEE715] border-b-4 border-[#FEE715]'
                  : 'bg-transparent text-[#101820]'
              }`}
            >
              <span className="font-semibold">구매 내역</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center w-full max-w-3xl mx-auto">
          <div className="py-8 mt-10">
            {activeTab === '찜 목록' && <LikeList />}
            {activeTab === '판매 내역' && <UserSellList />}
            {activeTab === '구매 내역' && <UserBuyList />}
          </div>
        </div>
      </nav>

      {/* MoneyMoal 컴포넌트 추가 */}
      <MoneyMoal isModalOpen={isModalOpen} closeModal={closeModal} />
    </main>
  );
};

export default MyPage;
