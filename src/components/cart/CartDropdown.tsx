
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export function CartDropdown() {
  const { cartItems, getCartTotal, getCartCount, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  
  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0"
            >
              {cartCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Seu Carrinho</span>
            <span className="text-sm text-muted-foreground">
              {cartCount} {cartCount === 1 ? 'item' : 'itens'}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {cartItems.length === 0 ? (
          <div className="py-4 text-center text-muted-foreground">
            Seu carrinho está vazio
          </div>
        ) : (
          <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
            {cartItems.map((item) => (
              <DropdownMenuItem key={item.product.id} className="flex flex-col p-3" asChild>
                <div>
                  <div className="flex w-full mb-2">
                    <div className="w-12 h-12 mr-3 overflow-hidden">
                      <img 
                        src={item.product.image_url || "https://via.placeholder.com/150"} 
                        alt={item.product.name} 
                        className="h-full w-full object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium leading-none mb-1 truncate w-[180px]">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">{formatPrice(Number(item.product.price))}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromCart(item.product.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(item.product.id, item.quantity - 1);
                        }}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(item.product.id, item.quantity + 1);
                        }}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <span className="text-sm font-medium">
                      {formatPrice(Number(item.product.price) * item.quantity)}
                    </span>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        )}
        
        {cartItems.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-4">
              <div className="flex justify-between mb-4">
                <span className="font-medium">Total:</span>
                <span className="font-bold">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex flex-col space-y-2">
                <Button 
                  className="w-full" 
                  onClick={() => {
                    navigate('/checkout');
                  }}
                >
                  Finalizar Compra
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    navigate('/cart');
                  }}
                >
                  Ver Carrinho
                </Button>
              </div>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
