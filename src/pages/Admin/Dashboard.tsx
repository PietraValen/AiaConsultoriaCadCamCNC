
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, TrendingUp, ShoppingCart, CreditCard } from 'lucide-react';

export default function AdminDashboard() {
  const { userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole !== 'master') {
      navigate('/');
    }
  }, [userRole, navigate]);

  const stats = [
    {
      title: 'Total de Produtos',
      value: '24',
      icon: Package,
      change: '+2 essa semana',
      trend: 'up',
    },
    {
      title: 'Cliques no Google Ads',
      value: '1,234',
      icon: TrendingUp,
      change: '+15% esse mês',
      trend: 'up',
    },
    {
      title: 'Pedidos Totais',
      value: '156',
      icon: ShoppingCart,
      change: '12 novos pedidos',
      trend: 'up',
    },
    {
      title: 'Receita Total',
      value: 'R$ 45.689,00',
      icon: CreditCard,
      change: '+23% esse mês',
      trend: 'up',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao seu painel administrativo
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
