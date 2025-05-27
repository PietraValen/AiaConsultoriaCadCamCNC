
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Key } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils";

interface License {
  id: string;
  product_id: string;
  user_id: string;
  license_key: string;
  is_active: boolean;
  product: {
    id: string;
    name: string;
    description: string;
    image_url: string | null;
  };
}

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    description: string;
    image_url: string | null;
  };
}

interface Order {
  id: string;
  user_id: string;
  created_at: string;
  total: number;
  payment_status: string;
  invoice_url: string | null;
  order_items: OrderItem[];
}

export default function OrderSuccess() {
  const [order, setOrder] = useState<Order | null>(null);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const urlParams = new URLSearchParams(location.search);
  const orderId = urlParams.get("order_id");
  
  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    if (!orderId) {
      navigate("/profile/orders");
      return;
    }
    
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        
        // Fetch order details
        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .select(`
            *,
            order_items (
              *,
              product:products (*)
            )
          `)
          .eq("id", orderId)
          .eq("user_id", user.id)
          .single();
          
        if (orderError) throw orderError;
        setOrder(orderData);
        
        // Fetch license keys
        const { data: licenseData, error: licenseError } = await supabase
          .from("licenses")
          .select(`
            *,
            product:products (*)
          `)
          .eq("product_id", orderData.order_items[0].product_id)
          .eq("user_id", user.id);
          
        if (licenseError) throw licenseError;
        setLicenses(licenseData || []);
        
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId, user, navigate]);
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container max-w-4xl mx-auto py-12 text-center">
          <div>Carregando detalhes do pedido...</div>
        </div>
      </Layout>
    );
  }
  
  if (!order) {
    return (
      <Layout>
        <div className="container max-w-4xl mx-auto py-12 text-center">
          <div>Pedido não encontrado ou você não tem permissão para acessá-lo.</div>
          <Button onClick={() => navigate("/profile/orders")} className="mt-4">
            Ver Meus Pedidos
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container max-w-4xl mx-auto py-12">
        <div className="text-center mb-10">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Obrigado pela sua compra!</h1>
          <p className="text-gray-600 mt-2">
            Seu pedido #{order.id.substring(0, 8)} foi {order.payment_status === "approved" ? "aprovado" : "recebido"}.
          </p>
        </div>
        
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status do Pagamento</h3>
                  <p className="font-medium">
                    {order.payment_status === "approved" ? (
                      <span className="text-green-600">Aprovado</span>
                    ) : order.payment_status === "pending" ? (
                      <span className="text-yellow-600">Pendente</span>
                    ) : (
                      <span className="text-gray-600">{order.payment_status}</span>
                    )}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Data do Pedido</h3>
                  <p className="font-medium">
                    {new Date(order.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Método de Pagamento</h3>
                  <p className="font-medium">
                    {order.invoice_url?.includes("credit") ? "Cartão de Crédito" :
                     order.invoice_url?.includes("debit") ? "Cartão de Débito" :
                     order.invoice_url?.includes("pix") ? "PIX" : "Outro método"}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Total</h3>
                  <p className="font-medium">{formatPrice(order.total)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <h2 className="text-xl font-semibold mb-4">Seus Produtos</h2>
        
        <div className="space-y-4">
          {order.order_items.map((item: any) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    <img 
                      src={item.product.image_url || "https://via.placeholder.com/80"} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="font-semibold">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">{item.product.description}</p>
                    
                    <div className="mt-4">
                      {licenses.find(license => license.product_id === item.product_id) ? (
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Key className="w-4 h-4 mr-2 text-green-600" />
                            <span className="font-mono text-sm bg-gray-100 p-1 rounded">
                              {licenses.find(license => license.product_id === item.product_id)?.license_key}
                            </span>
                          </div>
                          
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            <span>Download Software</span>
                          </Button>
                        </div>
                      ) : (
                        <div className="text-yellow-600 text-sm italic">
                          Aguardando confirmação do pagamento para liberar acesso
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    <div className="font-medium">{formatPrice(item.price)}</div>
                    <div className="text-sm text-gray-600">Qtd: {item.quantity}</div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="mt-8 flex justify-center gap-4">
          <Button onClick={() => navigate("/profile/orders")}>
            Meus Pedidos
          </Button>
          <Button variant="outline" onClick={() => navigate("/softwares")}>
            Continuar Comprando
          </Button>
        </div>
      </div>
    </Layout>
  );
}
