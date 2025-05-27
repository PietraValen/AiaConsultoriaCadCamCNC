
import React, { useState, useEffect, useRef } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Send, Loader2, MessageCircle, ThumbsUp, ThumbsDown, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  showFeedback?: boolean;
  feedbackGiven?: 'positive' | 'negative';
}

interface SupportChatbotProps {
  onClose: () => void;
  isFloating?: boolean;
}

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Olá! Sou o assistente virtual da AIA Tech. Como posso ajudar você hoje?",
    isUser: false,
    timestamp: new Date(),
    showFeedback: true
  }
];

// Common FAQs for quick responses
const faqResponses: Record<string, string> = {
  "licença": "Oferecemos licenças perpétuas e por assinatura, dependendo do software. Você pode ver os detalhes de licenciamento na página de cada produto. Para empresas, temos descontos especiais para licenças múltiplas.",
  "pagamento": "Aceitamos cartões de crédito (Visa, Mastercard, American Express), boleto bancário, transferência bancária e PIX. Para empresas, também oferecemos faturamento com prazo de até 30 dias. Parcelamos em até 12x no cartão de crédito.",
  "suporte": "Nosso suporte técnico está disponível por email, telefone e chat online. Atendemos de segunda a sexta, das 8h às 18h, e sábados das 9h às 13h. Para clientes enterprise, oferecemos suporte 24/7 sob contrato específico.",
  "treinamento": "Sim, oferecemos treinamentos presenciais e online para todos os softwares que comercializamos, incluindo opções customizadas. Temos pacotes individuais, em grupo e empresariais com certificação oficial dos fabricantes.",
  "instalação": "Se você está tendo problemas com a instalação, verifique se seu computador atende aos requisitos mínimos do sistema. Para o processo de instalação: 1) Baixe o instalador, 2) Execute como administrador, 3) Siga as instruções na tela, 4) Ative com sua licença. Para ajuda adicional, entre em contato com nosso suporte técnico.",
  "senha": "Para recuperar sua senha, clique em 'Esqueceu a senha?' na página de login. Você receberá um email com instruções para criar uma nova senha. Se não receber o email em alguns minutos, verifique sua pasta de spam ou entre em contato com o suporte.",
  "contato": "Você pode nos contatar pelo telefone (11) 3456-7890, pelo email contato@aiatech.com.br ou através do formulário de contato em nosso site. Nossa sede fica na Av. Paulista, 1000, São Paulo - SP.",
  "horário": "Nosso horário de atendimento é de segunda a sexta, das 8h às 18h, e aos sábados das 9h às 13h. Em feriados, consulte nosso calendário no site para informações específicas. Pedidos online podem ser feitos 24 horas por dia, 7 dias por semana."
};

// Quick Reply topics
const quickReplies = [
  "Como comprar licenças?",
  "Formas de pagamento",
  "Horário de atendimento",
  "Problemas na instalação",
  "Treinamentos disponíveis",
  "Falar com atendente humano"
];

const SupportChatbot: React.FC<SupportChatbotProps> = ({ onClose, isFloating = false }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [satisfactionRated, setSatisfactionRated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!isMinimized) {
      scrollToBottom();
      setUnreadMessages(0);
    }
  }, [messages, isMinimized]);

  useEffect(() => {
    if (isMinimized && messages.length > 0 && messages[messages.length - 1].isUser === false) {
      setUnreadMessages(prev => prev + 1);
    }
  }, [messages, isMinimized]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    // Add user message
    const userMessageId = Date.now();
    const userMessage: Message = {
      id: userMessageId,
      text: newMessage,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);
    
    // Simulate bot thinking and responding
    const thinkingTime = Math.floor(Math.random() * 1000) + 500; // 500-1500ms
    setTimeout(() => {
      const botResponse = generateBotResponse(newMessage);
      const botMessage: Message = {
        id: userMessageId + 1,
        text: botResponse,
        isUser: false,
        timestamp: new Date(),
        showFeedback: true
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, thinkingTime);
  };

  const handleQuickReply = (reply: string) => {
    const userMessageId = Date.now();
    const userMessage: Message = {
      id: userMessageId,
      text: reply,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Simulate bot thinking and responding
    setTimeout(() => {
      const botResponse = generateBotResponse(reply);
      const botMessage: Message = {
        id: userMessageId + 1,
        text: botResponse,
        isUser: false,
        timestamp: new Date(),
        showFeedback: true
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleFeedback = (messageId: number, isPositive: boolean) => {
    setMessages(prev => prev.map(message => {
      if (message.id === messageId) {
        return {
          ...message,
          feedbackGiven: isPositive ? 'positive' : 'negative',
          showFeedback: false
        };
      }
      return message;
    }));

    // If negative feedback, ask what was wrong
    if (!isPositive) {
      setTimeout(() => {
        const followUpId = Date.now();
        const followUpMessage: Message = {
          id: followUpId,
          text: "Lamento não ter sido útil. Pode nos dizer o que faltou na resposta para melhorarmos?",
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, followUpMessage]);
      }, 500);
    } else {
      // Thank for positive feedback
      setTimeout(() => {
        const thankId = Date.now();
        const thankMessage: Message = {
          id: thankId,
          text: "Obrigado pelo feedback positivo! Estou à disposição para mais perguntas.",
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, thankMessage]);
      }, 500);
    }
  };

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Special case for human assistance request
    if (lowerMessage.includes('humano') || lowerMessage.includes('atendente') || lowerMessage.includes('pessoa') || 
        lowerMessage === "Falar com atendente humano") {
      return "Entendido! Para falar com um atendente humano, você pode ligar para (11) 3456-7890 durante nosso horário comercial, ou enviar um e-mail para atendimento@aiatech.com.br com seus dados. Um especialista entrará em contato em até 4 horas úteis. Alternativamente, você pode agendar uma ligação no horário mais conveniente para você através do nosso site.";
    }
    
    // Check for keyword matches in our FAQ responses
    for (const [keyword, response] of Object.entries(faqResponses)) {
      if (lowerMessage.includes(keyword)) {
        return response;
      }
    }

    // Check for question about licenses
    if (lowerMessage.includes('comprar licença') || lowerMessage.includes('adquirir licença') || 
        lowerMessage === "Como comprar licenças?") {
      return "Para adquirir licenças dos nossos softwares, você tem várias opções:\n\n1. Diretamente pelo nosso site, adicionando ao carrinho e finalizando a compra\n2. Contatando nossa equipe de vendas pelo telefone (11) 3456-7890\n3. Enviando uma solicitação de orçamento pelo email vendas@aiatech.com.br\n\nPara empresas que precisam de múltiplas licenças, oferecemos condições especiais. Gostaria que eu detalhasse alguma dessas opções?";
    }

    // Match on training inquiry
    if (lowerMessage.includes('treinamento') || lowerMessage.includes('curso') || 
        lowerMessage === "Treinamentos disponíveis") {
      return "Oferecemos diversos tipos de treinamentos para todos os nossos softwares:\n\n• Treinamentos introdutórios (8 horas)\n• Treinamentos avançados (16 horas)\n• Workshops especializados (4 horas)\n• Certificações oficiais (duração variável)\n\nTodos disponíveis tanto no formato presencial quanto online ao vivo. Para empresas, podemos personalizar o conteúdo conforme suas necessidades específicas. Consulte nossa agenda completa na seção 'Treinamentos' do nosso site.";
    }
    
    // Default responses when no match is found
    const defaultResponses = [
      "Obrigado pela sua mensagem. Para atendimento mais específico sobre esse assunto, recomendo entrar em contato com nossa equipe de suporte pelo formulário de contato ou pelo telefone (11) 3456-7890. Nosso horário de atendimento é de segunda a sexta, das 8h às 18h.",
      "Essa questão precisa de uma análise mais detalhada. Para melhor atendê-lo, por favor, entre em contato diretamente com nossa equipe através do email suporte@aiatech.com.br ou pelo telefone (11) 3456-7890, informando seu nome, empresa e detalhes do seu ambiente de trabalho.",
      "Essa é uma pergunta interessante que exige uma resposta personalizada. Para melhor atendê-lo, por favor, entre em contato com nosso time de suporte pelo email suporte@aiatech.com.br ou pelo chat ao vivo no horário comercial, e um especialista técnico poderá ajudá-lo.",
      "Entendo sua dúvida. Para uma resposta mais precisa sobre esse tema específico, recomendo que entre em contato com nosso departamento técnico pelo telefone (11) 3456-7890 ou pelo email suporte@aiatech.com.br. Assim conseguiremos entender melhor o contexto da sua necessidade."
    ];
    
    // Return a random default response
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleEndChat = () => {
    if (!satisfactionRated) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "Antes de encerrar, como você avaliaria nosso atendimento?",
        isUser: false,
        timestamp: new Date()
      }]);
      setSatisfactionRated(true);
    } else {
      onClose();
    }
  };

  if (isFloating && isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          onClick={() => setIsMinimized(false)} 
          size="lg" 
          className="rounded-full h-14 w-14 shadow-lg flex items-center justify-center"
        >
          <MessageCircle className="h-6 w-6" />
          {unreadMessages > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadMessages}
            </span>
          )}
        </Button>
      </div>
    );
  }

  const chatContent = (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isUser 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}
            >
              <p className="whitespace-pre-line">{message.text}</p>
              <div className="flex justify-between items-center mt-2">
                <p className={`text-xs ${message.isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {formatTime(message.timestamp)}
                </p>
                
                {message.showFeedback && !message.isUser && !message.feedbackGiven && (
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6" 
                      onClick={() => handleFeedback(message.id, true)}
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6" 
                      onClick={() => handleFeedback(message.id, false)}
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                {message.feedbackGiven && (
                  <Badge variant={message.feedbackGiven === 'positive' ? 'default' : 'outline'}>
                    {message.feedbackGiven === 'positive' ? 'Útil' : 'Não útil'}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted p-3 rounded-lg flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Digitando...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Quick reply section */}
      {messages.length < 3 && (
        <div className="px-4 py-3 border-t">
          <p className="text-sm text-muted-foreground mb-2">Perguntas frequentes:</p>
          <div className="flex flex-wrap gap-2">
            {quickReplies.slice(0, 4).map((reply, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="cursor-pointer hover:bg-accent py-1.5"
                onClick={() => handleQuickReply(reply)}
              >
                {reply}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {satisfactionRated && (
        <div className="px-4 py-3 border-t">
          <Card className="p-3">
            <div className="text-center space-y-2">
              <p className="text-sm">Como você avaliaria nosso atendimento?</p>
              <div className="flex justify-center space-x-4">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    variant={rating > 3 ? "default" : "outline"}
                    size="sm"
                    className="h-8 w-8"
                    onClick={() => {
                      setMessages(prev => [...prev, {
                        id: Date.now(),
                        text: `Obrigado por avaliar nosso atendimento com ${rating} ${rating === 1 ? 'estrela' : 'estrelas'}! Sua opinião é muito importante.`,
                        isUser: false,
                        timestamp: new Date()
                      }]);
                      setSatisfactionRated(false);
                    }}
                  >
                    {rating}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}
      
      <DialogFooter className="flex-shrink-0 p-4 border-t">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }} 
          className="flex w-full gap-2"
        >
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isTyping || newMessage.trim() === ''}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </DialogFooter>
    </>
  );

  if (isFloating) {
    return (
      <div className="fixed bottom-6 right-6 z-50 max-w-[400px] w-full">
        <Card className="shadow-xl border overflow-hidden flex flex-col h-[500px]">
          <div className="px-4 py-3 border-b flex items-center justify-between bg-primary text-primary-foreground">
            <div className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5" />
              <h3 className="font-medium">Suporte AIA Tech</h3>
            </div>
            <div className="flex space-x-1">
              <Button variant="ghost" size="icon" onClick={() => setIsMinimized(true)} className="h-7 w-7 text-primary-foreground">
                <span className="sr-only">Minimizar</span>
                <svg width="10" height="2" viewBox="0 0 10 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleEndChat} className="h-7 w-7 text-primary-foreground">
                <X className="h-4 w-4" />
                <span className="sr-only">Fechar</span>
              </Button>
            </div>
          </div>
          
          {chatContent}
        </Card>
      </div>
    );
  }

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              <span>Chat de Suporte</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleEndChat} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        {chatContent}
      </DialogContent>
    </Dialog>
  );
};

export default SupportChatbot;
