
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import Layout from "@/components/layout/Layout";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const [couponCode, setCouponCode] = useState("");
  
  const cartTotal = getCartTotal();
  const shippingCost = 0; // Fixed shipping cost or calculated based on items
  const orderTotal = cartTotal + shippingCost;

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    
    // Here you would validate the coupon with your backend
    // For now we'll just show a message
    alert(`Código promocional "${couponCode}" aplicado!`);
  };

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="container max-w-5xl mx-auto py-12">
          <h1 className="text-2xl font-bold mb-8">Seu Carrinho</h1>
          
          <div className="bg-white rounded-lg shadow-md p-10 text-center">
            <div className="mb-6">
              <ShoppingCart className="mx-auto h-16 w-16 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold mb-4">Seu carrinho está vazio</h2>
            <p className="text-gray-600 mb-6">Veja nossos produtos e adicione-os ao seu carrinho</p>
            <Link to="/softwares">
              <Button>Explorar Produtos</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto py-12">
        <div className="flex items-center mb-8">
          <Link to="/softwares" className="flex items-center text-blue-600 hover:underline mr-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Continuar Comprando
          </Link>
          <h1 className="text-2xl font-bold flex-grow">Seu Carrinho</h1>
          <Button 
            variant="ghost" 
            className="text-red-500 hover:text-red-700 hover:bg-red-50" 
            onClick={clearCart}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Limpar Carrinho
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="hidden md:grid md:grid-cols-5 text-sm font-medium text-gray-500 mb-4">
                  <div className="md:col-span-2">Produto</div>
                  <div className="text-center">Preço</div>
                  <div className="text-center">Quantidade</div>
                  <div className="text-center">Total</div>
                </div>
                
                <Separator className="mb-4" />
                
                {cartItems.map((item) => (
                  <div key={item.product.id} className="mb-6">
                    <div className="md:grid md:grid-cols-5 md:gap-4 items-center">
                      <div className="md:col-span-2 flex items-center mb-4 md:mb-0">
                        <div className="w-20 h-20 min-w-[80px] mr-4 rounded overflow-hidden">
                          <img 
                            src={item.product.image_url || "https://via.placeholder.com/150"} 
                            alt={item.product.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">{item.product.name}</h3>
                          <p className="text-sm text-gray-500">{item.product.category}</p>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700 p-0 h-auto mt-1"
                            onClick={() => removeFromCart(item.product.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            <span className="text-xs">Remover</span>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-center mb-4 md:mb-0">
                        <span className="md:hidden font-medium mr-2">Preço:</span>
                        <span>{formatPrice(Number(item.product.price))}</span>
                      </div>
                      
                      <div className="flex justify-center mb-4 md:mb-0">
                        <div className="flex items-center">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-10 text-center">{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <span className="md:hidden font-medium mr-2">Total:</span>
                        <span className="font-medium">
                          {formatPrice(Number(item.product.price) * item.quantity)}
                        </span>
                      </div>
                    </div>
                    <Separator className="mt-4" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-lg font-bold mb-4">Resumo do Pedido</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Entrega</span>
                  <span>{shippingCost > 0 ? formatPrice(shippingCost) : 'Grátis'}</span>
                </div>
                
                <div className="flex items-end gap-2">
                  <div className="flex-grow">
                    <Input 
                      placeholder="Código promocional" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" onClick={handleApplyCoupon}>Aplicar</Button>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatPrice(orderTotal)}</span>
                </div>
              </div>
              
              <Button className="w-full mt-6">
                Finalizar Compra
              </Button>
              
              <div className="mt-4 text-sm text-center text-gray-500">
                Opções de pagamento: Cartão de crédito, Pix, Boleto
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
