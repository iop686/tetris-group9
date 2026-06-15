import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header/Header';
import Footer from './components/layout/Footer/Footer';
import CustomAlert from './components/ui/CustomAlert/CustomAlert';
import AuthModal from './components/auth/AuthModal/AuthModal';
import LobbyPage from './pages/LobbyPage/LobbyPage';
import RulePage from './pages/RulePage/RulePage';
import AboutPage from './pages/AboutPage/AboutPage';
import PrivacyPage from './pages/PolicyPage/PrivacyPage';
import TermsPage from './pages/PolicyPage/TermsPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import TetrisPage from './pages/TetrisPage/TetrisPage';
import './App.css';

const DEFAULT_SETTINGS = {
  showGhost: true,
  showGrid: true,
  keymap: {
    left: 'ArrowLeft',
    right: 'ArrowRight',
    down: 'ArrowDown',
    rotate: 'ArrowUp',
    drop: 'Space',
  },
};

function loadSettings() {
  try {
    const saved = localStorage.getItem('tetris_settings');
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

// 게스트 고유 ID 발급 (최초 1회, 이후 재사용)
function getGuestId() {
  let id = localStorage.getItem('tetris_guest_id');
  if (!id) {
    id = 'GUEST-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    localStorage.setItem('tetris_guest_id', id);
  }
  return id;
}

// 세션 상태 저장/복원 (새로고침 시 현재 페이지 유지)
function loadSession() {
  try {
    const saved = sessionStorage.getItem('tetris_session');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function App() {
  const session = loadSession();
  const [currentUser, setCurrentUser] = useState(session?.currentUser ?? null);
  const [kakaoProfile, setKakaoProfile] = useState(session?.kakaoProfile ?? null);
  const [isGuest, setIsGuest] = useState(session?.isGuest ?? false);
  const [guestId, setGuestId] = useState(session?.guestId ?? null);
  const [alertMessage, setAlertMessage] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(!session); // 세션 있으면 모달 안 띄움
  const [authMode, setAuthMode] = useState('login');
  const [page, setPage] = useState(session?.page ?? 'landing');
  const [settings, setSettings] = useState(loadSettings);

  const authed = page !== 'landing';

  // 인증/페이지 상태가 바뀔 때마다 세션에 저장
  useEffect(() => {
    if (page === 'landing') {
      sessionStorage.removeItem('tetris_session');
    } else {
      sessionStorage.setItem('tetris_session', JSON.stringify({ currentUser, kakaoProfile, isGuest, guestId, page }));
    }
  }, [currentUser, kakaoProfile, isGuest, guestId, page]);

  const goPage = (next) => {
    setPage(next);
    window.history.pushState({ page: next }, '', `#${next}`);
  };

  // 브라우저 뒤로/앞으로 가기 대응
  useEffect(() => {
    const handlePop = (e) => {
      const target = e.state?.page;
      if (target) setPage(target);
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  const showAlert = (msg) => setAlertMessage(msg);
  const closeAlert = () => setAlertMessage('');

  const updateSettings = (next) => {
    setSettings(next);
    localStorage.setItem('tetris_settings', JSON.stringify(next));
  };

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (user) => {
    // 게스트 기록 이전 (게스트 고유 ID 키 기준)
    const gid = guestId || localStorage.getItem('tetris_guest_id');
    if (gid) {
      const guestHigh = parseInt(localStorage.getItem(`tetris_high_${gid}`) || '0', 10);
      if (guestHigh > 0) {
        const userHigh = parseInt(localStorage.getItem(`tetris_high_${user}`) || '0', 10);
        if (guestHigh > userHigh) {
          localStorage.setItem(`tetris_high_${user}`, guestHigh.toString());
        }
      }
    }
    setCurrentUser(user);
    setIsGuest(false);
    setGuestId(null);
    setIsAuthModalOpen(false);
    setPage('menu');
    // landing 기록 제거: menu를 히스토리 시작점으로
    window.history.replaceState({ page: 'menu' }, '', '#menu');
  };

  const handleGuest = () => {
    const id = getGuestId();
    setGuestId(id);
    setIsGuest(true);
    setIsAuthModalOpen(false);
    setPage('menu');
    window.history.replaceState({ page: 'menu' }, '', '#menu');
  };

  // 카카오 로그인 성공
  const handleKakao = (kakaoUser) => {
    // 게스트 기록 이전
    const gid = guestId || localStorage.getItem('tetris_guest_id');
    if (gid) {
      const guestHigh = parseInt(localStorage.getItem(`tetris_high_${gid}`) || '0', 10);
      if (guestHigh > 0) {
        const userHigh = parseInt(localStorage.getItem(`tetris_high_${kakaoUser.id}`) || '0', 10);
        if (guestHigh > userHigh) {
          localStorage.setItem(`tetris_high_${kakaoUser.id}`, guestHigh.toString());
        }
      }
    }
    setCurrentUser(kakaoUser.id);
    setKakaoProfile(kakaoUser);
    setIsGuest(false);
    setGuestId(null);
    setIsAuthModalOpen(false);
    setPage('menu');
    window.history.replaceState({ page: 'menu' }, '', '#menu');
  };

  const handleLogout = () => {
    showAlert('로그아웃 완료\n\n정상적으로 로그아웃되었습니다.');
    setCurrentUser(null);
    setKakaoProfile(null);
    setIsGuest(false);
    setGuestId(null);
    setPage('landing');
    setIsAuthModalOpen(true);
    window.history.pushState({ page: 'landing' }, '', '#landing');
  };

  return (
    <div className="app-container">
      <Header
        currentUser={currentUser}
        kakaoProfile={kakaoProfile}
        isGuest={isGuest}
        guestId={guestId}
        onLogout={handleLogout}
        onLoginClick={() => openAuth('login')}
        onLogoClick={() => authed && goPage('menu')}
        onAboutClick={() => goPage('about')}
      />

      {alertMessage && <CustomAlert message={alertMessage} onClose={closeAlert} />}

      {page === 'landing' ? null : page === 'play' ? (
        <TetrisPage currentUser={currentUser || guestId} openAuthModal={openAuth} showAlert={showAlert} settings={settings} isGuest={isGuest} />
      ) : page === 'rule' ? (
        <RulePage onBack={() => goPage('menu')} />
      ) : page === 'about' ? (
        <AboutPage onBack={() => goPage('menu')} />
      ) : page === 'settings' ? (
        <SettingsPage settings={settings} onChange={updateSettings} onBack={() => goPage('menu')} />
      ) : page === 'privacy' ? (
        <PrivacyPage onBack={() => goPage('menu')} />
      ) : page === 'terms' ? (
        <TermsPage onBack={() => goPage('menu')} />
      ) : (
        <LobbyPage
          onPlay={() => goPage('play')}
          onRule={() => goPage('rule')}
          onSettings={() => goPage('settings')}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal
          mode={authMode}
          setMode={setAuthMode}
          onClose={authed ? () => setIsAuthModalOpen(false) : null}
          onGuest={handleGuest}
          onKakao={handleKakao}
          setCurrentUser={handleLoginSuccess}
          showAlert={showAlert}
        />
      )}

      <Footer
        onPrivacy={() => goPage('privacy')}
        onTerms={() => goPage('terms')}
      />
    </div>
  );
}

export default App;