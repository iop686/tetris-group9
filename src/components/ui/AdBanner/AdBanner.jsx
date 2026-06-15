// AdBanner.jsx
import React, { useEffect, useRef } from 'react';
import './AdBanner.css';

// AdFit 광고단위 (환경변수에서 로드)
const AD_UNIT = import.meta.env.VITE_ADFIT_UNIT_VERTICAL;

function AdBanner({ width = 160, height = 600 }) {
  const adRef = useRef(null);

  useEffect(() => {
    // 광고단위 ID가 없으면(개발 중) 스크립트 삽입 안 함
    if (!AD_UNIT || !adRef.current) return;

    // 이미 스크립트가 들어가 있으면 중복 삽입 방지
    if (adRef.current.querySelector('script')) return;

    const ins = document.createElement('ins');
    ins.className = 'kakao_ad_area';
    ins.style.display = 'none';
    ins.setAttribute('data-ad-unit', AD_UNIT);
    ins.setAttribute('data-ad-width', String(width));
    ins.setAttribute('data-ad-height', String(height));

    const script = document.createElement('script');
    script.async = true;
    script.src = '//t1.daumcdn.net/kas/static/ba.min.js';

    adRef.current.appendChild(ins);
    adRef.current.appendChild(script);
  }, [width, height]);

  // 광고단위가 설정 안 된 경우 placeholder 표시
  if (!AD_UNIT) {
    return (
      <div className="ad-banner ad-placeholder" style={{ width, minHeight: height }}>
        <div className="ad-badge">AD</div>
        <p className="ad-text">광고 영역</p>
      </div>
    );
  }

  return <div className="ad-banner" ref={adRef} style={{ width, minHeight: height }} />;
}

export default AdBanner;