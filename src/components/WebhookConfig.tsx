import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface WebhookConfigProps {
  isOpen: boolean;
  onClose: () => void;
}

const WebhookConfig = ({ isOpen, onClose }: WebhookConfigProps) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('https://n8n.garbellinitech.com.br/webhook/PetLar');
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setIsAuthenticated(false);
      const savedWebhook = localStorage.getItem('n8n_webhook_url');
      if (savedWebhook) {
        setWebhookUrl(savedWebhook);
      } else {
        setWebhookUrl('https://n8n.garbellinitech.com.br/webhook/PetLar');
      }
    }
  }, [isOpen]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '123') {
      setIsAuthenticated(true);
    } else {
      toast({
        title: 'Senha incorreta',
        description: 'Por favor, tente novamente.',
        variant: 'destructive'
      });
    }
  };

  const handleSaveWebhook = () => {
    if (!webhookUrl.trim()) {
      toast({
        title: 'URL inválida',
        description: 'Por favor, insira uma URL válida.',
        variant: 'destructive'
      });
      return;
    }

    localStorage.setItem('n8n_webhook_url', webhookUrl);
    toast({
      title: 'Configuração salva',
      description: 'O webhook foi configurado com sucesso.'
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configurar Webhook N8N</DialogTitle>
          <DialogDescription>
            {!isAuthenticated
              ? 'Digite a senha para acessar as configurações'
              : 'Configure a URL do webhook N8N'}
          </DialogDescription>
        </DialogHeader>

        {!isAuthenticated ? (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha"
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full">
              Acessar
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhook">URL do Webhook N8N</Label>
              <Input
                id="webhook"
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://seu-n8n.com/webhook/..."
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveWebhook} className="flex-1">
                Salvar
              </Button>
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WebhookConfig;
