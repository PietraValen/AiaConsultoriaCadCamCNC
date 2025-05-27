
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, Check } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

type Product = Tables<'products'>;

// Mock ratings for display purposes
const productRatings: Record<string, { rating: number; isBestSeller: boolean }> = {
  'SolidWorks Premium': { rating: 4.8, isBestSeller: true },
  'Fusion 360': { rating: 4.5, isBestSeller: true },
  'Mastercam': { rating: 4.7, isBestSeller: false },
  'AutoCAD': { rating: 4.6, isBestSeller: false },
  'CATIA': { rating: 4.8, isBestSeller: true },
};

const FeaturedSoftware = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, isInCart } = useCart();
  const { theme } = useTheme();
  
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .limit(4);
          
        if (error) throw error;
        setFeaturedProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className={`aia-section ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="aia-container">
          <div className="flex justify-between items-center mb-8">
            <h2 className={`aia-heading ${isDark ? 'text-white' : ''}`}>Softwares em Destaque</h2>
          </div>
          <p className={`text-center py-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Carregando produtos...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={`aia-section ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="aia-container">
        <div className="flex justify-between items-center mb-8">
          <h2 className={`aia-heading ${isDark ? 'text-white' : ''}`}>Softwares em Destaque</h2>
          <Link 
            to="/softwares" 
            className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-aiaTechBlue hover:text-aiaTechBlue-dark'} font-medium`}
          >
            Ver todos →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => {
            // Get rating info from the mock data, or provide defaults
            const ratingInfo = productRatings[product.name] || { 
              rating: 4.5, 
              isBestSeller: false 
            };
            
            const productInCart = isInCart(product.id);
            
            return (
              <Card 
                key={product.id} 
                className={`aia-card overflow-hidden flex flex-col h-full ${
                  isDark ? 'bg-gray-800 border-gray-700 hover:shadow-blue-900/20' : ''
                }`}
              >
                <div className="relative">
                  <img
                    src={product.image_url || "https://images.unsplash.com/photo-1588186939549-9611b74916b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"}
                    alt={product.name}
                    className="w-full h-44 object-cover"
                  />
                  {ratingInfo.isBestSeller && (
                    <Badge className="absolute top-2 right-2 bg-aiaOrange">Mais Vendido</Badge>
                  )}
                  <Badge className="absolute top-2 left-2 bg-aiaGray">{product.category}</Badge>
                </div>
                
                <div className="p-4 flex-grow flex flex-col">
                  <Link to={`/softwares/${product.id}`}>
                    <h3 className={`text-lg font-bold ${
                      isDark ? 'text-blue-400 hover:text-blue-300' : 'text-aiaBlue hover:text-aiaTechBlue'
                    } mb-1 transition-colors`}>
                      {product.name}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-500 mr-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < Math.floor(ratingInfo.rating) ? "currentColor" : "none"}
                          className={i < Math.floor(ratingInfo.rating) ? "" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {ratingInfo.rating}
                    </span>
                  </div>
                  
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4 flex-grow`}>
                    {product.description}
                  </p>
                  
                  <div className="mt-auto">
                    <div className="flex justify-between items-baseline mb-2">
                      <div className={isDark ? 'text-white font-semibold' : 'text-aiaGray font-semibold'}>
                        <div className="text-lg">{formatPrice(Number(product.price))}</div>
                        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          ou {formatPrice(Number(product.price) / 12)}/mês
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        className={`flex-1 ${
                          productInCart 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : isDark 
                              ? 'bg-blue-600 hover:bg-blue-700'
                              : 'aia-button-primary'
                        } text-sm`}
                        onClick={() => addToCart(product)}
                        disabled={productInCart}
                      >
                        {productInCart ? (
                          <>
                            <Check className="mr-1 h-4 w-4" /> No Carrinho
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="mr-1 h-4 w-4" /> Comprar
                          </>
                        )}
                      </Button>
                      <Link to={`/softwares/${product.id}`} className="flex-1">
                        <Button 
                          variant="outline" 
                          className={`w-full text-sm ${
                            isDark ? 'border-gray-700 text-gray-200 hover:bg-gray-700' : ''
                          }`}
                        >
                          Detalhes
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSoftware;
