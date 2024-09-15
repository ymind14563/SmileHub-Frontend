import React, { useState, useEffect } from 'react';
import UserSearchForm from '../components/UserSearchForm';
import UserList from '../components/UserList';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUsers, updateUserStatus, removeUser } from '../store/userTabSlice';
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const UserTabPage = () => {
  const users = useSelector((state) => state.userTab.users);
  const dispatch = useDispatch();
  const [searchResults, setSearchResults] = useState(users);
  const [currentFilteredResults, setCurrentFilteredResults] = useState(users); // 라디오 필터링된 결과

  useEffect(() => {
    console.log(
      "🚀 ~ useEffect ~ localStorage.getItem('token'):",
      localStorage.getItem('token'),
    );
    axios
      .get(`${REACT_APP_API_URL}/api/user/list`, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
      .then((response) => {
        const users = response.data.users.map((user) => ({
          userId: user.userId,
          nickname: user.nickname,
          email: user.email,
          createdAt: user.createdAt,
          depth1:
            user.Locations && user.Locations[0] ? user.Locations[0].depth1 : '',
          depth2:
            user.Locations && user.Locations[0] ? user.Locations[0].depth2 : '',
          depth3:
            user.Locations && user.Locations[0] ? user.Locations[0].depth3 : '',
          depth4:
            user.Locations && user.Locations[0] ? user.Locations[0].depth4 : '',
          status: user.Active?.isActive ?? 1,
          userReportCount: user.userReportCount,
        }));
        dispatch(setUsers(users));
      })
      .catch((error) => {
        console.error('유저 목록 불러오는 중 오류 발생', error);
      });
  }, [dispatch]);
  console.log('🚀 ~ users ~ users:', users);

  useEffect(() => {
    setSearchResults(users);
    setCurrentFilteredResults(users); // Redux 상태가 업데이트될 때 searchResults와 currentFilteredResults도 업데이트
  }, [users]);

  // 검색 기능
  const handleSearch = ({ searchType, value, status }) => {
    const filtered = users.filter((user) => {
      const matchSearch =
        searchType === 'nickname'
          ? user.nickname.includes(value)
          : user.email.includes(value);
      const matchStatus = status === '전체' || user.status === status;
      return matchSearch && matchStatus;
    });
    setSearchResults(filtered);
    setCurrentFilteredResults(filtered);
  };

  // 라디오 버튼 클릭 시 필터링
  const handleStatusChange = (newStatus) => {
    const filtered = searchResults.filter((user) => {
      return newStatus === '전체' || user.status === newStatus;
    });
    setCurrentFilteredResults(filtered); // 검색된 결과에서 필터링
  };

  // 초기화
  const handleReset = () => {
    setSearchResults(users);
    setCurrentFilteredResults(users);
  };
  return (
    <div>
      <UserSearchForm
        onSearch={handleSearch}
        onReset={handleReset}
        onStatusChange={handleStatusChange}
      />
      <UserList searchResults={currentFilteredResults} />
    </div>
  );
};

export default UserTabPage;
