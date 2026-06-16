import React, { useState } from 'react';
import { storage } from '../../utils/storage';
import './ProfilePage.css';

// 비밀번호: 영문 + 숫자 필수, 8자 이상
function isValidPassword(pw) {
  const hasLetter = /[a-zA-Z]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);
  return pw.length >= 8 && hasLetter && hasNumber;
}

// DiceBear 아바타 URL
function diceBearUrl(seed) {
  return `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(seed)}`;
}

function ProfilePage({ currentUser, kakaoProfile, isGuest, guestId, onBack, showAlert, onSignup }) {
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [newPw2, setNewPw2] = useState('');

  // 카카오 회원 / 게스트는 비번 변경 불가
  const isLocalUser = currentUser && !kakaoProfile && !isGuest;

  const handleChangePw = (e) => {
    e.preventDefault();

    const savedPw = storage.getUser(currentUser);
    if (savedPw === null) {
      showAlert('오류\n\n사용자 정보를 찾을 수 없습니다.');
      return;
    }

    if (savedPw !== currentPw) {
      showAlert('변경 실패\n\n현재 비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!isValidPassword(newPw)) {
      showAlert('변경 실패\n\n새 비밀번호는 영문과 숫자를 포함해 8자 이상이어야 합니다.');
      return;
    }
    if (newPw !== newPw2) {
      showAlert('변경 실패\n\n새 비밀번호가 일치하지 않습니다.');
      return;
    }
    if (newPw === currentPw) {
      showAlert('변경 실패\n\n현재 비밀번호와 다른 비밀번호를 입력해주세요.');
      return;
    }

    storage.setUser(currentUser, newPw);
    showAlert('변경 완료\n\n비밀번호가 변경되었습니다.');
    setCurrentPw(''); setNewPw(''); setNewPw2('');
  };

  return (
    <main className="profile-main">
      <div className="profile-content">
        <button className="back-btn" onClick={onBack}>← 뒤로</button>
        <h2 className="profile-title">프로필</h2>

        <div className="profile-avatar-area">
          {kakaoProfile && kakaoProfile.profileImage ? (
            <img className="profile-avatar" src={kakaoProfile.profileImage} alt="profile" />
          ) : (
            <img
              className="profile-avatar"
              src={diceBearUrl(isGuest ? (guestId || 'guest') : currentUser)}
              alt="avatar"
            />
          )}
          <p className="profile-avatar-name">
            {kakaoProfile ? kakaoProfile.nickname : (isGuest ? (guestId || 'GUEST') : currentUser)}
          </p>
        </div>

        <section className="profile-section">
          <h3>계정 정보</h3>
          <div className="profile-info-row">
            <span className="profile-label">아이디</span>
            <span className="profile-value">{currentUser}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-label">로그인 방식</span>
            <span className="profile-value">
              {kakaoProfile ? '카카오' : isGuest ? '게스트' : '일반'}
            </span>
          </div>
        </section>

        {isLocalUser ? (
          <section className="profile-section">
            <h3>비밀번호 변경</h3>
            <form onSubmit={handleChangePw} className="profile-form">
              <div className="input-group">
                <label>현재 비밀번호</label>
                <input type="password" placeholder="현재 비밀번호" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} />
              </div>
              <div className="input-group">
                <label>새 비밀번호</label>
                <input type="password" placeholder="영문+숫자 포함 8자 이상" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
              </div>
              <div className="input-group">
                <label>새 비밀번호 확인</label>
                <input type="password" placeholder="새 비밀번호 재입력" value={newPw2} onChange={(e) => setNewPw2(e.target.value)} />
              </div>
              <button type="submit" className="profile-submit-btn">비밀번호 변경</button>
            </form>
          </section>
        ) : isGuest ? (
          <section className="profile-section">
            <p className="profile-notice">
              게스트로 플레이 중입니다.<br />
              회원가입하면 최고 기록이 안전하게 저장되고<br />
              어디서든 이어서 플레이할 수 있습니다.
            </p>
            <button className="profile-submit-btn" onClick={onSignup}>회원가입 하러가기</button>
          </section>
        ) : (
          <section className="profile-section">
            <p className="profile-notice">
              카카오 로그인 계정은 비밀번호를 변경할 수 없습니다.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}

export default ProfilePage;