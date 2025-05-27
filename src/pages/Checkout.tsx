
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import PaymentMethods from "@/components/checkout/PaymentMethods";
import { Steps, Step } from "@/components/ui/steps";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface BillingInfo {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  documentNumber?: string;
}

interface PaymentInfo {
  status: string;
  orderId: string;
  paymentId: string;
}

export default function Checkout() {
  const { cartItems, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const cartTotal = getCartTotal();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
    if (cartItems.length === 0 && !paymentComplete) {
      navigate("/cart");
    }
  }, [user, cartItems, navigate, paymentComplete]);

  const handleFormSubmit = (data: BillingInfo) => {
    // Add user ID to billing information
    setBillingInfo({
      ...data,
      userId: user?.id as string
    });
    setCurrentStep(2);
  };

  const handlePaymentComplete = (info: PaymentInfo) => {
    setPaymentInfo(info);
    setPaymentComplete(true);
    
    if (info.status === "approved") {
      toast.success("Pagamento aprovado! Você receberá acesso aos produtos em instantes.");
    } else if (info.status === "pending") {
      toast.info("Pagamento pendente! Assim que confirmado, você receberá acesso aos produtos.");
    } else {
      toast.warning("Seu pagamento está sendo processado. Acompanhe o status nos seus pedidos.");
    }
  };

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto py-12">
        <h1 className="text-2xl font-bold mb-8">Finalizar Compra</h1>
        
        {paymentComplete ? (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
              <h2 className="text-2xl font-semibold">Pedido Realizado com Sucesso!</h2>
              <p className="text-gray-600 max-w-lg mx-auto">
                Seu pedido #{paymentInfo?.orderId.substring(0, 8)} foi registrado. 
                {paymentInfo?.status === "approved" 
                  ? " O pagamento foi confirmado e você já pode acessar seus produtos." 
                  : " Assim que o pagamento for confirmado, você receberá acesso aos produtos."}
              </p>
              <div className="flex space-x-4 mt-6">
                <Button onClick={() => navigate("/profile/orders")}>
                  Meus Pedidos
                </Button>
                <Button variant="outline" onClick={() => navigate("/softwares")}>
                  Continuar Comprando
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <>
            <Steps currentStep={currentStep} className="mb-8">
              <Step title="Informações" description="Seus dados" />
              <Step title="Pagamento" description="Escolha como pagar" />
            </Steps>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {currentStep === 1 && (
                  <CheckoutForm onSubmit={handleFormSubmit} />
                )}
                
                {currentStep === 2 && billingInfo && (
                  <PaymentMethods 
                    billingAddress={billingInfo} 
                    onPaymentComplete={handlePaymentComplete}
                  />
                )}
              </div>
              <div>
                <OrderSummary />
                
                {currentStep === 2 && (
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => setCurrentStep(1)}
                  >
                    Voltar para Informações
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
