import React from 'react';
import './AboutPage.css';

const TECH_STACKS = [
  {
    category: '프론트엔드',
    items: [
      { name: 'React', color: '#61dafb' },
      { name: 'Vite', color: '#646cff' },
      { name: 'JavaScript', color: '#f7df1e' },
      { name: 'HTML Canvas', color: '#e34f26' },
      { name: 'CSS', color: '#264de4' },
    ]
  },
  {
    category: '개발 도구',
    items: [
      { name: 'VSCode', color: '#007acc' },
      { name: 'Vite', color: '#646cff' },
    ]
  },
  {
    category: '협업',
    items: [
      { name: '카카오톡', color: '#fee500' },
    ]
  },
];

const MEMBERS = [
  { name: '이름', role: 'Frontend' },
  { name: '이름', role: 'Frontend' },
  { name: '이름', role: 'Frontend' },
];

function AboutPage({ onBack }) {
  return (
    <main className="about-main">
      <div className="about-content">
        <button className="back-btn" onClick={onBack}>← 뒤로</button>
        <h2 className="about-title">ABOUT</h2>

        <section className="about-section">
          <h3>프로젝트 소개</h3>
          <p>TETRis는 고전 테트리스 게임을 현대적으로 재해석한 웹 게임입니다.<br />
            회원가입 후 로그인하면 최고 기록이 저장됩니다.</p>
        </section>

        <section className="about-section">
          <h3>기술 스택</h3>
          <div className="stack-groups">
            {TECH_STACKS.map(group => (
              <div key={group.category} className="stack-group">
                <p className="stack-category">{group.category}</p>
                <div className="stack-items">
                  {group.items.map(item => (
                    <div key={item.name} className="stack-badge" style={{ '--accent': item.color }}>
                      <div className="stack-dot" />
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="about-section">
          <h3>팀원</h3>
          <div className="member-list">
            {MEMBERS.map((m, i) => (
              <div key={i} className="member-card">
                <div className="member-avatar">{m.name[0]}</div>
                <div>
                  <p className="member-name">{m.name}</p>
                  <p className="member-role">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default AboutPage;