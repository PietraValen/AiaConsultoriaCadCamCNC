
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const productSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter no mínimo 3 caracteres' }),
  description: z.string().min(10, { message: 'Descrição deve ter no mínimo 10 caracteres' }),
  price: z.coerce.number().positive({ message: 'Preço deve ser positivo' }),
  category: z.string().min(2, { message: 'Categoria é obrigatória' }),
  manufacturer: z.string().min(2, { message: 'Fabricante é obrigatório' }),
  software_version: z.string().optional(),
  requirements: z.string().optional(),
  image_url: z.string().url({ message: 'URL da imagem inválida' }).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function ProductForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { userRole } = useAuth();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      manufacturer: '',
      software_version: '',
      requirements: '',
      image_url: '',
    },
  });

  // Check if user is a master admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (userRole !== 'master') {
        toast.error('Você não tem permissão para acessar esta página');
        navigate('/');
        return;
      }
      
      setIsAdmin(true);
      
      if (isEditing) {
        fetchProduct();
      }
    };
    
    checkAdminStatus();
  }, [navigate, isEditing, id, userRole]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        // Update form values
        form.reset({
          name: data.name,
          description: data.description,
          price: Number(data.price),
          category: data.category,
          manufacturer: data.manufacturer,
          software_version: data.software_version || '',
          requirements: data.requirements || '',
          image_url: data.image_url || '',
        });
      }
    } catch (error: any) {
      toast.error('Erro ao carregar produto: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  async function onSubmit(data: ProductFormValues) {
    try {
      setLoading(true);
      
      // Make sure all required fields are present and cast as needed
      const productData = {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        manufacturer: data.manufacturer,
        software_version: data.software_version || null,
        requirements: data.requirements || null,
        image_url: data.image_url || null,
      };
      
      if (isEditing) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', id);
          
        if (error) throw error;
        toast.success('Produto atualizado com sucesso!');
      } else {
        const { error } = await supabase
          .from('products')
          .insert(productData);
          
        if (error) throw error;
        toast.success('Produto criado com sucesso!');
      }
      
      navigate('/admin');
    } catch (error: any) {
      toast.error(`Erro ao ${isEditing ? 'atualizar' : 'criar'} produto: ` + error.message);
    } finally {
      setLoading(false);
    }
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/admin')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
          </Button>
          <h1 className="text-2xl font-bold">
            {isEditing ? 'Editar Produto' : 'Novo Produto'}
          </h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Informações do Produto</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && !form.formState.isSubmitting ? (
              <p>Carregando...</p>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Produto*</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: SolidWorks 2023" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preço (R$)*</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoria*</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: CAD, CAM, CAD/CAM" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="manufacturer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fabricante*</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Dassault Systèmes" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="software_version"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Versão</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: 2023" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="image_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL da Imagem</FormLabel>
                          <FormControl>
                            <Input placeholder="https://exemplo.com/imagem.jpg" {...field} />
                          </FormControl>
                          <FormDescription>
                            URL da imagem para exibição no site
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição*</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva o produto em detalhes..." 
                            rows={4}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="requirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Requisitos de Sistema</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Ex: Windows 10 64-bit, 16GB RAM, 20GB disk space" 
                            rows={3}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" disabled={loading}>
                    <Save className="mr-2 h-4 w-4" />
                    {loading ? 'Salvando...' : 'Salvar Produto'}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
