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

// 카카오 공유하기 (게임 점수 자랑)
export function kakaoShareScore(score) {
  if (!window.Kakao || !window.Kakao.Share) {
    alert('카카오 공유 기능을 사용할 수 없습니다.');
    return;
  }

  // 배포 주소 우선, 없으면 현재 주소
  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;

  window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: 'TETRis 점수 자랑',
      description: `내 최고 점수는 ${score}점! 당신도 도전해보세요 🎮`,
      imageUrl: 'https://t1.kakaocdn.net/kakaocorp/corp/service/Kakao_Logo.png',
      link: {
        mobileWebUrl: siteUrl,
        webUrl: siteUrl,
      },
    },
    buttons: [
      {
        title: '게임하러 가기',
        link: {
          mobileWebUrl: siteUrl,
          webUrl: siteUrl,
        },
      },
    ],
  });
}