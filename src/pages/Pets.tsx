import { useState } from 'react';
import { Link } from 'react-router-dom';
import { pets } from '@/data/pets';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dog, Cat, ArrowLeft } from 'lucide-react';

type FilterType = 'todos' | 'cachorro' | 'gato';

const Pets = () => {
  const [filter, setFilter] = useState<FilterType>('todos');

  const filteredPets = filter === 'todos' 
    ? pets 
    : pets.filter(pet => pet.type === filter);

  return (
    <div className="min-h-screen bg-gradient-soft">
      <header className="bg-card shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-semibold">Voltar</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Pets Disponíveis para Adoção
          </h1>
          <p className="text-muted-foreground">
            Encontre seu novo melhor amigo
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          <Button
            variant={filter === 'todos' ? 'default' : 'outline'}
            onClick={() => setFilter('todos')}
            className="gap-2"
          >
            Todos os Pets
          </Button>
          <Button
            variant={filter === 'cachorro' ? 'default' : 'outline'}
            onClick={() => setFilter('cachorro')}
            className="gap-2"
          >
            <Dog className="h-4 w-4" />
            Cachorros
          </Button>
          <Button
            variant={filter === 'gato' ? 'default' : 'outline'}
            onClick={() => setFilter('gato')}
            className="gap-2"
          >
            <Cat className="h-4 w-4" />
            Gatos
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPets.map((pet) => (
            <Link 
              key={pet.id} 
              to={`/pet/${pet.id}`}
              className="group"
            >
              <Card className="h-full transition-all duration-300 hover:shadow-hover hover:-translate-y-1 overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-2xl font-bold text-foreground">{pet.name}</h3>
                    {pet.type === 'cachorro' ? (
                      <Dog className="h-6 w-6 text-primary" />
                    ) : (
                      <Cat className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <p className="text-muted-foreground mb-3">{pet.breed}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary">{pet.age}</Badge>
                    <Badge variant="secondary">{pet.gender}</Badge>
                    <Badge variant="secondary">{pet.size}</Badge>
                  </div>
                  <p className="text-sm text-foreground line-clamp-2">{pet.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredPets.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">
              Nenhum pet encontrado com esse filtro.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Pets;
