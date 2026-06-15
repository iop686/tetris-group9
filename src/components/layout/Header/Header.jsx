import React from 'react';
import './Header.css';

// DiceBear 아바타 URL 생성 (seed 기반, 무료 API)
function diceBearUrl(seed) {
  return `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(seed)}`;
}

function Avatar({ user, isGuest, guestId, kakaoProfile, onClick }) {
  // 카카오 로그인이면 카카오 프로필 이미지 + 닉네임
  if (kakaoProfile) {
    return (
      <div className="avatar-wrap avatar-wrap--clickable" onClick={onClick}>
        {kakaoProfile.profileImage ? (
          <img className="avatar avatar--img" src={kakaoProfile.profileImage} alt="profile" />
        ) : (
          <div className="avatar">{kakaoProfile.nickname[0]}</div>
        )}
        <span className="avatar-label">{kakaoProfile.nickname}</span>
      </div>
    );
  }

  // 게스트/일반 회원 → DiceBear 아바타 (ID 기반 자동 생성)
  const seed = isGuest ? (guestId || 'guest') : user;
  const label = isGuest ? (guestId || 'GUEST') : user;
  return (
    <div className="avatar-wrap avatar-wrap--clickable" onClick={onClick}>
      <img className="avatar avatar--img" src={diceBearUrl(seed)} alt="avatar" />
      <span className="avatar-label">{label}</span>
    </div>
  );
}

function Header({ currentUser, kakaoProfile, isGuest, guestId, onLogout, onLoginClick, onLogoClick, onAboutClick, onProfileClick }) {
  return (
    <header>
      <h1 onClick={onLogoClick} style={{ cursor: 'pointer' }}>TETRis</h1>
      <a href="#" onClick={(e) => { e.preventDefault(); onAboutClick(); }}>ABOUT</a>
      <div className="header-right">
        {currentUser || isGuest ? (
          <>
            <Avatar
              user={currentUser}
              isGuest={isGuest}
              guestId={guestId}
              kakaoProfile={kakaoProfile}
              onClick={onProfileClick}
            />
            <button onClick={onLogout}>로그아웃</button>
          </>
        ) : (
          <button onClick={onLoginClick}>로그인</button>
        )}
      </div>
    </header>
  );
}

export default Header;