
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Package as PackageIcon, User as UserIcon } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto py-12">
        <h1 className="text-2xl font-bold mb-8">Minha Conta</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <UserIcon className="w-8 h-8" />
              <div>
                <h2 className="text-lg font-semibold">Dados Pessoais</h2>
                <p className="text-sm text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={() => navigate("/profile/edit")}>
              Editar Perfil
            </Button>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <PackageIcon className="w-8 h-8" />
              <div>
                <h2 className="text-lg font-semibold">Meus Pedidos</h2>
                <p className="text-sm text-muted-foreground">
                  Acompanhe seus pedidos
                </p>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={() => navigate("/profile/orders")}>
              Ver Pedidos
            </Button>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
