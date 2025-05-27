
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function OrderSummary() {
  const { cartItems, getCartTotal } = useCart();
  const subtotal = getCartTotal();
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>
      
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.product.id} className="flex justify-between text-sm">
            <span>{item.product.name} (x{item.quantity})</span>
            <span>{formatPrice(Number(item.product.price) * item.quantity)}</span>
          </div>
        ))}
        
        <Separator />
        
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Frete</span>
          <span>{shipping === 0 ? "Grátis" : formatPrice(shipping)}</span>
        </div>
        
        <Separator />
        
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </Card>
  );
}
