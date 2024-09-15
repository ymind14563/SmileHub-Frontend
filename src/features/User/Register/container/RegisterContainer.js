import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, setUserFields } from '../../store/userSlice';
import RegisterPage from '../../../../pages/User/RegisterPage';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const RegisterContainer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // 주소 modal 상태관리
  const [checkEmail, setCheckEmail] = useState(''); // 이메일 중복 확인 상태
  const [checkNickname, setCheckNickname] = useState(''); // 닉네임 중복 확인 상태
  const [isEmailChecked, setIsEmailChecked] = useState(false); // 이메일 중복 검사 여부
  const [isNicknameChecked, setIsNicknameChecked] = useState(false); // 닉네임 중복 검사 여부
  const currentUser = useSelector((state) => state.user.currentUser);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // useForm 설정
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset, // 폼 리셋을 위한 기능 추가
    setValue,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      gender: 'default',
      nickname: currentUser.nickname,
    },
  });
  const password = watch('password');

  // 회원가입 폼 제출
  const onSubmit = async (data, e) => {
    e.preventDefault();
    console.log('data >>', data);

    if (!isEmailChecked) {
      alert('이메일 중복 검사를 먼저 해주세요.');
      return;
    }
    if (!isNicknameChecked) {
      alert('닉네임 중복 검사를 먼저 해주세요.');
      return;
    }

    // 성별 변환
    let genderValue;
    if (data.gender === 'male') {
      genderValue = 1; // 남성
    } else if (data.gender === 'female') {
      genderValue = 0; // 여성
    } else {
      genderValue = null; // default인 경우 null로 설정
    }

    try {
      const res = await axios.post(`${REACT_APP_API_URL}/api/user`, {
        nickname: data.nickname,
        email: data.email,
        password: data.password,
        gender: genderValue,
        age: data.age,
        profileImage: null, // 기본값
        depth1: data.address.sido,
        depth2: data.address.sigungu,
        depth3: data.address.bname,
        depth4: data.address.detailAddress,
        isActive: 1, // 기본값
        isAdmin: 0, // 기본값
      });
      console.log('res >>', res);

      if (res.status === 201) {
        dispatch(
          setUserFields({
            userId: res.data.newUser.userId,
            nickname: data.nickname,
            email: data.email,
            password: data.password,
            gender: genderValue,
            age: data.age,
            profile_image: null, // 기본값
            sido: data.address.sido,
            sigungu: data.address.sigungu,
            bname: data.address.bname,
            detailAddress: data.address.detailAddress,
            postcode: data.address.postcode,
            address: data.address.address,
            extraAddress: data.address.extraAddress,
            isActive: 1, // 기본값
            isAdmin: 0, // 기본값
          }),
        );
        dispatch(registerUser());
        alert('회원가입이 완료되었습니다.');
        reset();
        setIsEmailChecked(false); // 이메일 체크 상태 리셋
        setIsNicknameChecked(false); // 닉네임 체크 상태 리셋
        setCheckEmail(''); // 이메일 입력 초기화
        setCheckNickname(''); // 닉네임 입력 초기화
        navigate('/login');
      }
    } catch (error) {
      console.error('회원가입 실패', error);
      alert('회원가입을 실패했습니다. 다시 시도해 주세요.');
    }
  };

  // 이메일 중복 확인
  const handleCheckEmail = async () => {
    console.log('checkEmail >>', checkEmail);
    setIsEmailChecked(true);

    const emailRegex = /^\S+@\S+$/i;
    if (!emailRegex.test(checkEmail)) {
      alert('유효한 이메일 형식이 아닙니다.');
      return;
    }

    try {
      const res = await axios.post(`${REACT_APP_API_URL}/api/user/checkEmail`, {
        email: checkEmail,
      });
      console.log('res >>', res);

      if (res.status === 200) {
        alert('사용 가능한 이메일입니다.');
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // 409 상태 코드가 발생했을 때 처리
        alert('이미 사용 중인 이메일입니다.');
      } else {
        // 그 외의 오류 처리
        console.error('이메일 중복체크 오류', error);
      }
    }
  };

  // 닉네임 중복 확인
  const handleCheckNickname = async () => {
    setIsNicknameChecked(true);
    try {
      const res = await axios.post(
        `${REACT_APP_API_URL}/api/user/checkNickname`,
        {
          nickname: checkNickname,
        },
      );
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

  return (
    <RegisterPage
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      register={register}
      handleSubmit={handleSubmit}
      errors={errors}
      setValue={setValue}
      password={password}
      onSubmit={onSubmit}
      currentUser={currentUser}
      navigate={navigate}
      checkEmail={checkEmail}
      setCheckEmail={setCheckEmail}
      checkNickname={checkNickname}
      setCheckNickname={setCheckNickname}
      handleCheckEmail={handleCheckEmail}
      handleCheckNickname={handleCheckNickname}
    />
  );
};

export default RegisterContainer;
