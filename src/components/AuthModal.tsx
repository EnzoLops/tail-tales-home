import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const { login, signup } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignup) {
      if (!email || !password || !birthDate) {
        toast.error('Preencha todos os campos');
        return;
      }

      const result = signup(email, password, birthDate);
      if (result.success) {
        toast.success('Cadastro realizado com sucesso!');
        onSuccess();
        handleClose();
      } else {
        toast.error(result.error || 'Erro ao cadastrar');
      }
    } else {
      if (!email || !password) {
        toast.error('Preencha email e senha');
        return;
      }

      if (login(email, password)) {
        toast.success('Login realizado com sucesso!');
        onSuccess();
        handleClose();
      } else {
        toast.error('Email ou senha incorretos');
      }
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setBirthDate('');
    setIsSignup(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isSignup ? 'Cadastrar-se' : 'Entrar'}</DialogTitle>
          <DialogDescription>
            {isSignup 
              ? 'Crie sua conta para adotar um pet' 
              : 'Entre com sua conta para continuar'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {isSignup && (
            <div className="space-y-2">
              <Label htmlFor="birthDate">Data de Nascimento</Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                Você deve ter 18 anos ou mais
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button type="submit" className="w-full">
              {isSignup ? 'Cadastrar' : 'Entrar'}
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsSignup(!isSignup)}
              className="w-full"
            >
              {isSignup 
                ? 'Já tem conta? Entrar' 
                : 'Não tem conta? Cadastrar-se'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
