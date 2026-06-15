import React from 'react';
import './PolicyPage.css';

function TermsPage() {
  return (
    <main className="policy-main">
      <div className="policy-content">
        <h2 className="policy-title">이용약관</h2>
        <p className="policy-date">최종 수정일: 2026년 1월 1일</p>

        <section className="policy-section">
          <h3>제1조 (목적)</h3>
          <p>본 약관은 group9(이하 "서비스")이 제공하는 TETRis 웹 게임 서비스의 이용 조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.</p>
        </section>

        <section className="policy-section">
          <h3>제2조 (서비스 이용)</h3>
          <ul>
            <li>회원가입 없이 게스트로 서비스를 이용할 수 있습니다.</li>
            <li>회원으로 가입하면 게임 최고 점수 기록 저장 기능을 이용할 수 있습니다.</li>
            <li>서비스는 웹 브라우저 환경에서 제공되며, 일부 기능은 브라우저 환경에 따라 제한될 수 있습니다.</li>
          </ul>
        </section>

        <section className="policy-section">
          <h3>제3조 (회원의 의무)</h3>
          <ul>
            <li>타인의 정보를 도용하거나 허위 정보를 등록해서는 안 됩니다.</li>
            <li>서비스의 정상적인 운영을 방해하는 행위를 해서는 안 됩니다.</li>
            <li>본 서비스는 학습 목적으로 제작된 프로젝트입니다.</li>
          </ul>
        </section>

        <section className="policy-section">
          <h3>제4조 (서비스 변경 및 중단)</h3>
          <p>서비스는 사전 고지 없이 내용이 변경되거나 중단될 수 있습니다. 이로 인해 발생하는 손해에 대해 서비스는 별도의 책임을 지지 않습니다.</p>
        </section>

        <section className="policy-section">
          <h3>제5조 (면책조항)</h3>
          <p>본 서비스는 학습 목적으로 제작된 프로젝트로, 상업적 목적이 없으며 서비스 이용 중 발생하는 모든 결과에 대한 책임은 사용자 본인에게 있습니다.</p>
        </section>
      </div>
    </main>
  );
}

export default TermsPage;