
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MessageCircle, Search, HelpCircle, Phone, Mail } from 'lucide-react';
import SupportChatbot from '@/components/support/SupportChatbot';
import { Card, CardContent } from '@/components/ui/card';

const faqCategories = {
  software: [
    {
      question: "Quais tipos de software CAD/CAM vocês vendem?",
      answer: "Oferecemos uma ampla gama de softwares CAD/CAM para diversas indústrias, incluindo AutoCAD, SolidWorks, CATIA, Fusion 360, Mastercam, e muitos outros. Nossa seleção abrange soluções para design mecânico, arquitetura, engenharia civil, manufatura e muito mais."
    },
    {
      question: "As licenças de software são perpétuas ou por assinatura?",
      answer: "Oferecemos ambos os tipos de licenciamento dependendo do software. Muitos produtos agora seguem um modelo de assinatura (mensal ou anual), mas alguns ainda oferecem opções de licença perpétua. Cada produto em nosso catálogo especifica claramente o tipo de licenciamento disponível."
    },
    {
      question: "Vocês oferecem versões de teste dos softwares?",
      answer: "Sim, a maioria dos softwares em nosso catálogo possui versões de teste disponíveis. O período de teste geralmente varia de 7 a 30 dias, dependendo do fabricante. Entre em contato conosco para solicitar uma versão de avaliação do produto que você está interessado."
    },
  ],
  purchase: [
    {
      question: "Quais formas de pagamento vocês aceitam?",
      answer: "Aceitamos cartões de crédito (Visa, Mastercard, American Express), boleto bancário, transferência bancária e PIX. Para empresas, também oferecemos opções de faturamento com prazo de pagamento negociável para clientes corporativos."
    },
    {
      question: "Quanto tempo leva para receber o software após a compra?",
      answer: "Para downloads digitais, você receberá acesso imediato após a confirmação do pagamento. Para pagamentos por boleto, o acesso será liberado após a compensação bancária (geralmente 1-3 dias úteis). Licenças físicas, quando aplicável, são enviadas em até 5 dias úteis."
    },
    {
      question: "Vocês emitem nota fiscal?",
      answer: "Sim, emitimos nota fiscal para todas as compras. Para pessoas jurídicas, basta informar os dados de faturamento durante o processo de compra. A nota fiscal será enviada por email após a confirmação do pagamento."
    },
  ],
  support: [
    {
      question: "Como funciona o suporte técnico?",
      answer: "Oferecemos suporte técnico por email, telefone e chat online. O horário de atendimento é de segunda a sexta, das 8h às 18h, e sábados das 9h às 13h. Para clientes com contratos de suporte premium, oferecemos atendimento estendido e suporte prioritário."
    },
    {
      question: "Vocês oferecem treinamento para os softwares?",
      answer: "Sim, oferecemos treinamentos presenciais e online para todos os softwares que comercializamos. Temos cursos padronizados e também desenvolvemos treinamentos customizados de acordo com as necessidades específicas de cada cliente ou empresa."
    },
    {
      question: "O que fazer se eu tiver problemas com a instalação do software?",
      answer: "Em caso de problemas com a instalação, primeiro verifique se seu computador atende aos requisitos mínimos do sistema. Se o problema persistir, entre em contato com nosso suporte técnico através do chat no site, email de suporte ou pelo telefone. Nossa equipe está preparada para ajudá-lo remotamente na solução de problemas."
    },
  ],
  accounts: [
    {
      question: "Como recupero minha senha?",
      answer: "Para recuperar sua senha, clique em 'Esqueceu a senha?' na página de login. Você receberá um email com instruções para criar uma nova senha. Se não receber o email, verifique sua pasta de spam ou entre em contato com nosso suporte."
    },
    {
      question: "Como atualizo meus dados cadastrais?",
      answer: "Após fazer login em sua conta, acesse a seção 'Meu Perfil' ou 'Configurações da Conta'. Lá você poderá atualizar seus dados pessoais, informações de contato e preferências de comunicação."
    },
    {
      question: "É possível transferir minha licença para outro computador?",
      answer: "Sim, a maioria das licenças pode ser transferida. O processo varia conforme o fabricante do software. Em geral, é necessário desativar a licença no computador atual antes de ativá-la em um novo equipamento. Entre em contato com nosso suporte para obter instruções específicas para seu produto."
    },
  ]
};

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showChatbot, setShowChatbot] = useState(false);
  const [showFloatingChat, setShowFloatingChat] = useState(true);
  const [activeTab, setActiveTab] = useState("software");
  
  // Simple search functionality
  const filteredFAQs = Object.entries(faqCategories).reduce((filtered, [category, questions]) => {
    const filteredQuestions = questions.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (filteredQuestions.length > 0) {
      filtered[category] = filteredQuestions;
    }
    
    return filtered;
  }, {} as Record<string, typeof faqCategories.software>);

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="bg-primary/10 p-2 rounded-full mb-4">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Central de Ajuda</h1>
            <p className="text-gray-600 mb-6 max-w-2xl">
              Encontre respostas para suas perguntas mais frequentes ou entre em contato com nossa equipe de suporte.
            </p>
            
            <div className="w-full max-w-md relative mb-8">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Buscar perguntas e respostas..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Card className="mb-8 p-4 border border-primary/20 bg-primary/5">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-xl font-semibold">Precisa de ajuda imediata?</h2>
                <p className="text-muted-foreground">Nosso assistente virtual está disponível 24/7</p>
              </div>
              <Button 
                onClick={() => setShowChatbot(true)} 
                className="flex items-center gap-2"
                size="lg"
              >
                <MessageCircle className="h-5 w-5" />
                Iniciar Chat de Suporte
              </Button>
            </div>
          </Card>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
            <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 mb-6">
              <TabsTrigger value="software">Softwares</TabsTrigger>
              <TabsTrigger value="purchase">Compras</TabsTrigger>
              <TabsTrigger value="support">Suporte</TabsTrigger>
              <TabsTrigger value="accounts">Contas</TabsTrigger>
            </TabsList>

            {Object.keys(faqCategories).map((category) => (
              <TabsContent key={category} value={category}>
                <Card>
                  <CardContent className="pt-6">
                    <Accordion type="single" collapsible className="w-full">
                      {(searchQuery === '' ? faqCategories[category as keyof typeof faqCategories] : filteredFAQs[category])?.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="text-left">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-gray-600 text-left">{faq.answer}</p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                      {searchQuery !== '' && (!filteredFAQs[category] || filteredFAQs[category].length === 0) && (
                        <div className="py-4 text-center">
                          <p>Nenhum resultado encontrado para sua busca.</p>
                        </div>
                      )}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          <div className="text-center mt-10 mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-6">Outras formas de contato</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex flex-col items-center">
                  <div className="bg-primary/10 p-3 rounded-full mb-3">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">Chat Online</h3>
                  <p className="text-sm text-center text-muted-foreground mb-4">
                    Converse com um atendente virtual ou solicite atendimento humano
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowChatbot(true)}
                  >
                    Iniciar Chat
                  </Button>
                </div>
              </Card>
              
              <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex flex-col items-center">
                  <div className="bg-primary/10 p-3 rounded-full mb-3">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">Telefone</h3>
                  <p className="text-sm text-center text-muted-foreground mb-4">
                    Seg-Sex: 8h às 18h<br />
                    Sábados: 9h às 13h
                  </p>
                  <Button variant="outline" size="sm">
                    (11) 3456-7890
                  </Button>
                </div>
              </Card>
              
              <Card className="p-6 hover:shadow-lg transition-shadow duration-300 sm:col-span-2 md:col-span-1">
                <div className="flex flex-col items-center">
                  <div className="bg-primary/10 p-3 rounded-full mb-3">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">Email</h3>
                  <p className="text-sm text-center text-muted-foreground mb-4">
                    Resposta em até 24 horas úteis
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = 'mailto:suporte@aiatech.com.br'}
                  >
                    suporte@aiatech.com.br
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {showChatbot && (
          <SupportChatbot onClose={() => setShowChatbot(false)} />
        )}

        {showFloatingChat && !showChatbot && (
          <SupportChatbot onClose={() => setShowFloatingChat(false)} isFloating={true} />
        )}
      </div>
    </Layout>
  );
};

export default FAQ;
