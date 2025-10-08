import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Home, Users, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/AuthModal';
import heroImage from '@/assets/hero-pets.jpg';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAdoptClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      navigate('/pets');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={heroImage}
            alt="Pets felizes"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background/90" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              Adote um Pet e Transforme Vidas
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Cada animal merece uma família que o ame. Conheça nossos pets disponíveis para adoção e encontre seu novo melhor amigo.
            </p>
            <Button size="lg" className="text-lg px-8 py-6 gap-2 shadow-hover" onClick={handleAdoptClick}>
              Quero Adotar um Pet
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Sobre Nossa ONG
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Somos uma organização dedicada ao resgate, cuidado e adoção responsável de animais abandonados. 
              Nossa missão é dar uma segunda chance a cães e gatos que precisam de um lar amoroso.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center shadow-card hover:shadow-hover transition-all duration-300 animate-scale-in">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Resgate e Cuidado</h3>
                <p className="text-muted-foreground">
                  Resgatamos animais em situação de risco e oferecemos todos os cuidados veterinários necessários.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-card hover:shadow-hover transition-all duration-300 animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Lares Temporários</h3>
                <p className="text-muted-foreground">
                  Mantemos os pets em lares temporários onde recebem amor e socialização até encontrarem uma família.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-card hover:shadow-hover transition-all duration-300 animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Adoção Responsável</h3>
                <p className="text-muted-foreground">
                  Realizamos um processo cuidadoso para garantir que cada pet encontre o lar perfeito.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Pronto para Fazer a Diferença?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Visite nossos pets disponíveis e encontre aquele que vai encher sua vida de alegria e amor incondicional.
            </p>
            <Button size="lg" className="text-lg px-8 py-6 gap-2 shadow-hover" onClick={handleAdoptClick}>
              Ver Pets Disponíveis
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card py-8 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 Adote um Pet. Feito com <Heart className="inline h-4 w-4 text-primary" /> para nossos amigos de quatro patas.
          </p>
        </div>
      </footer>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => navigate('/pets')}
      />
    </div>
  );
};

export default Index;
