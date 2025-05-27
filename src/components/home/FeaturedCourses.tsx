
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, BookOpen } from 'lucide-react';

// Mock data for featured courses
const featuredCourses = [
  {
    id: 1,
    title: "SolidWorks Avançado",
    category: "CAD",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    duration: "40 horas",
    students: 358,
    instructor: "Eng. Carlos Silva",
    price: 1490,
    isNew: true
  },
  {
    id: 2,
    title: "Programação CNC Básico ao Avançado",
    category: "CNC",
    image: "https://images.unsplash.com/photo-1565688534245-05d6b5be184a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    duration: "60 horas",
    students: 412,
    instructor: "Téc. Roberto Almeida",
    price: 1790,
    isNew: false
  },
  {
    id: 3,
    title: "Mastercam para Fresamento",
    category: "CAM",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    duration: "35 horas",
    students: 275,
    instructor: "Eng. Ana Soares",
    price: 1290,
    isNew: true
  }
];

// Format price to BRL
const formatPrice = (price: number) => {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

const FeaturedCourses = () => {
  return (
    <section className="aia-section">
      <div className="aia-container">
        <div className="flex justify-between items-center mb-8">
          <h2 className="aia-heading">Cursos em Destaque</h2>
          <Link to="/courses" className="text-aiaTechBlue hover:text-aiaTechBlue-dark font-medium">
            Ver todos →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCourses.map((course) => (
            <Card key={course.id} className="aia-card overflow-hidden flex flex-col h-full">
              <div className="relative">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-44 object-cover"
                />
                {course.isNew && (
                  <Badge className="absolute top-2 right-2 bg-aiaTechBlue">Novo</Badge>
                )}
                <Badge className="absolute top-2 left-2 bg-aiaGray">{course.category}</Badge>
              </div>
              
              <div className="p-4 flex-grow flex flex-col">
                <Link to={`/courses/${course.id}`}>
                  <h3 className="text-lg font-bold text-aiaBlue mb-2 hover:text-aiaTechBlue transition-colors">
                    {course.title}
                  </h3>
                </Link>
                
                <div className="text-gray-600 text-sm mb-3">
                  Instrutor: {course.instructor}
                </div>
                
                <div className="flex flex-wrap text-sm text-gray-600 mb-4 gap-y-2">
                  <div className="flex items-center mr-4">
                    <Clock size={16} className="mr-1" />
                    {course.duration}
                  </div>
                  <div className="flex items-center mr-4">
                    <Users size={16} className="mr-1" />
                    {course.students} alunos
                  </div>
                  <div className="flex items-center">
                    <BookOpen size={16} className="mr-1" />
                    Certificado
                  </div>
                </div>
                
                <div className="mt-auto">
                  <div className="flex justify-between items-baseline mb-3">
                    <div className="text-lg font-semibold text-aiaGray">
                      {formatPrice(course.price)}
                    </div>
                    <div className="text-sm text-gray-600">
                      em até 12x
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button className="flex-1 aia-button-primary text-sm">
                      Matricular
                    </Button>
                    <Link to={`/courses/${course.id}`} className="flex-1">
                      <Button variant="outline" className="w-full text-sm">Detalhes</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
