
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Youtube 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="aia-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">AIA Digital Tools</h3>
            <p className="text-muted-foreground mb-4">
              Soluções completas em softwares CAD/CAM/CNC para engenharia e manufatura.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-muted-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" className="text-muted-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                <Instagram size={20} />
              </a>
              <a href="https://linkedin.com" className="text-muted-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                <Linkedin size={20} />
              </a>
              <a href="https://youtube.com" className="text-muted-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Produtos</h3>
            <ul className="space-y-2">
              <li><Link to="/softwares/cad" className="text-muted-foreground hover:text-primary transition-colors">Softwares CAD</Link></li>
              <li><Link to="/softwares/cam" className="text-muted-foreground hover:text-primary transition-colors">Softwares CAM</Link></li>
              <li><Link to="/softwares/cnc" className="text-muted-foreground hover:text-primary transition-colors">Softwares CNC</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Suporte</h3>
            <ul className="space-y-2">
              <li><Link to="/support" className="text-muted-foreground hover:text-primary transition-colors">Central de Ajuda</Link></li>
              <li><Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">Perguntas Frequentes</Link></li>
              <li><Link to="/downloads" className="text-muted-foreground hover:text-primary transition-colors">Downloads</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contato</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-muted-foreground">
                <Phone size={16} className="mr-2" />
                <span>(11) 3456-7890</span>
              </li>
              <li className="flex items-center text-muted-foreground">
                <Mail size={16} className="mr-2" />
                <span>contato@aiadigitaltools.com.br</span>
              </li>
              <li className="flex items-start text-muted-foreground">
                <MapPin size={16} className="mr-2 mt-1" />
                <span>Av. Paulista, 1234 - Bela Vista<br />São Paulo - SP, 01310-100</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-4 border-t border-border text-muted-foreground text-sm flex flex-col md:flex-row justify-between items-center">
          <div>
            &copy; {new Date().getFullYear()} AIA Digital Tools. Todos os direitos reservados.
          </div>
          <div className="mt-2 md:mt-0 flex space-x-4">
            <Link to="/terms" className="hover:text-primary transition-colors">Termos de Uso</Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">Política de Privacidade</Link>
          </div>
        </div>

        {/* Developer credit */}
        <div className="text-center py-2 text-sm text-muted-foreground">
          Desenvolvido por Pietra Valentina
        </div>
      </div>
    </footer>
  );
};

export default Footer;
