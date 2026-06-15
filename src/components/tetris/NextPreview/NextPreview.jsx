import React from 'react';
import './NextPreview.css';

function NextPreview({ nextCanvasRefs }) {
  return (
    <div className="next-preview-list">
      {nextCanvasRefs.map((ref, i) => (
        <div key={i} className={`next-preview-box ${i > 0 ? 'next-preview-box--small' : ''}`}>
          <canvas ref={ref} width={i === 0 ? 96 : 72} height={i === 0 ? 96 : 72} />
        </div>
      ))}
    </div>
  );
}

export default NextPreview;