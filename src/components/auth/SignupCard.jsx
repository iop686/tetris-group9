import React, { useState } from 'react';
import { storage } from '../../utils/storage';

// 비밀번호: 영문 + 숫자 필수, 8자 이상
function isValidPassword(pw) {
  const hasLetter = /[a-zA-Z]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);
  return pw.length >= 8 && hasLetter && hasNumber;
}

function SignupCard({ onSwitch, showAlert }) {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!id) {
      showAlert('회원가입 실패\n\n아이디를 입력해주세요.');
      return;
    }
    if (!pw) {
      showAlert('회원가입 실패\n\n비밀번호를 입력해주세요.');
      return;
    }
    if (!isValidPassword(pw)) {
      showAlert('회원가입 실패\n\n비밀번호는 영문과 숫자를 포함해 8자 이상이어야 합니다.');
      return;
    }
    if (!pw2) {
      showAlert('회원가입 실패\n\n비밀번호를 재입력해주세요.');
      return;
    }
    if (pw !== pw2) {
      showAlert('회원가입 실패\n\n비밀번호가 일치하지 않습니다.');
      return;
    }
    if (storage.getUser(id)) {
      showAlert('회원가입 실패\n\n이미 존재하는 아이디입니다.');
      return;
    }
    storage.setUser(id, pw);
    showAlert('회원가입 완료\n\n성공적으로 가입되었습니다.');
    onSwitch();
  };

  return (
    <div className="auth-card">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>아이디 <span className="required-mark">*</span></label>
          <input type="text" placeholder="아이디를 입력하세요" value={id} onChange={(e) => setId(e.target.value)} />
        </div>
        <div className="input-group">
          <label>비밀번호 <span className="required-mark">*</span></label>
          <input type="password" placeholder="영문+숫자 포함 8자 이상" value={pw} onChange={(e) => setPw(e.target.value)} />
        </div>
        <div className="input-group">
          <label>비밀번호 확인 <span className="required-mark">*</span></label>
          <input type="password" placeholder="비밀번호 재입력" value={pw2} onChange={(e) => setPw2(e.target.value)} />
        </div>
        <button type="submit" className="submit-btn">회원가입</button>
      </form>
      <p className="switch-mode-text"><span onClick={onSwitch}>로그인으로 이동</span></p>
    </div>
  );
}

export default SignupCard;