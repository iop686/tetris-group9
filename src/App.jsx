import { useState, useEffect } from 'react';
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
import ProfilePage from './pages/ProfilePage/ProfilePage';
import TetrisPage from './pages/TetrisPage/TetrisPage';
import { storage } from './utils/storage';
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
  const saved = storage.getSettings();
  return saved ? { ...DEFAULT_SETTINGS, ...saved } : DEFAULT_SETTINGS;
}

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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(!session);
  const [authMode, setAuthMode] = useState('login');
  const [page, setPage] = useState(session?.page ?? 'landing');
  const [settings, setSettings] = useState(loadSettings);

  const authed = page !== 'landing';

  // 세션 저장
  useEffect(() => {
    if (page === 'landing') {
      sessionStorage.removeItem('tetris_session');
    } else {
      sessionStorage.setItem('tetris_session', JSON.stringify({
        currentUser, kakaoProfile, isGuest, guestId, page,
      }));
    }
  }, [currentUser, kakaoProfile, isGuest, guestId, page]);

  const goPage = (next) => {
    setPage(next);
    window.history.pushState({ page: next }, '', `#${next}`);
  };

  // 브라우저 뒤로/앞으로 가기
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
    storage.setSettings(next);
  };

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  // 게스트 → 회원 전환 시 최고기록 이전
  const migrateGuestScore = (newUser) => {
    const gid = guestId || localStorage.getItem('tetris_guest_id');
    if (!gid) return;
    const guestHigh = storage.getHighScore(gid);
    if (guestHigh > 0 && guestHigh > storage.getHighScore(newUser)) {
      storage.setHighScore(newUser, guestHigh);
    }
  };

  const handleLoginSuccess = (user) => {
    migrateGuestScore(user);
    setCurrentUser(user);
    setIsGuest(false);
    setGuestId(null);
    setIsAuthModalOpen(false);
    setPage('menu');
    window.history.replaceState({ page: 'menu' }, '', '#menu');
  };

  const handleKakao = (kakaoUser) => {
    migrateGuestScore(kakaoUser.id);
    setCurrentUser(kakaoUser.id);
    setKakaoProfile(kakaoUser);
    setIsGuest(false);
    setGuestId(null);
    setIsAuthModalOpen(false);
    setPage('menu');
    window.history.replaceState({ page: 'menu' }, '', '#menu');
  };

  const handleGuest = () => {
    const id = storage.getGuestId();
    setGuestId(id);
    setIsGuest(true);
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

  // 페이지 분기
  const pageProps = {
    onBack: () => goPage('menu'),
  };

  const renderPage = () => {
    if (page === 'landing') return null;

    switch (page) {
      case 'play':
        return (
          <TetrisPage
            key={currentUser || guestId}
            currentUser={currentUser || guestId}
            showAlert={showAlert}
            settings={settings}
          />
        );
      case 'rule':
        return <RulePage {...pageProps} />;
      case 'about':
        return <AboutPage {...pageProps} />;
      case 'settings':
        return <SettingsPage settings={settings} onChange={updateSettings} {...pageProps} />;
      case 'profile':
        return (
          <ProfilePage
            currentUser={currentUser}
            kakaoProfile={kakaoProfile}
            isGuest={isGuest}
            guestId={guestId}
            showAlert={showAlert}
            onSignup={() => openAuth('signup')}
            {...pageProps}
          />
        );
      case 'privacy':
        return <PrivacyPage {...pageProps} />;
      case 'terms':
        return <TermsPage {...pageProps} />;
      default:
        return (
          <LobbyPage
            onPlay={() => goPage('play')}
            onRule={() => goPage('rule')}
            onSettings={() => goPage('settings')}
          />
        );
    }
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
        onProfileClick={() => authed && goPage('profile')}
      />

      {alertMessage && <CustomAlert message={alertMessage} onClose={closeAlert} />}

      {renderPage()}

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