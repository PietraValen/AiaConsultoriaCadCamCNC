
import Layout from '@/components/layout/Layout';

export default function About() {
  return (
    <Layout>
      <div className="container mx-auto py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Sobre a AIA Tech</h1>
          
          <div className="mb-12">
            <img 
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Equipe AIA Tech" 
              className="w-full h-[400px] object-cover rounded-lg mb-6"
            />
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p>
              A AIA Tech é uma empresa especializada na venda e suporte de softwares para engenharia, manufatura e design industrial. Fundada em 2012, nossa missão é fornecer soluções tecnológicas de ponta para empresas que buscam inovar e otimizar seus processos de produção.
            </p>
            
            <h2>Nossa Missão</h2>
            <p>
              Potencializar a inovação e eficiência na indústria brasileira através do fornecimento de softwares de alta performance para CAD, CAM e CNC, acompanhados de suporte técnico especializado e treinamento profissional.
            </p>
            
            <h2>Nossa Experiência</h2>
            <p>
              Com mais de 10 anos de experiência no mercado, a AIA Tech se consolidou como um parceiro confiável para empresas de todos os portes. Nossa equipe é formada por engenheiros e especialistas em tecnologia industrial, capaz de oferecer não apenas produtos, mas soluções completas para os desafios da produção moderna.
            </p>
            
            <h2>Nossos Diferenciais</h2>
            <ul>
              <li>Parceria oficial com os principais desenvolvedores de software CAD/CAM do mundo</li>
              <li>Equipe de suporte técnico especializada e disponível em horário comercial</li>
              <li>Consultoria personalizada para implementação de soluções</li>
              <li>Serviços de treinamento e capacitação para maximizar o aproveitamento dos softwares</li>
              <li>Condições especiais de financiamento e parcelamento para empresas</li>
            </ul>
            
            <h2>Nossos Valores</h2>
            <ul>
              <li><strong>Excelência técnica:</strong> Comprometimento com a qualidade e atualização constante</li>
              <li><strong>Foco no cliente:</strong> Entendemos que o sucesso do cliente é o nosso sucesso</li>
              <li><strong>Inovação:</strong> Busca contínua por soluções que impulsionem a indústria brasileira</li>
              <li><strong>Integridade:</strong> Transparência e ética em todas as relações comerciais</li>
            </ul>
            
            <p>
              Entre em contato conosco para conhecer nossas soluções e descobrir como podemos ajudar sua empresa a alcançar novos patamares de eficiência e inovação.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
