import React, { useState } from 'react';
import UserEdit from '../components/UserEdit';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setUserFields } from '../../store/userSlice';
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const UserEditContainer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // 주소 modal 상태관리
  const [isChangingPassword, setIsChangingPassword] = useState(false); // 비밀번호 변경 여부 확인 상태
  const [isOldPasswordCorrect, setIsOldPasswordCorrect] = useState(false); // 기존 비밀번호 확인 상태
  const [oldPassword, setOldPassword] = useState(''); // 기존 비밀번호 상태
  const [checkNickname, setCheckNickname] = useState(''); // 닉네임 중복 확인 상태
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // useForm 설정
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      // gender: currentUser.gender,
      nickname: currentUser.nickname,
      age: currentUser.age || '',
    },
  });
  const newPassword = watch('newPassword'); // newPassword의 값을 추적

  // 기존 비밀번호 확인 로직
  const handlePasswordCheck = async () => {
    console.log('currentUser.userId >>>', currentUser.userId);
    try {
      const token = localStorage.getItem('token');
      console.log('token>>>>', token);

      const res = await axios.post(
        `${REACT_APP_API_URL}/user/chkPassword/${currentUser.userId}`,
        { password: oldPassword }, // 기존 비밀번호를 본문에 포함
        {
          headers: {
            Authorization: token, // 인증 헤더 추가
          },
        },
      );

      if (res.data.success) {
        setIsOldPasswordCorrect(true); // 비밀번호가 일치하면 상태 업데이트
      } else {
        alert(res.data.message); // 비밀번호 불일치 시 메시지 출력
      }
    } catch (error) {
      console.error('비밀번호 확인 오류:', error);
      alert('비밀번호 확인 중 오류가 발생했습니다.'); // 오류 발생 시 메시지 출력
    }
  };

  // 닉네임 중복 확인
  const handleCheckNickname = async () => {
    if (checkNickname === '') {
      alert('한 글자 이상 작성해주세요.');
      return;
    }
    try {
      const res = await axios.post(`${REACT_APP_API_URL}/user/checkNickname`, {
        nickname: checkNickname,
      });
      console.log('res >>', res);

      if (res.status === 200) {
        alert('사용 가능한 닉네임입니다.');
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // 409 상태 코드가 발생했을 때 처리
        alert('이미 사용 중인 닉네임입니다.');
      } else {
        // 그 외의 오류 처리
        console.error('닉네임 중복체크 오류', error);
      }
    }
  };

  // 회원정보 수정하기
  const onSubmit = async (data) => {
    console.log(data);

    const { password, newPassword, gender, age, nickname, address } = data;

    // 주소가 변경되지 않았을 때는 현재 사용자 주소를 사용
    const currentAddress = currentUser.address;

    const updatedData = {
      ...(nickname !== currentUser.nickname && { nickname }),
      ...(age && { age }),
      ...(gender !== undefined && { gender: gender }), // gender 필드는 true 또는 false로 변환하여 포함
      password, // 기존 비밀번호는 password로 포함
      ...(newPassword && { newPassword }), // 새로운 비밀번호가 있을 경우 포함
      ...(address && {
        depth4: address.detailAddress || currentAddress.detailAddress, //depth4
        depth1: address.sido || currentAddress.sido, // depth1
        depth2: address.sigungu || currentAddress.sigungu, // depth2
        depth3: address.bname || currentAddress.bname, // depth3
      }), // 주소가 있을 경우 포함
    };

    console.log('updateData >>>', updatedData);

    // 로컬 스토리지에서 토큰 가져오기
    const token = localStorage.getItem('token');
    try {
      const res = await axios.patch(
        `${REACT_APP_API_URL}/user/${currentUser.userId}`,
        updatedData,
        {
          headers: {
            Authorization: token,
          },
        },
      );

      if (res.status === 200) {
        alert('정보가 수정되었습니다.');
        dispatch(setUserFields(updatedData));
        navigate('/mypage');
      }
    } catch (error) {
      if (error.status === 409) {
        alert('닉네임이 중복되었습니다. 수정 후 중복 검사를 해주세요.');
      } else {
        console.error('회원정보 수정 실패', error);
        alert('정보 수정에 실패하였습니다.');
      }
    }
  };

  return (
    <UserEdit
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      register={register}
      handleSubmit={handleSubmit}
      errors={errors}
      setValue={setValue}
      newPassword={newPassword}
      onSubmit={onSubmit}
      currentUser={currentUser}
      isChangingPassword={isChangingPassword}
      setIsChangingPassword={setIsChangingPassword}
      navigate={navigate}
      oldPassword={oldPassword}
      isOldPasswordCorrect={isOldPasswordCorrect}
      setOldPassword={setOldPassword}
      setCheckNickname={setCheckNickname}
      handlePasswordCheck={handlePasswordCheck}
      handleCheckNickname={handleCheckNickname}
    />
  );
};

export default UserEditContainer;
