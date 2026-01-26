import { useState, useEffect } from "react";

// ✅ CORREGIDO: Rutas directas a la carpeta public (sin new URL, sin import)
const images = [
  "/assets/habSen1.jpg",
  "/assets/habSen2.jpg",
  "/assets/habSuite1.jpg",
  "/assets/habSuite2.jpg",
  "/assets/habSen3.jpg"
];

const Carousel = ({ setBackground }: { setBackground: (src: string) => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setBackground(images[currentIndex]);
  }, [currentIndex, setBackground]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getPositionClass = (index: number) => {
    const diff = (index - currentIndex + images.length) % images.length;

    if (diff === 0) return "translate-x-0 scale-105 z-30 opacity-100";
    if (diff === 1) return "-translate-x-[160px] scale-95 z-20 opacity-80";
    if (diff === 2) return "-translate-x-[320px] scale-90 z-10 opacity-60";
    if (diff === images.length - 1) return "translate-x-[160px] scale-95 z-20 opacity-80";
    if (diff === images.length - 2) return "translate-x-[320px] scale-90 z-10 opacity-60";
    return "opacity-0 hidden";
  };

  return (
    <div className="relative flex items-center justify-center h-[150px] w-full z-10">
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Slide ${index}`}
          className={`absolute w-[200px] h-[150px] object-cover rounded-xl shadow-lg transition-transform duration-700 ease-in-out ${getPositionClass(index)}`}
        />
      ))}
    </div>
  );
};

export default Carousel;