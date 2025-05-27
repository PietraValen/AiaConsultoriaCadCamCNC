
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// Add proper type for Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const body = await req.json();
    const { email, codigo } = body;

    if (!email || !codigo) {
      return new Response(JSON.stringify({ error: "Campos obrigatórios faltando." }), { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    // Find the user by email
    const { data: user, error: userErr } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (!user || userErr) {
      console.error("Error finding user:", userErr);
      return new Response(JSON.stringify({ error: "Usuário não encontrado." }), { 
        status: 404, 
        headers: corsHeaders 
      });
    }
    
    const user_id = user.id;

    // Get verification code for user
    const { data: codeData, error: codeErr } = await supabase
      .from("verification_codes")
      .select("code, expires_at")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!codeData || codeErr) {
      console.error("Error finding verification code:", codeErr);
      return new Response(JSON.stringify({ error: "Código não encontrado." }), { 
        status: 404, 
        headers: corsHeaders 
      });
    }

    const expired = new Date() > new Date(codeData.expires_at);

    if (codeData.code !== codigo || expired) {
      return new Response(JSON.stringify({ error: "Código inválido ou expirado." }), { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    // Set is_verified = true on user
    const { error: updateErr } = await supabase
      .from("users")
      .update({ is_verified: true, updated_at: new Date().toISOString() })
      .eq("id", user_id);

    if (updateErr) {
      console.error("Error updating user verification:", updateErr);
      return new Response(JSON.stringify({ error: "Falha ao ativar conta." }), { 
        status: 500, 
        headers: corsHeaders 
      });
    }

    return new Response(JSON.stringify({ success: true }), { 
      headers: corsHeaders 
    });
  } catch (err) {
    console.error("Error in email verification:", err);
    return new Response(JSON.stringify({ error: "Erro interno." }), { 
      status: 500, 
      headers: corsHeaders 
    });
  }
});
