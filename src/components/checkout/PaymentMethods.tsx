
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/context/CartContext";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, QrCode, Wallet } from "lucide-react";

const formSchema = z.object({
  cardNumber: z.string().min(16).max(19).optional(),
  cardholderName: z.string().min(3).optional(),
  expirationDate: z.string().min(5).max(7).optional(),
  securityCode: z.string().min(3).max(4).optional(),
  installments: z.string().optional(),
  documentType: z.string().optional(),
  documentNumber: z.string().min(11).max(14).optional(),
});

interface PaymentMethodsProps {
  billingAddress: any;
  onPaymentComplete: (paymentInfo: any) => void;
}

export default function PaymentMethods({ billingAddress, onPaymentComplete }: PaymentMethodsProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("credit_card");
  const [installmentOptions, setInstallmentOptions] = useState<number[]>([1, 2, 3, 6, 12]);
  const [pixQrCode, setPixQrCode] = useState("");
  const [pixCode, setPixCode] = useState("");
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardNumber: "",
      cardholderName: "",
      expirationDate: "",
      securityCode: "",
      installments: "1",
      documentType: "CPF",
      documentNumber: "",
    },
  });

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("mercado-pago", {
          body: {
            action: "get_payment_methods",
            data: {}
          }
        });

        if (error) throw error;
        setPaymentMethods(data);
      } catch (error) {
        console.error("Error fetching payment methods:", error);
        toast.error("Não foi possível carregar os métodos de pagamento");
      }
    };

    fetchPaymentMethods();
  }, []);

  const handleCreditCardPayment = async (values: z.infer<typeof formSchema>) => {
    setIsProcessing(true);
    try {
      // In a real implementation, you would use Mercado Pago's SDK to tokenize the card
      // For now, we'll simulate this with a direct API call
      
      const orderId = crypto.randomUUID();
      
      // Create order in database first
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          total: getCartTotal(),
          billing_address: billingAddress,
          shipping_address: billingAddress,
          user_id: billingAddress.userId,
          payment_status: 'pending',
          external_id: orderId
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;
      
      // Create payment with Mercado Pago
      const paymentData = {
        action: "create_payment",
        data: {
          paymentMethod: selectedPaymentMethod,
          orderId: order.id,
          transaction_amount: getCartTotal(),
          installments: values.installments,
          token: "SIMULATED_TOKEN_" + Date.now(), // In real implementation, this would come from MP SDK
          payment_method_id: "visa",
          payer: {
            email: billingAddress.email,
            document: {
              type: values.documentType,
              number: values.documentNumber
            }
          }
        }
      };
      
      const { data: payment, error } = await supabase.functions.invoke("mercado-pago", {
        body: paymentData
      });

      if (error) throw error;
      
      // For testing purposes, we'll simulate different payment statuses
      // In a real scenario, you would check the actual status from Mercado Pago
      const statusMap: Record<string, string> = {
        "APRO": "approved",
        "OTHE": "rejected",
        "CONT": "pending",
        "CALL": "pending_review",
        "FUND": "rejected",
        "SECU": "rejected",
        "EXPI": "rejected",
        "FORM": "rejected"
      };
      
      // Simulate status for testing - in a real app, use the actual status
      const simulatedStatus = "APRO"; // Change this to test different statuses
      
      // Update order status
      await supabase
        .from('orders')
        .update({ 
          payment_status: statusMap[simulatedStatus] || "pending",
          invoice_url: payment.id || "sim_" + Date.now()
        })
        .eq('id', order.id);
      
      // Set license key for each product in the order
      for (const item of orderItems) {
        const licenseKey = `LICENSE-${item.product_id}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        
        await supabase
          .from('licenses')
          .insert({
            product_id: item.product_id,
            user_id: billingAddress.userId,
            license_key: licenseKey,
            is_active: statusMap[simulatedStatus] === "approved",
            expiry_date: null
          });
      }
      
      clearCart();
      onPaymentComplete({
        status: statusMap[simulatedStatus],
        orderId: order.id,
        paymentId: payment.id || "sim_" + Date.now()
      });
      
    } catch (error) {
      console.error("Error processing credit card payment:", error);
      toast.error("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePixPayment = async () => {
    setIsProcessing(true);
    try {
      const orderId = crypto.randomUUID();
      
      // Create order in database first
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          total: getCartTotal(),
          billing_address: billingAddress,
          shipping_address: billingAddress,
          user_id: billingAddress.userId,
          payment_status: 'pending',
          external_id: orderId
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;
      
      // Create payment with Mercado Pago
      const paymentData = {
        action: "create_payment",
        data: {
          paymentMethod: "pix",
          orderId: order.id,
          transaction_amount: getCartTotal(),
          payer: {
            email: billingAddress.email,
            document: {
              type: "CPF",
              number: billingAddress.documentNumber || "00000000000"
            }
          }
        }
      };
      
      const { data: payment, error } = await supabase.functions.invoke("mercado-pago", {
        body: paymentData
      });

      if (error) throw error;
      
      // In a real implementation, you would extract the QR code and code from the Mercado Pago response
      // For now, we're simulating it
      setPixQrCode("https://via.placeholder.com/200x200.png?text=QR+Code+Simulado");
      setPixCode("90982379827398217398217398217398217398217398217");
      
      // Update order with payment ID
      await supabase
        .from('orders')
        .update({ 
          invoice_url: payment.id || "pix_" + Date.now(),
          payment_status: "pending"
        })
        .eq('id', order.id);
      
    } catch (error) {
      console.error("Error generating PIX:", error);
      toast.error("Erro ao gerar PIX. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDebitPayment = async (values: z.infer<typeof formSchema>) => {
    // Similar to credit card, but without installments
    setIsProcessing(true);
    try {
      const orderId = crypto.randomUUID();
      
      // Create order in database first
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          total: getCartTotal(),
          billing_address: billingAddress,
          shipping_address: billingAddress,
          user_id: billingAddress.userId,
          payment_status: 'pending',
          external_id: orderId
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;
      
      // Create payment with Mercado Pago - similar to credit card but without installments
      const paymentData = {
        action: "create_payment",
        data: {
          paymentMethod: "debit_card",
          orderId: order.id,
          transaction_amount: getCartTotal(),
          token: "SIMULATED_DEBIT_TOKEN_" + Date.now(),
          payment_method_id: "maestro",
          payer: {
            email: billingAddress.email,
            document: {
              type: values.documentType,
              number: values.documentNumber
            }
          }
        }
      };
      
      const { data: payment, error } = await supabase.functions.invoke("mercado-pago", {
        body: paymentData
      });

      if (error) throw error;
      
      // Simulate status for testing - in a real app, use the actual status
      const simulatedStatus = "APRO"; // Change this to test different statuses
      const statusMap: Record<string, string> = {
        "APRO": "approved",
        "OTHE": "rejected",
        "CONT": "pending",
        "CALL": "pending_review",
        "FUND": "rejected",
        "SECU": "rejected",
        "EXPI": "rejected",
        "FORM": "rejected"
      };
      
      // Update order status
      await supabase
        .from('orders')
        .update({ 
          payment_status: statusMap[simulatedStatus] || "pending",
          invoice_url: payment.id || "debit_" + Date.now()
        })
        .eq('id', order.id);
      
      // Set license key for each product in the order
      for (const item of orderItems) {
        const licenseKey = `LICENSE-${item.product_id}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        
        await supabase
          .from('licenses')
          .insert({
            product_id: item.product_id,
            user_id: billingAddress.userId,
            license_key: licenseKey,
            is_active: statusMap[simulatedStatus] === "approved",
            expiry_date: null
          });
      }
      
      clearCart();
      onPaymentComplete({
        status: statusMap[simulatedStatus],
        orderId: order.id,
        paymentId: payment.id || "debit_" + Date.now()
      });
      
    } catch (error) {
      console.error("Error processing debit card payment:", error);
      toast.error("Erro ao processar pagamento com cartão de débito. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    toast.success("Código PIX copiado!");
  };

  return (
    <Tabs defaultValue="credit_card" className="w-full" onValueChange={setSelectedPaymentMethod}>
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="credit_card" className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          <span>Cartão de Crédito</span>
        </TabsTrigger>
        <TabsTrigger value="debit_card" className="flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          <span>Cartão de Débito</span>
        </TabsTrigger>
        <TabsTrigger value="pix" className="flex items-center gap-2">
          <QrCode className="h-4 w-4" />
          <span>PIX</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="credit_card">
        <Card>
          <CardHeader>
            <CardTitle>Pagamento com Cartão de Crédito</CardTitle>
            <CardDescription>Pague de forma segura com seu cartão de crédito</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreditCardPayment)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número do Cartão</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="1234 5678 9012 3456" 
                          {...field} 
                          maxLength={19}
                          onChange={(e) => {
                            // Format card number with spaces every 4 digits
                            const value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
                            const formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
                            field.onChange(formattedValue);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cardholderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome no Cartão</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome como aparece no cartão" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="expirationDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Validade</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="MM/AA" 
                            {...field} 
                            maxLength={5}
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, '');
                              if (value.length > 2) {
                                value = value.substring(0, 2) + '/' + value.substring(2);
                              }
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="securityCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código de Segurança</FormLabel>
                        <FormControl>
                          <Input placeholder="CVV" {...field} maxLength={4} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="installments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parcelas</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o número de parcelas" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {installmentOptions.map(installment => (
                            <SelectItem key={installment} value={String(installment)}>
                              {installment}x de R$ {(getCartTotal() / installment).toFixed(2)}
                              {installment === 1 ? ' (sem juros)' : ' (com juros)'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="documentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Documento</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo de documento" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CPF">CPF</SelectItem>
                            <SelectItem value="CNPJ">CNPJ</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="documentNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número do Documento</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Digite apenas números" 
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isProcessing}>
                  {isProcessing ? "Processando..." : "Pagar com Cartão de Crédito"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="debit_card">
        <Card>
          <CardHeader>
            <CardTitle>Pagamento com Cartão de Débito</CardTitle>
            <CardDescription>Pague direto da sua conta bancária</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleDebitPayment)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número do Cartão</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="1234 5678 9012 3456" 
                          {...field} 
                          maxLength={19}
                          onChange={(e) => {
                            // Format card number with spaces every 4 digits
                            const value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
                            const formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
                            field.onChange(formattedValue);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cardholderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome no Cartão</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome como aparece no cartão" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="expirationDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Validade</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="MM/AA" 
                            {...field} 
                            maxLength={5}
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, '');
                              if (value.length > 2) {
                                value = value.substring(0, 2) + '/' + value.substring(2);
                              }
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="securityCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código de Segurança</FormLabel>
                        <FormControl>
                          <Input placeholder="CVV" {...field} maxLength={4} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="documentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Documento</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo de documento" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CPF">CPF</SelectItem>
                            <SelectItem value="CNPJ">CNPJ</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="documentNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número do Documento</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Digite apenas números" 
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isProcessing}>
                  {isProcessing ? "Processando..." : "Pagar com Cartão de Débito"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="pix">
        <Card>
          <CardHeader>
            <CardTitle>Pagamento com PIX</CardTitle>
            <CardDescription>Pague instantaneamente via PIX</CardDescription>
          </CardHeader>
          <CardContent>
            {!pixQrCode ? (
              <div className="space-y-4">
                <p className="text-center">Clique no botão abaixo para gerar um QR Code PIX para pagamento.</p>
                <Button 
                  onClick={handlePixPayment} 
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Gerando PIX..." : "Gerar PIX"}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <div className="border p-2 bg-white">
                  <img src={pixQrCode} alt="QR Code PIX" className="w-48 h-48" />
                </div>
                <div className="w-full p-3 bg-gray-100 rounded-md">
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm text-center font-medium">Código PIX</p>
                    <p className="text-xs text-center break-all">{pixCode}</p>
                    <Button onClick={copyPixCode} variant="outline" size="sm">
                      Copiar Código
                    </Button>
                  </div>
                </div>
                <div className="text-center text-sm space-y-2">
                  <p>1. Abra o aplicativo do seu banco</p>
                  <p>2. Escolha pagar via PIX com QR Code ou copie e cole o código</p>
                  <p>3. O pagamento será confirmado automaticamente</p>
                  <Button
                    onClick={() => navigate("/profile/orders")}
                    className="mt-4"
                  >
                    Ver Meus Pedidos
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
