
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    id: 'cad',
    title: 'Software CAD',
    description: 'Soluções para design e modelagem 3D de alta precisão',
    image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    icon: '✏️'
  },
  {
    id: 'cam',
    title: 'Software CAM',
    description: 'Ferramentas avançadas para geração de programas de usinagem CNC',
    image: 'https://images.unsplash.com/photo-1578598335941-2a0697654f9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    icon: '🔧'
  },
  {
    id: 'cnc',
    title: 'CNC e Automação',
    description: 'Soluções completas para programação e controle de máquinas CNC',
    image: 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    icon: '⚙️'
  }
];

const FeaturedSoftwareCategories = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap justify-between items-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-aiaBlue dark:text-white mb-2 sm:mb-0">
            Categorias de Softwares
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((category) => (
            <Link to={`/softwares?category=${category.id}`} key={category.id} className="block">
              <Card className="cursor-pointer overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg h-full">
                <div className="h-32 sm:h-40 md:h-48 overflow-hidden relative">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-3 sm:p-4 md:p-6">
                      <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{category.icon}</div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">{category.title}</h3>
                    </div>
                  </div>
                </div>
                <CardContent className="p-3 sm:p-4">
                  <p className="text-gray-600 text-xs sm:text-sm dark:text-gray-300">{category.description}</p>
                  <div className="flex items-center mt-2 text-aiaTechBlue dark:text-blue-400 font-medium">
                    <span className="text-xs sm:text-sm">Ver produtos</span>
                    <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSoftwareCategories;
