// src/utils/storage.js
// localStorage 키를 한 곳에서 관리

const KEYS = {
  highScore: (user) => `tetris_high_${user}`,
  guestId: 'tetris_guest_id',
  settings: 'tetris_settings',
  user: (id) => `user_${id}`,
};

export const storage = {
  // 최고 점수
  getHighScore(user) {
    return parseInt(localStorage.getItem(KEYS.highScore(user)) || '0', 10);
  },
  setHighScore(user, score) {
    localStorage.setItem(KEYS.highScore(user), score.toString());
  },

  // 게스트 ID
  getGuestId() {
    let id = localStorage.getItem(KEYS.guestId);
    if (!id) {
      id = 'GUEST-' + Math.random().toString(36).slice(2, 8).toUpperCase();
      localStorage.setItem(KEYS.guestId, id);
    }
    return id;
  },

  // 게임 설정
  getSettings() {
    try {
      const saved = localStorage.getItem(KEYS.settings);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  },
  setSettings(value) {
    localStorage.setItem(KEYS.settings, JSON.stringify(value));
  },

  // 일반 회원 (아이디/비번)
  getUser(id) {
    return localStorage.getItem(KEYS.user(id));
  },
  setUser(id, password) {
    localStorage.setItem(KEYS.user(id), password);
  },
};