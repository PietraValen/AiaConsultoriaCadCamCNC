
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createHash } from "https://deno.land/std@0.177.0/crypto/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { v4 as uuidv4 } from "https://deno.land/std@0.177.0/uuid/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const supabase = createClient(supabaseUrl, supabaseKey);

function hashPassword(password: string) {
  return createHash("sha256").update(password).toString();
}

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { nome, email, senha, telefone, endereco } = body;

    // Validate mandatory fields
    if (!nome || !email || !senha || !telefone || !endereco ||
      !endereco.rua || !endereco.numero || !endereco.bairro || 
      !endereco.cidade || !endereco.estado || !endereco.cep) {
      return new Response(JSON.stringify({ error: "Campos obrigatórios faltando." }), { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    // Check if user/email already exists
    const { data: userExists } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (userExists) {
      return new Response(JSON.stringify({ error: "E-mail já cadastrado." }), { 
        status: 409, 
        headers: corsHeaders 
      });
    }

    // Generate unique user ID
    const user_id = uuidv4.generate();
    const now = new Date().toISOString();
    const password_hash = hashPassword(senha);

    // Insert new user (inactive initially)
    const { error: userErr } = await supabase
      .from('users')
      .insert({
        id: user_id,
        name: nome,
        email,
        password_hash,
        is_verified: false,
        user_type: 'cliente',
        created_at: now,
        updated_at: now,
      });

    if (userErr) {
      console.error("Error inserting user:", userErr);
      return new Response(JSON.stringify({ error: "Erro ao criar usuário." }), { 
        status: 500, 
        headers: corsHeaders 
      });
    }

    // Insert cliente_profiles
    const { error: profileErr } = await supabase
      .from('cliente_profiles')
      .insert({
        id: user_id,
        phone: telefone,
        street: endereco.rua,
        number: endereco.numero,
        neighborhood: endereco.bairro,
        city: endereco.cidade,
        state: endereco.estado,
        zip_code: endereco.cep,
        created_at: now,
        updated_at: now,
      });

    if (profileErr) {
      console.error("Error inserting profile:", profileErr);
      return new Response(JSON.stringify({ error: "Erro ao criar perfil." }), { 
        status: 500, 
        headers: corsHeaders 
      });
    }

    // Generate verification code (valid 10 min)
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error: codeErr } = await supabase
      .from("verification_codes")
      .insert({
        code: verificationCode,
        user_id: user_id,
        expires_at: expiresAt,
        created_at: now,
      });

    if (codeErr) {
      console.error("Error inserting verification code:", codeErr);
      return new Response(JSON.stringify({ error: "Erro ao gerar código de verificação." }), { 
        status: 500, 
        headers: corsHeaders 
      });
    }

    // Send verification email using Resend
    try {
      await resend.emails.send({
        from: "Cadcamsoft <onboarding@resend.dev>",
        to: email,
        subject: "Verifique seu email",
        html: `
          <h1>Código de Verificação</h1>
          <p>Seu código de verificação é: <strong>${verificationCode}</strong></p>
          <p>Este código é válido por 10 minutos.</p>
          <p>Se você não solicitou este cadastro, ignore este email.</p>
        `,
      });
    } catch (emailErr) {
      console.error("Error sending email:", emailErr);
      // We continue even if email fails, just log it
    }

    return new Response(JSON.stringify({ 
      success: true, 
      user_id, 
      message: "Usuário criado. Verifique seu email para ativar a conta." 
    }), { 
      headers: corsHeaders 
    });

  } catch (err) {
    console.error("Erro no cadastro:", err);
    return new Response(JSON.stringify({ error: "Erro interno." }), { 
      status: 500, 
      headers: corsHeaders 
    });
  }
});
