import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateUserStatus, removeUser } from '../store/userTabSlice';
import { Modal } from '../../../../shared/Modal';
import axios from 'axios';
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const UserList = ({ searchResults }) => {
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null); // 상태 변경인지 강퇴인지 구분
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    console.log('유저 상태가 업데이트 되었습니다.', searchResults); // 상태 변경 확인
  }, [searchResults]);

  const handleStatusChange = (userId, currentStatus) => {
    const newStatus = currentStatus === true ? false : true;
    setSelectedUser(userId);
    setSelectedAction({
      type: 'status',
      newStatus: newStatus,
    });
    setIsModalOpen(true);
  };

  const handleRemove = async (userId) => {
    const token = localStorage.getItem('token');
    const actualToken = token.split(' ')[1];
    const decoded = JSON.parse(atob(actualToken.split('.')[1]));
    const loggedInUserId = decoded.userId;

    if (loggedInUserId === userId) {
      setSelectedAction({ type: 'error' });
      setIsModalOpen(true);
      return;
    }

    setSelectedUser(userId);
    setSelectedAction({ type: 'remove' });
    setIsModalOpen(true);
  };

  // 모달에서 확인 버튼을 눌렀을 때 실행
  const handleConfirm = async () => {
    if (selectedAction?.type === 'status') {
      try {
        const token = localStorage.getItem('token');
        await axios.patch(
          `${REACT_APP_API_URL}/user/status/${selectedUser}`,
          {
            isActive: selectedAction.newStatus,
          },
          {
            headers: {
              Authorization: token,
            },
          },
        );

        dispatch(
          updateUserStatus({
            userId: selectedUser,
            status: selectedAction.newStatus,
          }),
        );
      } catch (err) {
        console.error('유저 상태 변경 중 오류 발생.', err);
      }
    } else if (selectedAction?.type === 'remove') {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${REACT_APP_API_URL}/user/${selectedUser}`, {
          headers: {
            Authorization: token,
          },
        });

        dispatch(removeUser(selectedUser)); // Redux 상태에서 유저 제거
      } catch (err) {
        console.error('유저 삭제 중 오류 발생.', err);
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 text-center align-middle">유저번호</th>
            <th className="px-4 py-2 text-center align-middle">닉네임</th>
            <th className="px-4 py-2 text-center align-middle">이메일</th>
            <th className="px-4 py-2 text-center align-middle">주소</th>
            <th className="px-4 py-2 text-center align-middle">가입일</th>
            <th className="px-4 py-2 text-center align-middle">신고수</th>
            <th className="px-4 py-2 text-center align-middle">현재상태</th>
            <th className="px-4 py-2 text-center align-middle">강퇴</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center py-4 text-lg">
                등록된 회원이 없습니다.
              </td>
            </tr>
          ) : (
            searchResults.map((user) => {
              const formattedDate = new Date(user.createdAt)
                .toISOString()
                .slice(0, 10);

              return (
                <tr key={user.userId} className="border-b">
                  <td className="px-4 py-2 text-center align-middle">
                    {user.userId}
                  </td>
                  <td className="px-4 py-2 text-center align-middle">
                    {user.nickname}
                  </td>
                  <td className="px-4 py-2 text-center align-middle">
                    {user.email}
                  </td>
                  <td className="px-4 py-2 text-center align-middle">
                    {user.depth1 && user.depth2 && (
                      <div>{`${user.depth1} ${user.depth2}`}</div>
                    )}
                    {user.depth3 && (
                      <div>{`${user.depth3} ${user.depth4 ? user.depth4 : ''}`}</div>
                    )}
                  </td>

                  <td className="px-4 py-2 text-center align-middle">
                    {formattedDate}
                  </td>
                  <td className="px-4 py-2 text-center align-middle">
                    {user.userReportCount}
                  </td>
                  <td className="px-4 py-2 text-center align-middle">
                    <button
                      onClick={() =>
                        handleStatusChange(user.userId, user.status)
                      }
                      className={`py-1 px-3 rounded-md text-white cursor-pointer ${user.status === true ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{
                        display: 'inline-block',
                        minWidth: '90px',
                        textAlign: 'center',
                      }}
                    >
                      {user.status === true ? '활동중' : '활동정지'}
                    </button>
                  </td>
                  <td className="px-4 py-2 text-center align-middle">
                    <button
                      onClick={() => handleRemove(user.userId)}
                      className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
                    >
                      강퇴
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
        message={
          selectedAction?.type === 'status' ? (
            '정말 상태를 변경하시겠습니까?'
          ) : selectedAction?.type === 'remove' ? (
            '정말 강퇴하시겠습니까?'
          ) : selectedAction?.type === 'error' ? (
            <span>
              강퇴하려는 유저가 접속한 유저이므로
              <br />
              강퇴하실 수 없습니다.
            </span>
          ) : (
            ''
          )
        }
        showCancelButton={selectedAction?.type !== 'error'} // 강퇴 모달일 때 확인 버튼만 표시
      />
    </div>
  );
};

export default UserList;
