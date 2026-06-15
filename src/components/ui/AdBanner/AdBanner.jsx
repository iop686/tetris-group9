// AdBanner.jsx
import React, { useEffect, useRef } from 'react';
import './AdBanner.css';

// AdFit 광고단위 (환경변수에서 로드)
const AD_UNITS = {
  vertical: import.meta.env.VITE_ADFIT_UNIT_VERTICAL,   // 160x600
  horizontal: import.meta.env.VITE_ADFIT_UNIT_HORIZONTAL, // 728x90
};

const AD_SIZES = {
  vertical: { width: 160, height: 600 },
  horizontal: { width: 728, height: 90 },
};

function AdBanner({ type = 'vertical' }) {
  const adRef = useRef(null);
  const adUnit = AD_UNITS[type];
  const { width, height } = AD_SIZES[type];

  useEffect(() => {
    if (!adUnit || !adRef.current) return;
    if (adRef.current.querySelector('script')) return;

    const ins = document.createElement('ins');
    ins.className = 'kakao_ad_area';
    ins.style.display = 'none';
    ins.setAttribute('data-ad-unit', adUnit);
    ins.setAttribute('data-ad-width', String(width));
    ins.setAttribute('data-ad-height', String(height));

    const script = document.createElement('script');
    script.async = true;
    script.src = '//t1.daumcdn.net/kas/static/ba.min.js';

    adRef.current.appendChild(ins);
    adRef.current.appendChild(script);
  }, [adUnit, width, height]);

  // 광고단위 미설정 시 placeholder
  if (!adUnit) {
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