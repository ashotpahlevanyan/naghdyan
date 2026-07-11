import { useEffect, useRef, useState } from 'react';

interface Props {
  images: string[];
  alt: string;
}

/**
 * Book image slider for the detail page: arrows, dots, keyboard (←/→), and
 * touch-swipe. Each slide falls back to a lettermark placeholder if its image
 * is missing, so a book can publish before its photos are ready.
 */
export default function BookSlider({ images, alt }: Props) {
  const slides = images.length ? images : [''];
  const [i, setI] = useState(0);
  const n = slides.length;
  const single = n < 2;
  const x0 = useRef<number | null>(null);

  const go = (k: number) => setI(((k % n) + n) % n);

  useEffect(() => {
    if (single) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(i - 1);
      if (e.key === 'ArrowRight') go(i + 1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  return (
    <div
      className={`slider${single ? ' single' : ''}`}
      onTouchStart={(e) => {
        x0.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (x0.current === null) return;
        const dx = e.changedTouches[0].clientX - x0.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? i + 1 : i - 1);
        x0.current = null;
      }}
    >
      <div className="slider-track" style={{ transform: `translateX(${-i * 100}%)` }}>
        {slides.map((src, idx) => (
          <div className="slide" key={idx}>
            {src ? (
              <img
                src={src}
                alt={alt}
                loading={idx === 0 ? 'eager' : 'lazy'}
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  img.style.display = 'none';
                  if (!img.nextElementSibling) {
                    img.insertAdjacentHTML('afterend', '<div class="slide-ph">RN</div>');
                  }
                }}
              />
            ) : (
              <div className="slide-ph">RN</div>
            )}
          </div>
        ))}
      </div>
      <button className="slider-btn prev" aria-label="Previous" onClick={() => go(i - 1)}>
        ‹
      </button>
      <button className="slider-btn next" aria-label="Next" onClick={() => go(i + 1)}>
        ›
      </button>
      <div className="slider-dots">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={idx === i ? 'active' : ''}
            aria-label={`Slide ${idx + 1}`}
            onClick={() => go(idx)}
          />
        ))}
      </div>
    </div>
  );
}
