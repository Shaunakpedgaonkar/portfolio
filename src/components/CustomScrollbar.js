import React, { useEffect, useRef, useState } from 'react';
import './CustomScrollbar.css';

function CustomScrollbar({ containerRef }) {
  const thumbRef = useRef(null);
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const scrollContainer = containerRef.current;
    const track = trackRef.current;
    const thumb = thumbRef.current;

    function updateThumb() {
      const scrollLeft = scrollContainer.scrollLeft;
      const scrollWidth = scrollContainer.scrollWidth;
      const clientWidth = scrollContainer.clientWidth;
      const thumbWidth = (clientWidth / scrollWidth) * track.offsetWidth;

      thumb.style.width = `${thumbWidth}px`;
      thumb.style.left = `${(scrollLeft / scrollWidth) * track.offsetWidth}px`;
    }

    const onMouseMove = (e) => {
      if (!isDragging) return;

      const trackRect = track.getBoundingClientRect();
      const offsetX = e.clientX - trackRect.left;
      const scrollRatio = offsetX / track.offsetWidth;
      scrollContainer.scrollLeft = scrollRatio * scrollContainer.scrollWidth;
    };

    const onMouseUp = () => {
      setIsDragging(false);
    };

    scrollContainer.addEventListener('scroll', updateThumb);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    updateThumb(); // Initial position

    return () => {
      scrollContainer.removeEventListener('scroll', updateThumb);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, containerRef]);

  return (
    <div className="custom-scrollbar-track" ref={trackRef}>
      {/* Tick marks */}
      <div className="tick-marks">
        {Array.from({ length: 60 }).map((_, i) => (
          <div key={i} className="tick" />
        ))}
      </div>
      <div
        ref={thumbRef}
        className="custom-scrollbar-thumb"
        onMouseDown={() => setIsDragging(true)}
      />
    </div>
  );
}

export default CustomScrollbar;
    