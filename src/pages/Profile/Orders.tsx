
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

type Order = {
  id: string;
  created_at: string;
  total: number;
  payment_status: string;
  order_items: {
    product: {
      name: string;
      price: number;
    };
    quantity: number;
  }[];
};

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items:order_items(
              quantity,
              product:products(
                name,
                price
              )
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto py-12">
        <h1 className="text-2xl font-bold mb-8">Meus Pedidos</h1>
        
        {isLoading ? (
          <p>Carregando pedidos...</p>
        ) : orders.length === 0 ? (
          <Card className="p-6 text-center">
            <p>Você ainda não tem pedidos.</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Pedido realizado em {formatDate(order.created_at)}
                    </p>
                    <p className="font-medium">Pedido #{order.id.slice(0, 8)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="font-semibold">{formatPrice(order.total)}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {order.order_items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.product.name} (x{item.quantity})</span>
                      <span>{formatPrice(Number(item.product.price) * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
