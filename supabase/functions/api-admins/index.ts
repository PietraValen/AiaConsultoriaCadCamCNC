
// Follow Deno's module system
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { v4 } from "https://deno.land/std@0.177.0/uuid/mod.ts";
import * as crypto from "https://deno.land/std@0.177.0/crypto/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const adminToken = Deno.env.get("ADMIN_SIGNUP_TOKEN"); // importante: adicione este segredo como uma env var

const supabase = createClient(supabaseUrl, supabaseKey);

function hashPassword(password: string) {
  // Use TextEncoder to convert the string to Uint8Array
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  
  // Use SHA-256 algorithm
  const hashBuffer = crypto.subtle.digestSync("SHA-256", data);
  
  // Convert the hash to a hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    console.log("Auth header recebido:", authHeader);
    console.log("Admin token configurado:", adminToken ? 'Token está definido' : 'Token NÃO está definido');
    
    // Remova espaços em branco extras e faça uma comparação estrita de strings
    const cleanAuthHeader = authHeader?.trim();
    const cleanAdminToken = `Bearer ${adminToken?.trim()}`;
    
    console.log("Auth header limpo:", cleanAuthHeader);
    console.log("Token admin esperado:", `Bearer ${adminToken ? '[VALOR MASCARADO]' : 'INDEFINIDO'}`);
    
    if (!cleanAuthHeader || cleanAuthHeader !== cleanAdminToken) {
      console.log("Autenticação falhou. Header recebido não corresponde ao token esperado.");
      return new Response(JSON.stringify({ error: "Não autorizado." }), { status: 401, headers: corsHeaders });
    }

    const body = await req.json();
    const { nome, email, senha } = body;
    console.log("Corpo da requisição:", { nome, email, senha: "***" });
    
    if (!nome || !email || !senha) {
      return new Response(JSON.stringify({ error: "Campos obrigatórios faltando." }), { status: 400, headers: corsHeaders });
    }

    // Check if email already exists
    const { data: userExists } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();
      
    if (userExists) {
      return new Response(JSON.stringify({ error: "E-mail já cadastrado." }), { status: 409, headers: corsHeaders });
    }

    // Fixed UUID generation - directly using v4() instead of v4.generate()
    const user_id = v4.generate();
    const now = new Date().toISOString();
    const password_hash = hashPassword(senha);

    // Insert user (user_type = admin)
    const { error: userErr } = await supabase
      .from("users")
      .insert({
        id: user_id,
        name: nome,
        email,
        password_hash,
        is_verified: true,
        user_type: "admin",
        created_at: now,
        updated_at: now,
      });

    if (userErr) {
      console.error("Erro ao inserir usuário:", userErr);
      return new Response(JSON.stringify({ error: "Erro ao criar administrador." }), { status: 500, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ success: true, id: user_id }), { headers: corsHeaders });
  } catch (err) {
    console.error("Erro interno:", err);
    return new Response(JSON.stringify({ error: "Erro interno." }), { status: 500, headers: corsHeaders });
  }
});
