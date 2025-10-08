import { Link, useParams } from 'react-router-dom';
import { pets } from '@/data/pets';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Dog, Cat, Check, X, MessageCircle } from 'lucide-react';

const PetDetail = () => {
  const { id } = useParams();
  const pet = pets.find(p => p.id === id);

  if (!pet) {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Pet não encontrado</h1>
          <Link to="/pets">
            <Button>Voltar para lista de pets</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleWhatsApp = () => {
    const message = `Olá, gostaria de agendar uma visita para conhecer melhor ${pet.name}.`;
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <header className="bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link to="/pets" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-semibold">Voltar para lista</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="animate-fade-in">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-card">
              <img
                src={pet.image}
                alt={pet.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="animate-fade-in space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">{pet.name}</h1>
                {pet.type === 'cachorro' ? (
                  <Dog className="h-10 w-10 text-primary" />
                ) : (
                  <Cat className="h-10 w-10 text-primary" />
                )}
              </div>
              <p className="text-xl text-muted-foreground">{pet.breed}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-base px-4 py-2">{pet.age}</Badge>
              <Badge variant="secondary" className="text-base px-4 py-2">{pet.gender}</Badge>
              <Badge variant="secondary" className="text-base px-4 py-2">{pet.size}</Badge>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-bold text-foreground mb-4">Informações de Saúde</h2>
                <div className="flex items-center gap-3">
                  {pet.vaccinated ? (
                    <Check className="h-5 w-5 text-secondary" />
                  ) : (
                    <X className="h-5 w-5 text-destructive" />
                  )}
                  <span className="text-foreground">
                    {pet.vaccinated ? 'Vacinado' : 'Vacinação pendente'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {pet.neutered ? (
                    <Check className="h-5 w-5 text-secondary" />
                  ) : (
                    <X className="h-5 w-5 text-destructive" />
                  )}
                  <span className="text-foreground">
                    {pet.neutered ? 'Castrado' : 'Castração pendente'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={handleWhatsApp}
              size="lg"
              className="w-full text-lg py-6 gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              Quero Visitar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">Sobre {pet.name}</h2>
              <p className="text-foreground leading-relaxed">{pet.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">História</h2>
              <p className="text-foreground leading-relaxed">{pet.history}</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PetDetail;
