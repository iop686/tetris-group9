import './Header.css';

function diceBearUrl(seed) {
  return `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(seed)}`;
}

function Avatar({ user, isGuest, guestId, kakaoProfile, onClick }) {
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
      <h1 className="logo-title" onClick={onLogoClick}>TETRis</h1>
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