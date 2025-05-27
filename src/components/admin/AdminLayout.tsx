
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  ShoppingCart,
  CreditCard,
  ChevronLeft,
} from 'lucide-react';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin',
    },
    {
      title: 'Produtos',
      icon: Package,
      path: '/admin/products',
    },
    {
      title: 'Google ADS',
      icon: TrendingUp,
      path: '/admin/analytics',
    },
    {
      title: 'Pedidos',
      icon: ShoppingCart,
      path: '/admin/orders',
    },
    {
      title: 'Pagamentos',
      icon: CreditCard,
      path: '/admin/payments',
    },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="p-4">
            <h2 className="text-lg font-semibold">Painel Admin</h2>
          </SidebarHeader>
          <SidebarContent>
            <nav className="space-y-2 p-2">
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={() => navigate(item.path)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Button>
              ))}
            </nav>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1">
          <div className="p-4">
            <SidebarTrigger asChild>
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </SidebarTrigger>
          </div>
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
