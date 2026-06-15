import React from 'react';
import LoginCard from '../LoginCard';
import SignupCard from '../SignupCard';
import { kakaoLogin } from '../../../utils/kakao';
import './AuthModal.css';

function AuthModal({ mode, setMode, onClose, onGuest, onKakao, setCurrentUser, showAlert }) {
  const handleKakao = async () => {
    try {
      const user = await kakaoLogin();
      onKakao(user);
    } catch (err) {
      console.error('카카오 로그인 에러:', err);
      showAlert('카카오 로그인 실패\n\n다시 시도해주세요.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {onClose && (
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
        )}
        {mode === 'login' ? (
          <LoginCard
            onSwitch={() => setMode('signup')}
            onSuccess={(user) => { setCurrentUser(user); onClose?.(); }}
            showAlert={showAlert}
          />
        ) : (
          <SignupCard onSwitch={() => setMode('login')} showAlert={showAlert} />
        )}

        <button className="kakao-btn" onClick={handleKakao}>
          <span className="kakao-icon">💬</span>
          카카오로 시작하기
        </button>

        <button className="guest-btn" onClick={onGuest}>
          게스트로 계속하기
        </button>
      </div>
    </div>
  );
}

export default AuthModal;