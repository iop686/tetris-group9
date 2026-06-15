import React from 'react';
import './PolicyPage.css';

function PrivacyPage() {
  return (
    <main className="policy-main">
      <div className="policy-content">
        <h2 className="policy-title">개인정보처리방침</h2>
        <p className="policy-date">최종 수정일: 2026년 1월 1일</p>

        <section className="policy-section">
          <h3>1. 수집하는 개인정보 항목</h3>
          <p>본 서비스는 회원가입 시 아이디와 비밀번호를 수집합니다. 수집된 정보는 브라우저의 로컬 스토리지에 저장되며, 서버로 전송되지 않습니다.</p>
        </section>

        <section className="policy-section">
          <h3>2. 개인정보의 수집 및 이용 목적</h3>
          <p>수집한 개인정보는 다음의 목적으로만 이용됩니다.</p>
          <ul>
            <li>회원 식별 및 로그인 서비스 제공</li>
            <li>게임 최고 점수 기록 저장</li>
          </ul>
        </section>

        <section className="policy-section">
          <h3>3. 개인정보의 보유 및 이용 기간</h3>
          <p>개인정보는 브라우저 로컬 스토리지에 저장되며, 사용자가 직접 삭제하거나 브라우저 데이터를 초기화할 때까지 보관됩니다. 서비스 측에서 별도로 수집하거나 저장하지 않습니다.</p>
        </section>

        <section className="policy-section">
          <h3>4. 개인정보의 제3자 제공</h3>
          <p>본 서비스는 사용자의 개인정보를 제3자에게 제공하지 않습니다.</p>
        </section>

        <section className="policy-section">
          <h3>5. 개인정보 보호책임자</h3>
          <p>개인정보 관련 문의는 아래로 연락해 주세요.</p>
          <ul>
            <li>담당: group9</li>
          </ul>
        </section>
      </div>
    </main>
  );
}

export default PrivacyPage;