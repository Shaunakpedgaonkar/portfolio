import React, { useEffect, useState } from 'react';
import './ScrollHint.css';

function ScrollHint({ currentPageIndex, totalPages }) {
  const [text, setText] = useState('← scroll →');

  useEffect(() => {
    if (currentPageIndex === 0) {
      setText('→ scroll');
    } else if (currentPageIndex === totalPages - 1) {
      setText('← scroll');
    } else {
      setText('← scroll →');
    }
  }, [currentPageIndex, totalPages]);

  return <div className="scroll-hint">{text}</div>;
}

export default ScrollHint;
