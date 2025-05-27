
import { 
  Download, 
  HeadphonesIcon, 
  ShieldCheck, 
  Briefcase, 
  Award, 
  BarChart 
} from 'lucide-react';

const services = [
  {
    icon: <Download className="h-8 w-8 sm:h-10 sm:w-10 text-aiaBlue dark:text-white" />,
    title: "Download Imediato",
    description: "Acesso instantâneo ao software após confirmação do pagamento."
  },
  {
    icon: <HeadphonesIcon className="h-8 w-8 sm:h-10 sm:w-10 text-aiaBlue dark:text-white" />,
    title: "Suporte Técnico",
    description: "Equipe especializada para auxiliar na instalação e operação."
  },
  {
    icon: <ShieldCheck className="h-8 w-8 sm:h-10 sm:w-10 text-aiaBlue dark:text-white" />,
    title: "Licenças Originais",
    description: "Distribuidor autorizado das principais marcas do mercado."
  },
  {
    icon: <Briefcase className="h-8 w-8 sm:h-10 sm:w-10 text-aiaBlue dark:text-white" />,
    title: "Soluções Empresariais",
    description: "Pacotes customizados para necessidades específicas."
  },
  {
    icon: <Award className="h-8 w-8 sm:h-10 sm:w-10 text-aiaBlue dark:text-white" />,
    title: "Cursos Certificados",
    description: "Treinamentos reconhecidos pelo mercado para sua equipe."
  },
  {
    icon: <BarChart className="h-8 w-8 sm:h-10 sm:w-10 text-aiaBlue dark:text-white" />,
    title: "Consultoria Técnica",
    description: "Análise de processos e recomendação de ferramentas ideais."
  }
];

const ServicesSection = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-aiaBlue mb-3 sm:mb-4 dark:text-white">Nossos Serviços</h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Oferecemos soluções completas para otimizar seus processos de design e manufatura, com softwares líderes de mercado e suporte especializado.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
            >
              <div className="mb-3 sm:mb-4">
                {service.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-aiaGray-dark dark:text-white mb-2">
                {service.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
