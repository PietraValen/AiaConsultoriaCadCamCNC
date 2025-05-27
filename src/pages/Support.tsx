
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { 
  Download, 
  HeadphonesIcon, 
  ShieldCheck, 
  Briefcase, 
  Award, 
  BarChart 
} from 'lucide-react';

// Support services
const supportServices = [
  {
    icon: <Download className="h-10 w-10 text-aiaBlue" />,
    title: "Download Imediato",
    description: "Acesso instantâneo ao software após confirmação do pagamento."
  },
  {
    icon: <HeadphonesIcon className="h-10 w-10 text-aiaBlue" />,
    title: "Suporte Técnico",
    description: "Equipe especializada para auxiliar na instalação e operação."
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-aiaBlue" />,
    title: "Licenças Originais",
    description: "Distribuidor autorizado das principais marcas do mercado."
  },
  {
    icon: <Briefcase className="h-10 w-10 text-aiaBlue" />,
    title: "Soluções Empresariais",
    description: "Pacotes customizados para necessidades específicas."
  },
  {
    icon: <Award className="h-10 w-10 text-aiaBlue" />,
    title: "Cursos Certificados",
    description: "Treinamentos reconhecidos pelo mercado para sua equipe."
  },
  {
    icon: <BarChart className="h-10 w-10 text-aiaBlue" />,
    title: "Consultoria Técnica",
    description: "Análise de processos e recomendação de ferramentas ideais."
  }
];

export default function Support() {
  return (
    <Layout>
      <div className="aia-container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Nossos Serviços</h1>
          <p className="text-lg max-w-3xl mx-auto">
            Oferecemos soluções completas para otimizar seus processos de design e manufatura, com softwares líderes de mercado e suporte especializado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {supportServices.map((service, index) => (
            <Card 
              key={index} 
              className="p-6 hover:shadow-lg transition-shadow duration-300 border"
            >
              <div className="mb-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {service.title}
              </h3>
              <p>
                {service.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
