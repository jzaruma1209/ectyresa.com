import { useEffect, useState } from "react";

const slides = [
  { src: "/baner.webp", alt: "Promoción principal de llantas" },
  { src: "/baner2.webp", alt: "Vehículo mostrando rendimiento de llantas" },
  { src: "/baner3.webp", alt: "Detalle de neumáticos y rines" },
];

const AUTOPLAY_MS = 5000;

const HeroBanner = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = (nextIndex) => {
    setActiveIndex((nextIndex + slides.length) % slides.length);
  };

  useEffect(() => {
    const timerId = setInterval(() => goTo(activeIndex + 1), AUTOPLAY_MS);
    return () => clearInterval(timerId);
  }, [activeIndex]);

  return (
    <div className="relative w-full">
      <div className="relative h-[122px] overflow-hidden rounded-xl shadow-lg bg-black/80">
        {slides.map((slide, index) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === activeIndex
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <img
              src={slide.src}
              alt={slide.alt}
              className="absolute inset-0 block h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 space-x-2">
        {slides.map((_, index) => (
          <button
            key={`indicator-${index}`}
            type="button"
            aria-current={index === activeIndex ? "true" : "false"}
            aria-label={`Slide ${index + 1}`}
            className={`h-2 w-2 rounded-full border border-white/70 transition p-0 ${
              index === activeIndex
                ? "bg-white shadow-[0_0_0_2px_rgba(255,255,255,0.35)]"
                : "bg-white/20"
            }`}
            onClick={() => goTo(index)}
          />
        ))}
      </div>

      <button
        type="button"
        className="absolute left-0 top-0 z-30 flex h-full items-center justify-center px-4 focus:outline-none bg-transparent hover:bg-transparent active:bg-transparent focus:bg-transparent border-none shadow-none"
        onClick={() => goTo(activeIndex - 1)}
        aria-label="Slide anterior"
      >
        <span className="inline-flex items-center justify-center rounded-full p-3 text-white transition hover:bg-white/10">
          <svg
            className="h-5 w-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m14 7-5 5 5 5"
            />
          </svg>
        </span>
      </button>

      <button
        type="button"
        className="absolute right-0 top-0 z-30 flex h-full items-center justify-center px-4 focus:outline-none bg-transparent hover:bg-transparent active:bg-transparent focus:bg-transparent border-none shadow-none"
        onClick={() => goTo(activeIndex + 1)}
        aria-label="Siguiente slide"
      >
        <span className="inline-flex items-center justify-center rounded-full p-3 text-white transition hover:bg-white/10">
          <svg
            className="h-5 w-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m10 7 5 5-5 5"
            />
          </svg>
        </span>
      </button>
    </div>
  );
};

export default HeroBanner;
