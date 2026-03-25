import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let raf: number;

    const move = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      }
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px)`;
      }
      raf = requestAnimationFrame(animate);
    };

    const onEnter = () => {
      ringRef.current?.classList.add('cursor-hover');
    };
    const onLeave = () => {
      ringRef.current?.classList.remove('cursor-hover');
    };

    document.addEventListener('mousemove', move);
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });
    raf = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
      <style jsx global>{`
        * { cursor: none !important; }
        .cursor-dot {
          position: fixed;
          top: -4px;
          left: -4px;
          width: 8px;
          height: 8px;
          background: #d4f53c;
          border-radius: 50%;
          pointer-events: none;
          z-index: 99999;
          will-change: transform;
        }
        .cursor-ring {
          position: fixed;
          top: -20px;
          left: -20px;
          width: 40px;
          height: 40px;
          border: 1.5px solid #d4f53c;
          border-radius: 50%;
          pointer-events: none;
          z-index: 99998;
          will-change: transform;
          transition: width 0.2s, height 0.2s, top 0.2s, left 0.2s, border-color 0.2s;
        }
        .cursor-ring.cursor-hover {
          width: 60px;
          height: 60px;
          top: -30px;
          left: -30px;
          border-color: #ff6b35;
          mix-blend-mode: difference;
        }
      `}</style>
    </>
  );
}
