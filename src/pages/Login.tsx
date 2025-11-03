import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, signup, user } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/pets');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const result = await signup(email, password);
        
        if (result.success) {
          toast({
            title: 'Conta criada!',
            description: 'Sua conta foi criada com sucesso.',
          });
          navigate('/pets');
        } else {
          throw new Error(result.error);
        }
      } else {
        const result = await login(email, password);
        
        if (result.success) {
          toast({
            title: 'Login realizado!',
            description: 'Bem-vindo de volta!',
          });
          
          if (result.isAdmin) {
            navigate('/admin');
          } else {
            navigate('/pets');
          }
        } else {
          throw new Error(result.error);
        }
      }
    } catch (error: any) {
      toast({
        title: isSignUp ? 'Erro ao criar conta' : 'Erro ao fazer login',
        description: error.message || 'Ocorreu um erro. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-soft p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>{isSignUp ? 'Criar Conta' : 'Entrar'}</CardTitle>
            <CardDescription>
              {isSignUp ? 'Crie sua conta para adotar um pet' : 'Entre com suas credenciais'}
            </CardDescription>
          </CardHeader>
          <CardContent>
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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (isSignUp ? 'Criando...' : 'Entrando...') : (isSignUp ? 'Criar Conta' : 'Entrar')}
              </Button>

              <Button 
                type="button" 
                variant="ghost" 
                className="w-full" 
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? 'Já tem conta? Entrar' : 'Não tem conta? Criar'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/" className="text-sm text-primary hover:underline">
                ← Voltar para página inicial
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
