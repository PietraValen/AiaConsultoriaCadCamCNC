
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ACCESS_TOKEN = Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN") || "TEST-5440601380456928-042015-2b463ac15269cc08176af3e7314bac63-293628420";
const PUBLIC_KEY = Deno.env.get("MERCADO_PAGO_PUBLIC_KEY") || "TEST-a0a6f0cd-b8d0-4dce-a59f-98e462f03038";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { action, data } = await req.json();
    
    if (action === "create_preference") {
      const { items, customer, paymentMethods } = data;
      
      const preferenceData = {
        items: items.map((item: any) => ({
          id: item.id,
          title: item.name,
          description: item.description || `Licença para ${item.name}`,
          quantity: item.quantity,
          unit_price: Number(item.price),
          currency_id: "BRL"
        })),
        payer: {
          email: customer.email,
          name: customer.fullName,
          identification: {
            type: "CPF",
            number: customer.documentNumber || "00000000000"
          }
        },
        back_urls: {
          success: `${req.headers.get("origin")}/profile/orders`,
          failure: `${req.headers.get("origin")}/checkout`,
          pending: `${req.headers.get("origin")}/profile/orders`,
        },
        auto_return: "approved",
        notification_url: `${req.headers.get("origin")}/api/mercado-pago-webhook`,
        statement_descriptor: "AIA Software",
        payment_methods: {
          excluded_payment_types: paymentMethods.excludedTypes || [],
          installments: paymentMethods.installments || 12
        },
        external_reference: data.orderId || crypto.randomUUID()
      };
      
      const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        },
        body: JSON.stringify(preferenceData)
      });
      
      const preference = await response.json();
      
      return new Response(JSON.stringify(preference), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    } else if (action === "create_payment") {
      const { paymentMethod, orderId, transaction_amount, installments, token, payer } = data;
      
      // Process payment based on method (credit card, debit, pix)
      if (paymentMethod === "credit_card") {
        const paymentData = {
          transaction_amount,
          token,
          description: "Compra de Software AIA",
          installments: Number(installments) || 1,
          payment_method_id: data.payment_method_id,
          payer: {
            email: payer.email,
            identification: {
              type: "CPF",
              number: payer.document.number
            }
          },
          external_reference: orderId
        };
        
        const response = await fetch("https://api.mercadopago.com/v1/payments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${ACCESS_TOKEN}`
          },
          body: JSON.stringify(paymentData)
        });
        
        const payment = await response.json();
        return new Response(JSON.stringify(payment), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } else if (paymentMethod === "pix") {
        // Create a PIX payment
        const pixPaymentData = {
          transaction_amount,
          description: "Compra de Software AIA",
          payment_method_id: "pix",
          payer: {
            email: payer.email,
            identification: {
              type: "CPF",
              number: payer.document.number
            }
          },
          external_reference: orderId
        };
        
        const response = await fetch("https://api.mercadopago.com/v1/payments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${ACCESS_TOKEN}`
          },
          body: JSON.stringify(pixPaymentData)
        });
        
        const payment = await response.json();
        return new Response(JSON.stringify(payment), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    } else if (action === "get_payment_methods") {
      const response = await fetch("https://api.mercadopago.com/v1/payment_methods", {
        headers: {
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      });
      
      const paymentMethods = await response.json();
      return new Response(JSON.stringify(paymentMethods), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    } else if (action === "get_payment_status") {
      const { paymentId } = data;
      
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        }
      });
      
      const paymentStatus = await response.json();
      return new Response(JSON.stringify(paymentStatus), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
