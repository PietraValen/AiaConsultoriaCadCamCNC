
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HelpCircle, Mail } from 'lucide-react';

const CtaSection = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-r from-aiaBlue to-aiaTechBlue text-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
            Pronto para otimizar seus processos de engenharia e manufatura?
          </h2>
          <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 text-white/90">
            Entre em contato com nossa equipe de especialistas para uma consulta personalizada ou explore nosso catálogo completo de soluções.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link to="/contact" className="w-full sm:w-auto">
              <Button size="sm" className="bg-white text-aiaBlue hover:bg-gray-100 w-full sm:text-base text-sm sm:py-2">
                <Mail className="mr-1.5 h-4 w-4" />
                Fale Conosco
              </Button>
            </Link>
            <Link to="/softwares" className="w-full sm:w-auto">
              <Button size="sm" className="bg-aiaOrange hover:bg-aiaOrange-dark border-none w-full sm:text-base text-sm sm:py-2">
                <HelpCircle className="mr-1.5 h-4 w-4" />
                Explorar Soluções
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
