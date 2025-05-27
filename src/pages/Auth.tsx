
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Layout from '@/components/layout/Layout';
import { KeyRound, UserRound, MailCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Esquema de validação para cadastro de cliente
const clientSignUpSchema = z.object({
  nome: z.string().min(2, { message: 'Nome é obrigatório' }),
  email: z.string().email({ message: 'Email inválido' }),
  senha: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
  telefone: z.string().min(10, { message: 'Telefone inválido' }),
  endereco: z.object({
    rua: z.string().min(1, { message: 'Rua é obrigatória' }),
    numero: z.string().min(1, { message: 'Número é obrigatório' }),
    bairro: z.string().min(1, { message: 'Bairro é obrigatório' }),
    cidade: z.string().min(1, { message: 'Cidade é obrigatória' }),
    estado: z.string().min(2, { message: 'Estado é obrigatório' }),
    cep: z.string().min(8, { message: 'CEP inválido' }),
  }),
});

const loginSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  senha: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
});

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isVerificationMode, setIsVerificationMode] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      senha: '',
    },
  });

  const signUpForm = useForm({
    resolver: zodResolver(clientSignUpSchema),
    defaultValues: {
      nome: '',
      email: '',
      senha: '',
      telefone: '',
      endereco: {
        rua: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: '',
      },
    },
  });

  const verificationForm = useForm({
    defaultValues: {
      verificationCode: '',
    },
  });

  async function handleLogin(data: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    try {
      // Call the API endpoint for login
      const response = await fetch(`${window.location.origin}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          senha: data.senha,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro no login');
      }

      // Store the token in localStorage
      localStorage.setItem('auth_token', result.token);
      localStorage.setItem('user_id', result.id);
      localStorage.setItem('user_type', result.tipoUsuario);

      // Make supabase login
      await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.senha,
      });
      
      toast.success('Login realizado com sucesso!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Erro no login');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSignUp(data: z.infer<typeof clientSignUpSchema>) {
    setIsLoading(true);
    try {
      // Chamada para o edge function de cadastro de cliente
      const response = await fetch(`${window.location.origin}/api/clientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erro no cadastro');
      }

      // Entrar no modo de verificação
      setUserEmail(data.email);
      setUserId(result.user_id);
      setIsVerificationMode(true);
      toast.success('Cadastro iniciado. Verifique seu email!');
    } catch (error: any) {
      toast.error(error.message || 'Erro no cadastro');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerification(data: { verificationCode: string }) {
    setIsLoading(true);
    try {
      // Chamada para verificar o código
      const response = await fetch(`${window.location.origin}/api/verificar-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: userEmail, 
          codigo: data.verificationCode 
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erro na verificação');
      }

      toast.success('Email verificado com sucesso!');
      setIsVerificationMode(false);
      setIsSignUp(false);
    } catch (error: any) {
      toast.error(error.message || 'Erro na verificação');
    } finally {
      setIsLoading(false);
    }
  }

  // Renderização condicional baseada no estado atual
  const renderContent = () => {
    if (isVerificationMode) {
      return (
        <Form {...verificationForm}>
          <form onSubmit={verificationForm.handleSubmit(handleVerification)} className="space-y-4">
            <div className="flex justify-center mb-4">
              <MailCheck className="h-12 w-12 text-primary" />
            </div>
            <CardTitle>Verificação de Email</CardTitle>
            <CardDescription>
              Digite o código de 6 dígitos enviado para {userEmail}
            </CardDescription>
            
            <FormField
              control={verificationForm.control}
              name="verificationCode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      placeholder="Código de verificação" 
                      maxLength={6}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Verificando...' : 'Verificar Código'}
            </Button>
          </form>
        </Form>
      );
    }

    if (isSignUp) {
      return (
        <Form {...signUpForm}>
          <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
            <FormField
              control={signUpForm.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signUpForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="seu.email@exemplo.com.br" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signUpForm.control}
              name="senha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input placeholder="******" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signUpForm.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="(00) 00000-0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border p-4 rounded-md space-y-4">
              <h3 className="text-sm font-medium">Endereço</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={signUpForm.control}
                  name="endereco.rua"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rua</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da rua" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={signUpForm.control}
                  name="endereco.numero"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input placeholder="Número" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={signUpForm.control}
                  name="endereco.bairro"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input placeholder="Bairro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={signUpForm.control}
                  name="endereco.cidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={signUpForm.control}
                  name="endereco.estado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="Estado" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={signUpForm.control}
                  name="endereco.cep"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input placeholder="00000-000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Cadastrando...' : 'Criar Conta'}
            </Button>
          </form>
        </Form>
      );
    }

    return (
      <Form {...loginForm}>
        <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
          <FormField
            control={loginForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <UserRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="seu.email@exemplo.com.br" 
                      className="pl-9"
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={loginForm.control}
            name="senha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="password" 
                      placeholder="******" 
                      className="pl-9"
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </Form>
    );
  };

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[80vh] px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>
              {isVerificationMode 
                ? 'Verificação de Email' 
                : isSignUp 
                ? 'Criar Conta' 
                : 'Login'}
            </CardTitle>
            <CardDescription>
              {isVerificationMode 
                ? 'Digite o código enviado para seu email' 
                : isSignUp 
                ? 'Crie sua conta para comprar softwares CAD/CAM' 
                : 'Faça login para acessar sua conta'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderContent()}
          </CardContent>
          <CardFooter>
            <Button 
              variant="link" 
              className="w-full" 
              onClick={() => {
                if (isVerificationMode) {
                  setIsVerificationMode(false);
                } else {
                  setIsSignUp(!isSignUp);
                }
              }}
            >
              {isVerificationMode 
                ? 'Voltar para login' 
                : isSignUp 
                ? 'Já tem uma conta? Faça login' 
                : 'Não tem uma conta? Cadastre-se'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}
