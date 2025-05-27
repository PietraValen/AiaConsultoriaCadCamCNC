
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Check } from 'lucide-react';

export default function AdminRegister() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();

  // Token de administração é necessário para registrar um novo administrador
  const adminToken = import.meta.env.VITE_ADMIN_SIGNUP_TOKEN || '';

  const createAdminAccount = async () => {
    if (!adminToken) {
      toast.error('Token de administração não configurado');
      setError('Token de administração não configurado. Verifique as variáveis de ambiente.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Iniciando criação de administrador...');
      
      // Use Supabase Edge Function invocation
      const { data, error } = await supabase.functions.invoke('api-admins', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${adminToken.trim()}` // Ensure token is correctly formatted and trimmed
        },
        body: {
          nome: 'Admin Teste',
          email: 'testesdmn@gmail.com',
          senha: 'Ai@Consultoria89#@'
        }
      });
      
      console.log('Resposta da função:', { data, error });
      
      if (error) {
        throw new Error(error.message || 'Erro ao criar administrador');
      }
      
      toast.success('Administrador criado com sucesso!');
      setSuccess(true);
      setError(null);
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao criar administrador';
      toast.error(errorMessage);
      setError(errorMessage);
      console.error('Erro ao criar admin:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 md:py-12">
        <div className="max-w-md mx-auto">
          <Card className="shadow-md">
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-lg sm:text-xl md:text-2xl">Registro de Administrador</CardTitle>
            </CardHeader>
            
            <CardContent>
              {success ? (
                <div className="bg-green-100 dark:bg-green-900 p-3 sm:p-4 rounded-md mb-4">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                    <p className="text-green-700 dark:text-green-300 text-sm sm:text-base font-medium">
                      Administrador criado com sucesso!
                    </p>
                  </div>
                  <div className="mt-2 pl-7">
                    <p className="text-green-700 dark:text-green-300 text-xs sm:text-sm">
                      Email: testesdmn@gmail.com
                    </p>
                    <p className="text-green-700 dark:text-green-300 text-xs sm:text-sm">
                      Senha: Ai@Consultoria89#@ 
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <p className="mb-4 sm:mb-6 text-muted-foreground text-xs sm:text-sm">
                    Este painel permite criar uma conta de administrador com credenciais predefinidas.
                  </p>
                  
                  {error && (
                    <div className="bg-red-100 dark:bg-red-900/50 p-3 sm:p-4 rounded-md mb-4">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                        <p className="text-red-700 dark:text-red-300 text-xs sm:text-sm">
                          {error}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div className="bg-muted/50 p-2 sm:p-3 rounded-md text-xs sm:text-sm">
                      <p><strong>Email:</strong> testesdmn@gmail.com</p>
                    </div>
                    <div className="bg-muted/50 p-2 sm:p-3 rounded-md text-xs sm:text-sm">
                      <p><strong>Senha:</strong> Ai@Consultoria89#@</p>
                    </div>
                    <div className="bg-muted/50 p-2 sm:p-3 rounded-md text-xs sm:text-sm">
                      <p><strong>Função:</strong> Admin</p>
                    </div>
                    
                    <Button 
                      onClick={createAdminAccount} 
                      disabled={loading || success}
                      className="w-full"
                      size={isMobile ? "sm" : "default"}
                    >
                      {loading ? 'Criando...' : 'Criar Conta Admin'}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
