import { useState, useEffect, useRef } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import WebhookConfig from './WebhookConfig';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  petName: string;
}

const ChatWidget = ({ isOpen, onClose, petName }: ChatWidgetProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Olá! Estou aqui para ajudar com informações sobre ${petName}. Como posso ajudá-lo?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const webhookUrl = localStorage.getItem('n8n_webhook_url') || 'https://n8n.garbellinitech.com.br/webhook/PetLar';

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          petName: petName,
          chatId: `pet-${petName}`,
          conversationHistory: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp.toISOString()
          })),
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Webhook request failed');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response || data.output || data.reply || 'Desculpe, não consegui processar sua mensagem.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar a mensagem. Verifique o webhook.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader className="flex flex-row items-center justify-between">
            <SheetTitle>Chat com Agente - {petName}</SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowConfig(true)}
              className="h-8 w-8"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </SheetHeader>

          <div className="flex flex-col h-[calc(100vh-120px)] mt-4">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <p className="text-sm">Digitando...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2 mt-4">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <WebhookConfig
        isOpen={showConfig}
        onClose={() => setShowConfig(false)}
      />
    </>
  );
};

export default ChatWidget;
