// src/utils/kakao.js
// 카카오 로그인 (JavaScript SDK, 백엔드 없이 프론트만)

// 카카오 로그인 → 사용자 정보 반환
export function kakaoLogin() {
  return new Promise((resolve, reject) => {
    if (!window.Kakao) {
      reject(new Error('카카오 SDK가 로드되지 않았습니다.'));
      return;
    }

    window.Kakao.Auth.login({
      scope: 'profile_nickname, profile_image',
      success: () => {
        // 로그인 성공 → 사용자 정보 요청
        window.Kakao.API.request({
          url: '/v2/user/me',
          success: (res) => {
            const account = res.kakao_account || {};
            const profile = account.profile || {};
            resolve({
              id: `kakao_${res.id}`,           // 고유 ID
              nickname: profile.nickname || '카카오회원',
              profileImage: profile.profile_image_url || null,
            });
          },
          fail: (err) => reject(err),
        });
      },
      fail: (err) => reject(err),
    });
  });
}

// 카카오 로그아웃
export function kakaoLogout() {
  return new Promise((resolve) => {
    if (window.Kakao && window.Kakao.Auth.getAccessToken()) {
      window.Kakao.Auth.logout(() => resolve());
    } else {
      resolve();
    }
  });
}