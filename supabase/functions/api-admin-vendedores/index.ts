
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createHash } from "https://deno.land/std@0.177.0/crypto/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { v4 as uuidv4 } from "https://deno.land/std@0.177.0/uuid/mod.ts";
import { decode } from "https://deno.land/std@0.177.0/encoding/base64.ts";
import jwt_decode from "npm:jwt-decode@3.1.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const supabase = createClient(supabaseUrl, supabaseKey);

function hashPassword(password: string) {
  return createHash("sha256").update(password).toString();
}

function isAdminFromJwt(token: string) {
  try {
    const jwt: any = jwt_decode(token);
    return jwt.tipoUsuario === "admin";
  } catch {
    return false;
  }
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Não autorizado." }), { status: 401, headers: corsHeaders });
    }
    const token = authHeader.replace("Bearer ", "");
    // Basic JWT decoding (since we're not using a public key here)
    if (!isAdminFromJwt(token)) {
      return new Response(JSON.stringify({ error: "Apenas administradores podem cadastrar vendedores." }),
        { status: 403, headers: corsHeaders });
    }

    const body = await req.json();
    const { nome_loja, cnpj, email, senha, nome_responsavel } = body;

    if (!nome_loja || !cnpj || !email || !senha || !nome_responsavel) {
      return new Response(JSON.stringify({ error: "Campos obrigatórios faltando." }), { status: 400, headers: corsHeaders });
    }

    // Check if email exists
    const { data: userExists } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (userExists) {
      return new Response(JSON.stringify({ error: "E-mail já cadastrado." }), { status: 409, headers: corsHeaders });
    }

    const user_id = uuidv4.generate();
    const now = new Date().toISOString();
    const password_hash = hashPassword(senha);

    // Insert user (user_type = vendedor)
    const { error: userErr } = await supabase
      .from("users")
      .insert({
        id: user_id,
        name: nome_responsavel,
        email,
        password_hash,
        is_verified: true,
        user_type: "vendedor",
        created_at: now,
        updated_at: now,
      });

    if (userErr) {
      return new Response(JSON.stringify({ error: "Erro ao criar vendedor." }), { status: 500, headers: corsHeaders });
    }

    // Insert vendedor_profiles
    const { error: perfilErr } = await supabase
      .from("vendedor_profiles")
      .insert({
        id: user_id,
        store_name: nome_loja,
        cnpj,
        responsible_name: nome_responsavel,
        created_at: now,
        updated_at: now,
      });

    if (perfilErr) {
      return new Response(JSON.stringify({ error: "Erro ao criar perfil de vendedor." }), { status: 500, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Erro interno." }), { status: 500, headers: corsHeaders });
  }
});
