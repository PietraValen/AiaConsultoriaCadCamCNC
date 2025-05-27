
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { CartDropdown } from '../cart/CartDropdown';
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { user, signOut, userRole } = useAuth();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  
  const isAdmin = userRole === 'admin';

  const mainNavItems = [
    { name: 'Início', href: '/' },
    { name: 'Softwares', href: '/softwares' },
    { name: 'Sobre', href: '/about' },
    { name: 'Contato', href: '/contact' },
  ];

  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-sm sm:text-base md:text-xl font-bold text-aiaBlue truncate dark:text-blue-400">AIA Consultoria CAD-CAM-CNC</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {mainNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-600 dark:text-gray-300 hover:text-aiaTechBlue dark:hover:text-blue-300 text-sm font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* Right side buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
            <ThemeToggle />
            {/* Cart Dropdown */}
            <CartDropdown />
            
            {/* Authentication */}
            {user ? (
              <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="text-xs lg:text-sm">
                    Minha Conta
                  </Button>
                </Link>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="ghost" size="sm" className="text-xs lg:text-sm">
                      Admin
                    </Button>
                  </Link>
                )}
                <Button variant="destructive" size="sm" onClick={handleSignOut} className="text-xs lg:text-sm">
                  Sair
                </Button>
              </div>
            ) : (
              <div className="hidden md:block">
                <Link to="/auth">
                  <Button size="sm" className="text-xs lg:text-sm">Entrar</Button>
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden p-1.5">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <div className="grid gap-3 py-4">
                  <div className="grid gap-2">
                    {mainNavItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="flex items-center py-2 text-base sm:text-lg"
                        onClick={() => setOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                    {user && (
                      <Link
                        to="/profile"
                        className="flex items-center py-2 text-base sm:text-lg"
                        onClick={() => setOpen(false)}
                      >
                        Minha Conta
                      </Link>
                    )}
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center py-2 text-base sm:text-lg"
                        onClick={() => setOpen(false)}
                      >
                        Admin
                      </Link>
                    )}
                    {user ? (
                      <Button 
                        variant="destructive"
                        className="w-full mt-2"
                        size="sm"
                        onClick={() => {
                          handleSignOut();
                          setOpen(false);
                        }}
                      >
                        Sair
                      </Button>
                    ) : (
                      <Link 
                        to="/auth" 
                        onClick={() => setOpen(false)}
                        className="w-full mt-2"
                      >
                        <Button className="w-full" size="sm">Entrar</Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
