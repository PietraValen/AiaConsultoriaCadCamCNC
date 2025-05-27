
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tables } from '@/integrations/supabase/types';
import { Package, PlusCircle, LineChart, MessageSquare, CreditCard } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

type Product = Tables<'products'>;

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { userRole, isLoading } = useAuth();

  // Check if user is an admin
  useEffect(() => {
    if (isLoading) return;
    
    if (userRole !== 'master') {
      toast.error('Você não tem permissão para acessar esta página');
      navigate('/');
      return;
    }
    
    fetchProducts();
  }, [navigate, userRole, isLoading]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast.error('Erro ao carregar produtos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || userRole !== 'master') {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Painel Administrativo</h1>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/admin/products/new')}>
              <PlusCircle className="mr-2 h-4 w-4" /> Novo Produto
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <LineChart className="h-4 w-4 mr-2 text-blue-500" />
                Estatísticas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground">Produtos cadastrados</p>
              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full" disabled>
                  Configurar Google ADS
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <MessageSquare className="h-4 w-4 mr-2 text-green-500" />
                Avaliações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Avaliações pendentes</p>
              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full" disabled>
                  Ver Avaliações
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <CreditCard className="h-4 w-4 mr-2 text-orange-500" />
                Pagamentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">Integração de pagamento</p>
              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full" disabled>
                  Configurar MercadoPago
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" /> 
              Produtos
            </CardTitle>
            <CardDescription>
              Gerencie os produtos disponíveis para venda
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Carregando produtos...</p>
            ) : products.length === 0 ? (
              <p>Nenhum produto encontrado.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Fabricante</TableHead>
                    <TableHead>Preço (R$)</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.manufacturer}</TableCell>
                      <TableCell>
                        {Number(product.price).toLocaleString('pt-BR', { 
                          minimumFractionDigits: 2 
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/admin/products/${product.id}`)}
                          >
                            Editar
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={async () => {
                              if (window.confirm('Tem certeza que deseja excluir este produto?')) {
                                try {
                                  const { error } = await supabase
                                    .from('products')
                                    .delete()
                                    .eq('id', product.id);
                                    
                                  if (error) throw error;
                                  toast.success('Produto excluído com sucesso');
                                  fetchProducts();
                                } catch (error: any) {
                                  toast.error('Erro ao excluir produto: ' + error.message);
                                }
                              }
                            }}
                          >
                            Excluir
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
