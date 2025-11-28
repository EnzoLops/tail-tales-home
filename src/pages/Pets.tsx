import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dog, Cat, ArrowLeft, LogOut } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/AuthModal';

// Importar imagens locais
import dogBob from '@/assets/dog-bob.png';
import dogRex from '@/assets/dog-rex.png';
import dogThor from '@/assets/dog-thor.png';
import catLuna from '@/assets/cat-luna.png';
import catMel from '@/assets/cat-mel.png';
import catMia from '@/assets/cat-mia.png';

// Mapa de imagens para resolver caminhos
const imageMap: Record<string, string> = {
  '/src/assets/dog-bob.png': dogBob,
  '/src/assets/dog-rex.png': dogRex,
  '/src/assets/dog-thor.png': dogThor,
  '/src/assets/cat-luna.png': catLuna,
  '/src/assets/cat-mel.png': catMel,
  '/src/assets/cat-mia.png': catMia,
};

const resolveImage = (imagePath: string): string => {
  return imageMap[imagePath] || imagePath;
};

type FilterType = 'todos' | 'cachorro' | 'gato';
type SizeFilter = 'todos' | 'Pequeno' | 'Médio' | 'Grande';

interface Pet {
  id: string;
  name: string;
  type: 'cachorro' | 'gato';
  breed: string;
  age: string;
  gender: 'Macho' | 'Fêmea';
  size: 'Pequeno' | 'Médio' | 'Grande';
  vaccinated: boolean;
  neutered: boolean;
  description: string;
  image: string;
}

const Pets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('todos');
  const [sizeFilter, setSizeFilter] = useState<SizeFilter>('todos');
  const [vaccinatedFilter, setVaccinatedFilter] = useState<boolean | null>(null);
  const [neuteredFilter, setNeuteredFilter] = useState<boolean | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast({
      title: 'Desconectado',
      description: 'Você saiu da sua conta.',
    });
    navigate('/');
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    }
    loadPets();
  }, [isAuthenticated]);

  const loadPets = async () => {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('adopted', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPets(data || []);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar pets',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPets = pets.filter(pet => {
    if (filter !== 'todos' && pet.type !== filter) return false;
    if (sizeFilter !== 'todos' && pet.size !== sizeFilter) return false;
    if (vaccinatedFilter !== null && pet.vaccinated !== vaccinatedFilter) return false;
    if (neuteredFilter !== null && pet.neutered !== neuteredFilter) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Carregando pets...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center">
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => {
            setShowAuthModal(false);
            navigate('/');
          }}
          onSuccess={() => {
            setShowAuthModal(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-soft">
      <header className="bg-card shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-start mb-4">
            <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-semibold">Voltar</span>
            </Link>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Pets Disponíveis para Adoção
          </h1>
          <p className="text-muted-foreground">
            Encontre seu novo melhor amigo
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filtros principais */}
        <div className="flex flex-wrap gap-3 mb-6 justify-center">
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

        {/* Filtros adicionais */}
        <div className="bg-card p-6 rounded-lg shadow-sm mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Filtros Adicionais</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Filtro de Tamanho */}
            <div className="space-y-2">
              <Label htmlFor="size-filter">Tamanho</Label>
              <Select value={sizeFilter} onValueChange={(value) => setSizeFilter(value as SizeFilter)}>
                <SelectTrigger id="size-filter">
                  <SelectValue placeholder="Selecione o tamanho" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tamanhos</SelectItem>
                  <SelectItem value="Pequeno">Pequeno</SelectItem>
                  <SelectItem value="Médio">Médio</SelectItem>
                  <SelectItem value="Grande">Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro de Vacinado */}
            <div className="space-y-2">
              <Label>Vacinação</Label>
              <div className="flex items-center space-x-6 pt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="vaccinated" 
                    checked={vaccinatedFilter === true}
                    onCheckedChange={(checked) => setVaccinatedFilter(checked ? true : null)}
                  />
                  <Label htmlFor="vaccinated" className="font-normal cursor-pointer">
                    Vacinado
                  </Label>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setVaccinatedFilter(null)}
                  className="text-xs"
                >
                  Limpar
                </Button>
              </div>
            </div>

            {/* Filtro de Castrado */}
            <div className="space-y-2">
              <Label>Castração</Label>
              <div className="flex items-center space-x-6 pt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="neutered" 
                    checked={neuteredFilter === true}
                    onCheckedChange={(checked) => setNeuteredFilter(checked ? true : null)}
                  />
                  <Label htmlFor="neutered" className="font-normal cursor-pointer">
                    Castrado
                  </Label>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setNeuteredFilter(null)}
                  className="text-xs"
                >
                  Limpar
                </Button>
              </div>
            </div>
          </div>
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
                    src={resolveImage(pet.image)}
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
