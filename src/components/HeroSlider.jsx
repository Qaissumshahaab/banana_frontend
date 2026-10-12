import { useEffect, useRef, useState } from 'react';

export default function HeroSlider({ slides = [] }) {
  const [index, setIndex] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    if (slides.length <= 1) return;
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer.current);
  }, [slides.length]);

  if (!slides.length) {
    return (
      <div className="relative rounded-3xl overflow-hidden h-56 sm:h-72 md:h-96 banana-gradient flex items-center justify-center card-shadow">
        <p className="font-display text-2xl sm:text-3xl font-bold text-ink-900/80">🍌 Welcome to KELA.com</p>
      </div>
    );
  }

  function go(i) {
    setIndex(((i % slides.length) + slides.length) % slides.length);
  }

  return (
    <div className="relative rounded-3xl overflow-hidden h-56 sm:h-72 md:h-[26rem] card-shadow bg-banana-200">
      {slides.map((s, i) => (
        <div
          key={s._id}
          className="absolute inset-0 transition-opacity duration-700 ease-out"
          style={{ opacity: i === index ? 1 : 0, pointerEvents: i === index ? 'auto' : 'none' }}
          aria-hidden={i !== index}
        >
          <img src={s.url} alt={s.title || 'Slider image'} className="w-full h-full object-cover" />
          {s.title ? (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-900/70 to-transparent p-4 sm:p-6">
              <p className="font-display text-white text-lg sm:text-2xl font-bold drop-shadow">{s.title}</p>
            </div>
          ) : null}
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <button
            onClick={() => go(index - 1)}
            aria-label="Previous slide"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-ink-900 rounded-full p-2 shadow focus-ring"
          >
            ‹
          </button>
          <button
            onClick={() => go(index + 1)}
            aria-label="Next slide"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-ink-900 rounded-full p-2 shadow focus-ring"
          >
            ›
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all ${i === index ? 'w-6 bg-banana-500' : 'w-2 bg-white/70'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
