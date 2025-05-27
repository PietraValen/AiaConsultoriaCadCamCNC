
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const slides = [
  {
    id: 1,
    title: "Soluções CAD/CAM de alto desempenho",
    subtitle: "Aumente a produtividade da sua equipe de engenharia",
    cta: "Explorar Soluções",
    link: "/softwares",
    image: "https://images.unsplash.com/photo-1581092921461-fd3e4eedb97a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    bgColor: "from-aiaBlue-dark/80 to-aiaBlue/50"
  },
  {
    id: 2,
    title: "Cursos Especializados CAD/CAM/CNC",
    subtitle: "Treinamentos certificados para sua equipe",
    cta: "Ver Cursos",
    link: "/courses",
    image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    bgColor: "from-aiaTechBlue-dark/80 to-aiaTechBlue/50"
  },
  {
    id: 3,
    title: "Suporte Técnico Especializado",
    subtitle: "Equipe de engenheiros prontos para ajudar",
    cta: "Conhecer Suporte",
    link: "/support",
    image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    bgColor: "from-aiaGray-dark/80 to-aiaGray/50"
  }
];

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[400px] sm:h-[450px] md:h-[500px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgColor}`}></div>
          <div className="container mx-auto h-full flex items-center px-4 sm:px-6">
            <div className="max-w-md text-white z-10">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3">{slide.title}</h1>
              <p className="text-base sm:text-lg md:text-xl mb-4 sm:mb-6">{slide.subtitle}</p>
              <Link to={slide.link}>
                <Button size="sm" className="aia-button-cta sm:text-base text-sm sm:px-6 px-3 py-1.5 sm:py-2">
                  {slide.cta}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation buttons */}
      <button
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 sm:p-2 rounded-full transition-colors z-10"
        onClick={prevSlide}
      >
        <ChevronLeft size={20} className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>
      <button
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 sm:p-2 rounded-full transition-colors z-10"
        onClick={nextSlide}
      >
        <ChevronRight size={20} className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-1.5 sm:h-2 w-4 sm:w-8 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => setCurrentSlide(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
