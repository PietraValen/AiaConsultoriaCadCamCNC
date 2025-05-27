
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tables } from '@/integrations/supabase/types';
import { ChevronLeft, Package, Server, ShoppingCart, Check, Plus, Minus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

type Product = Tables<'products'>;

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isInCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        setProduct(data);
      } catch (error: any) {
        toast.error('Erro ao carregar detalhes do produto: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const productInCart = product ? isInCart(product.id) : false;

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-12">
          <p className="text-center text-lg">Carregando detalhes do produto...</p>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Produto não encontrado</h2>
            <p className="mb-6">O produto que você está procurando não existe ou foi removido.</p>
            <Link to="/softwares">
              <Button>Ver todos os produtos</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Link to="/softwares" className="inline-flex items-center text-blue-600 hover:underline">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar para a lista de produtos
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <Badge variant="outline">{product.category}</Badge>
                <Badge variant="outline">{product.manufacturer}</Badge>
                {product.software_version && (
                  <Badge variant="outline">Versão {product.software_version}</Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              <div className="text-2xl font-bold text-blue-700 mb-4">
                {formatPrice(Number(product.price))}
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden mb-8">
              <img 
                src={product.image_url || 'https://images.unsplash.com/photo-1618092388874-764d73e28e17?q=80&w=1080'} 
                alt={product.name} 
                className="w-full h-auto max-h-[400px] object-cover"
              />
            </div>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Descrição</h2>
                <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
              </div>
              
              {product.requirements && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Requisitos de Sistema</h2>
                  <div className="flex items-start">
                    <Server className="text-gray-500 mr-2 h-5 w-5 mt-0.5" />
                    <p className="text-gray-700">{product.requirements}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Comprar Agora
                </CardTitle>
                <CardDescription>
                  Adicione ao carrinho ou entre em contato para mais informações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-xl font-bold">
                    {formatPrice(Number(product.price))}
                  </div>
                  
                  {!productInCart && (
                    <div className="flex items-center space-x-2 my-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(q => q + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span> Garantia de 1 ano
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span> Suporte técnico
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span> Instalação remota assistida
                    </li>
                  </ul>
                </div>
              </CardContent>
              <Separator />
              <CardFooter className="pt-6 flex flex-col space-y-3">
                <Button 
                  className={`w-full ${productInCart ? 'bg-green-600 hover:bg-green-700' : ''}`}
                  onClick={handleAddToCart}
                  disabled={productInCart}
                >
                  {productInCart ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Produto no Carrinho
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Adicionar ao Carrinho
                    </>
                  )}
                </Button>
                {productInCart && (
                  <Link to="/cart" className="w-full">
                    <Button variant="outline" className="w-full">
                      Ver Carrinho
                    </Button>
                  </Link>
                )}
                <Button variant="outline" className="w-full">
                  Solicitar Orçamento
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
