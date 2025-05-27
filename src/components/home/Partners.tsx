
import { useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';

// Mock partner logos
const partners = [
  {
    id: 1,
    name: "SolidWorks",
    logo: "https://cdn-icons-png.flaticon.com/512/5968/5968717.png"
  },
  {
    id: 2,
    name: "Autodesk",
    logo: "https://cdn-icons-png.flaticon.com/512/5968/5968197.png"
  },
  {
    id: 3,
    name: "MasterCAM",
    logo: "https://static-00.iconduck.com/assets.00/file-type-mastercam-icon-221x256-mjsfhqv4.png"
  },
  {
    id: 4,
    name: "Siemens",
    logo: "https://cdn-icons-png.flaticon.com/512/882/882686.png"
  },
  {
    id: 5,
    name: "Fusion 360",
    logo: "https://cdn-icons-png.flaticon.com/512/5968/5968549.png"
  },
  {
    id: 6,
    name: "SolidCAM",
    logo: "https://static-00.iconduck.com/assets.00/file-type-solidcam-icon-227x256-c8uklz2t.png"
  }
];

const Partners = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  
  const isDark = theme === 'dark';

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const cloneItems = () => {
      const items = scrollContainer.querySelectorAll('.partner-item');
      items.forEach(item => {
        const clone = item.cloneNode(true);
        scrollContainer.appendChild(clone);
      });
    };

    cloneItems();

    let scrollPos = 0;
    const speed = 0.5;
    let animationFrameId: number;

    const scroll = () => {
      if (!scrollContainer) return;
      
      scrollPos += speed;
      
      // Reset scroll position once we've scrolled through half the items
      if (scrollPos >= scrollContainer.clientWidth / 2) {
        scrollPos = 0;
      }
      
      scrollContainer.style.transform = `translateX(-${scrollPos}px)`;
      animationFrameId = requestAnimationFrame(scroll);
    };

    scroll();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className={`aia-section py-10 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="aia-container">
        <h2 className={`text-center text-2xl font-semibold mb-10 ${
          isDark ? 'text-white' : 'text-aiaGray-dark'
        }`}>
          Parceiros e Marcas Representadas
        </h2>
        
        <div className="overflow-hidden" ref={containerRef}>
          <div 
            className="flex items-center space-x-12 whitespace-nowrap"
            ref={scrollRef}
            style={{ willChange: 'transform' }}
          >
            {partners.map((partner) => (
              <div key={partner.id} className="partner-item flex-shrink-0">
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className={`h-16 md:h-20 w-auto transition-all duration-300 ${
                    isDark 
                      ? 'brightness-0 invert opacity-60 hover:opacity-100' 
                      : 'grayscale hover:grayscale-0 opacity-80 hover:opacity-100'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
