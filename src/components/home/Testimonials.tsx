
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

// Mock testimonial data
const testimonials = [
  {
    id: 1,
    name: "João Silva",
    company: "Metalúrgica Precisão",
    position: "Gerente de Engenharia",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "A implementação do SolidWorks através da AIA aumentou nossa produtividade em 30%. O suporte técnico é excepcional, sempre nos ajudando a resolver problemas complexos rapidamente."
  },
  {
    id: 2,
    name: "Maria Oliveira",
    company: "TechParts Indústria",
    position: "Diretora de Operações",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "Os cursos de CAM oferecidos pela AIA transformaram nossa capacidade de produção. Nossa equipe agora programa peças complexas em metade do tempo, reduzindo significativamente nossos custos operacionais."
  },
  {
    id: 3,
    name: "Roberto Ferreira",
    company: "Inovamaq Engenharia",
    position: "Diretor Técnico",
    image: "https://randomuser.me/api/portraits/men/62.jpg",
    text: "Trabalhar com a AIA Digital Tools nos deu acesso a licenças de software de alta qualidade e suporte técnico especializado. Recomendo fortemente para qualquer empresa que busca melhorar seus processos de manufatura."
  },
  {
    id: 4,
    name: "Ana Costa",
    company: "Protom Protótipos",
    position: "Coordenadora de Projetos",
    image: "https://randomuser.me/api/portraits/women/58.jpg",
    text: "A consultoria da AIA nos ajudou a escolher as melhores ferramentas para nosso fluxo de trabalho. O processo de implementação foi tranquilo e o suporte contínuo é inestimável para nossa operação."
  }
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemsPerPage = window.innerWidth < 768 ? 1 : 2;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const visibleTestimonials = testimonials.slice(
    activeIndex * itemsPerPage,
    activeIndex * itemsPerPage + itemsPerPage
  );

  return (
    <section className="aia-section bg-white dark:bg-gray-900/50 transition-colors duration-300">
      <div className="aia-container">
        <div className="text-center mb-12">
          <h2 className="aia-heading mb-4 text-aiaBlue dark:text-white transition-colors duration-300">
            O Que Nossos Clientes Dizem
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors duration-300">
            Confira os depoimentos de empresas que transformaram seus processos com nossas soluções.
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {visibleTestimonials.map((testimonial) => (
              <Card 
                key={testimonial.id} 
                className="p-6 border border-gray-200 dark:border-gray-700/50 dark:bg-gray-800/50 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex flex-col h-full">
                  <div className="text-aiaTechBlue dark:text-blue-400 transition-colors duration-300 mb-4">
                    <Quote size={36} />
                  </div>
                  
                  <blockquote className="text-gray-700 dark:text-gray-300 mb-6 flex-grow transition-colors duration-300">
                    "{testimonial.text}"
                  </blockquote>
                  
                  <div className="flex items-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-semibold text-aiaGray-dark dark:text-white transition-colors duration-300">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                        {testimonial.position}, {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-center space-x-2">
            <button
              className="p-2 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
              onClick={prevSlide}
              aria-label="Previous testimonials"
            >
              <ChevronLeft size={20} className="dark:text-gray-300" />
            </button>
            
            <div className="flex space-x-2 items-center">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`h-2 w-8 rounded-full transition-colors duration-300 ${
                    index === activeIndex 
                      ? 'bg-aiaTechBlue dark:bg-blue-400' 
                      : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to testimonial page ${index + 1}`}
                ></button>
              ))}
            </div>
            
            <button
              className="p-2 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
              onClick={nextSlide}
              aria-label="Next testimonials"
            >
              <ChevronRight size={20} className="dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
