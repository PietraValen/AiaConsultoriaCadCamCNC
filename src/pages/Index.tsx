
import Layout from '@/components/layout/Layout';
import HeroBanner from '@/components/home/HeroBanner';
import FeaturedSoftware from '@/components/home/FeaturedSoftware';
import FeaturedSoftwareCategories from '@/components/home/FeaturedSoftwareCategories';
import ServicesSection from '@/components/home/ServicesSection';
import Partners from '@/components/home/Partners';
import Testimonials from '@/components/home/Testimonials';
import CtaSection from '@/components/home/CtaSection';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LockKeyhole } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';

export default function Index() {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const isDark = theme === 'dark';
  
  return (
    <Layout>
      {userRole === 'master' && (
        <div className="container mx-auto my-2 px-4">
          <Button 
            onClick={() => navigate('/admin')}
            size="sm"
            className={`flex items-center gap-1.5 text-xs sm:text-sm ${
              isDark 
                ? 'bg-amber-600 hover:bg-amber-700' 
                : 'bg-yellow-600 hover:bg-yellow-700'
            }`}
          >
            <LockKeyhole className="h-3 w-3 sm:h-4 sm:w-4" />
            Acessar Painel Administrativo
          </Button>
        </div>
      )}
      <HeroBanner />
      <FeaturedSoftware />
      <FeaturedSoftwareCategories />
      <ServicesSection />
      <Partners />
      <Testimonials />
      <CtaSection />
    </Layout>
  );
}
