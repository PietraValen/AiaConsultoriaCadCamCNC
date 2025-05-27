
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createHash } from "https://deno.land/std@0.177.0/crypto/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { encode } from "https://deno.land/std@0.177.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const jwtSecret = Deno.env.get("JWT_SECRET") || "changemejwt"; // set a real secret in prod

const supabase = createClient(supabaseUrl, supabaseKey);

function hashPassword(password: string) {
  return createHash("sha256").update(password).toString();
}

// dumb JWT generator for demo; replace with library in production
function createJWT({ id, email, tipoUsuario }: { id: string, email: string, tipoUsuario: string }) {
  // header
  const header = { alg: "HS256", typ: "JWT" };
  const payload = { id, email, tipoUsuario, iat: Math.floor(Date.now() / 1000) };
  function base64url(val: string) {
    return encode(new TextEncoder().encode(val)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));
  // NOT a secure signature! Use a real library in production
  const signature = base64url(
    (encodedHeader + "." + encodedPayload + "." + jwtSecret).substring(0, 32)
  );
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { email, senha } = body;

    if (!email || !senha) {
      return new Response(JSON.stringify({ error: "Campos obrigatórios faltando." }), { status: 400, headers: corsHeaders });
    }

    // Find user by email, check is_verified
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, password_hash, user_type, is_verified")
      .eq("email", email)
      .single();

    if (userError || !user) {
      console.error("User error:", userError);
      return new Response(JSON.stringify({ error: "Usuário ou senha incorretos." }), { status: 401, headers: corsHeaders });
    }

    if (!user.is_verified) {
      return new Response(JSON.stringify({ error: "Email não verificado." }), { status: 403, headers: corsHeaders });
    }

    // Hash and compare password
    if (user.password_hash !== hashPassword(senha)) {
      return new Response(JSON.stringify({ error: "Usuário ou senha incorretos." }), { status: 401, headers: corsHeaders });
    }

    // Return JWT
    const tipoUsuario = user.user_type;
    const id = user.id;
    const token = createJWT({ id, email, tipoUsuario });

    return new Response(JSON.stringify({ token, tipoUsuario, id }), { headers: corsHeaders });
  } catch (err) {
    console.error("Error in login:", err);
    return new Response(JSON.stringify({ error: "Erro interno." }), { status: 500, headers: corsHeaders });
  }
});
