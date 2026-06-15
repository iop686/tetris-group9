import React from 'react';
import './Header.css';

function Avatar({ user, isGuest, guestId, kakaoProfile, onClick }) {
  // 카카오 로그인이면 프로필 이미지 + 닉네임
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

  const initial = isGuest ? 'G' : (user ? user[0].toUpperCase() : 'G');
  const label = isGuest ? (guestId || 'GUEST') : user;
  return (
    <div className="avatar-wrap avatar-wrap--clickable" onClick={onClick}>
      <div className={`avatar ${isGuest ? 'avatar--guest' : ''}`}>{initial}</div>
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