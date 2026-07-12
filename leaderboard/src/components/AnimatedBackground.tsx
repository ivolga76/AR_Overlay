'use client';
// Awesome Animated Background — точная копия CodePen jmbGNd
// Белые вертикальные лучи (light beams), плывущие вверх на тёмном фоне

export function AnimatedBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0, background: 'linear-gradient(180deg, #0a0015 0%, #140030 100%)' }}
      aria-hidden="true"
    >
      <div className="light x1" />
      <div className="light x2" />
      <div className="light x3" />
      <div className="light x4" />
      <div className="light x5" />
      <div className="light x6" />
      <div className="light x7" />
      <div className="light x8" />
      <div className="light x9" />
    </div>
  );
}
