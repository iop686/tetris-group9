import React, { useState } from 'react';
import { storage } from '../../utils/storage';

function LoginCard({ onSwitch, onSuccess, showAlert }) {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!id || !pw) {
      showAlert('로그인 실패\n\n아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }
    const savedPw = storage.getUser(id);
    if (savedPw === pw) {
      showAlert(`로그인 성공\n\n${id}님 환영합니다!`);
      onSuccess(id);
    } else {
      showAlert('로그인 실패\n\n정보가 일치하지 않습니다.');
    }
  };

  return (
    <div className="auth-card">
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>아이디</label>
          <input type="text" placeholder="아이디를 입력하세요" value={id} onChange={(e) => setId(e.target.value)} />
        </div>
        <div className="input-group">
          <label>비밀번호</label>
          <input type="password" placeholder="비밀번호를 입력하세요" value={pw} onChange={(e) => setPw(e.target.value)} />
        </div>
        <button type="submit" className="submit-btn">로그인</button>
      </form>
      <p className="switch-mode-text">계정이 없으신가요? <span onClick={onSwitch}>회원가입</span></p>
    </div>
  );
}

export default LoginCard;