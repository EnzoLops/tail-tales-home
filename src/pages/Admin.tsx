import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Plus, Check, X, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
  history: string;
  image: string;
  address: string;
  adopted: boolean;
}

export default function Admin() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showAdoptionModal, setShowAdoptionModal] = useState(false);
  const [selectedPetForAdoption, setSelectedPetForAdoption] = useState<Pet | null>(null);
  const [filterStatus, setFilterStatus] = useState<'todos' | 'disponiveis' | 'adotados'>('disponiveis');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Adoption form state
  const [adoptionData, setAdoptionData] = useState({
    adopter_name: '',
    adopter_cpf: '',
    adopter_phone: '',
  });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'cachorro' as 'cachorro' | 'gato',
    breed: '',
    age: '',
    gender: 'Macho' as 'Macho' | 'Fêmea',
    size: 'Médio' as 'Pequeno' | 'Médio' | 'Grande',
    vaccinated: false,
    neutered: false,
    description: '',
    history: '',
    image: '',
    address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
  });

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
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

  const handleLogout = () => {
    toast({
      title: 'Saindo',
      description: 'Voltando para página inicial.',
    });
    navigate('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('pets')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: 'Pet adicionado!',
        description: 'O pet foi cadastrado com sucesso.',
      });

      setShowForm(false);
      setFormData({
        name: '',
        type: 'cachorro',
        breed: '',
        age: '',
        gender: 'Macho',
        size: 'Médio',
        vaccinated: false,
        neutered: false,
        description: '',
        history: '',
        image: '',
        address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
      });
      loadPets();
    } catch (error: any) {
      toast({
        title: 'Erro ao adicionar pet',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdoptClick = (pet: Pet) => {
    if (pet.adopted) {
      // If already adopted, just toggle back to available
      toggleAvailable(pet.id);
    } else {
      // If not adopted, open modal to collect adopter info
      setSelectedPetForAdoption(pet);
      setShowAdoptionModal(true);
    }
  };

  const toggleAvailable = async (petId: string) => {
    try {
      const { error } = await supabase
        .from('pets')
        .update({ adopted: false })
        .eq('id', petId);

      if (error) throw error;

      toast({
        title: 'Pet disponível novamente',
        description: 'O pet voltou para a lista de disponíveis.',
      });

      loadPets();
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar status',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleAdoptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPetForAdoption) return;

    setLoading(true);

    try {
      // Insert adoption record
      const { error: adoptionError } = await supabase
        .from('adoptions')
        .insert([{
          pet_id: selectedPetForAdoption.id,
          adopter_name: adoptionData.adopter_name,
          adopter_cpf: adoptionData.adopter_cpf,
          adopter_phone: adoptionData.adopter_phone,
        }]);

      if (adoptionError) throw adoptionError;

      // Mark pet as adopted
      const { error: petError } = await supabase
        .from('pets')
        .update({ adopted: true })
        .eq('id', selectedPetForAdoption.id);

      if (petError) throw petError;

      toast({
        title: 'Pet adotado!',
        description: 'As informações do adotante foram registradas.',
      });

      setShowAdoptionModal(false);
      setSelectedPetForAdoption(null);
      setAdoptionData({
        adopter_name: '',
        adopter_cpf: '',
        adopter_phone: '',
      });
      loadPets();
    } catch (error: any) {
      toast({
        title: 'Erro ao registrar adoção',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/50">
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Painel Administrativo</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">
              Gerenciar Pets ({pets.filter(p => 
                filterStatus === 'todos' ? true : 
                filterStatus === 'adotados' ? p.adopted : !p.adopted
              ).length})
            </h2>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'disponiveis' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('disponiveis')}
              >
                <Filter className="mr-2 h-4 w-4" />
                Disponíveis
              </Button>
              <Button
                variant={filterStatus === 'adotados' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('adotados')}
              >
                <Filter className="mr-2 h-4 w-4" />
                Adotados
              </Button>
              <Button
                variant={filterStatus === 'todos' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('todos')}
              >
                <Filter className="mr-2 h-4 w-4" />
                Todos
              </Button>
            </div>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? 'Cancelar' : 'Adicionar Pet'}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Adicionar Novo Pet</CardTitle>
              <CardDescription>
                Preencha as informações do pet para cadastrá-lo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: 'cachorro' | 'gato') => 
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cachorro">Cachorro</SelectItem>
                        <SelectItem value="gato">Gato</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="breed">Raça</Label>
                    <Input
                      id="breed"
                      value={formData.breed}
                      onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Idade</Label>
                    <Input
                      id="age"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      placeholder="Ex: 2 anos"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gênero</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value: 'Macho' | 'Fêmea') =>
                        setFormData({ ...formData, gender: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Macho">Macho</SelectItem>
                        <SelectItem value="Fêmea">Fêmea</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size">Porte</Label>
                    <Select
                      value={formData.size}
                      onValueChange={(value: 'Pequeno' | 'Médio' | 'Grande') =>
                        setFormData({ ...formData, size: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pequeno">Pequeno</SelectItem>
                        <SelectItem value="Médio">Médio</SelectItem>
                        <SelectItem value="Grande">Grande</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">URL da Imagem</Label>
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="/src/assets/pet-image.png"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="history">História</Label>
                  <Textarea
                    id="history"
                    value={formData.history}
                    onChange={(e) => setFormData({ ...formData, history: e.target.value })}
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="vaccinated"
                      checked={formData.vaccinated}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, vaccinated: checked as boolean })
                      }
                    />
                    <Label htmlFor="vaccinated">Vacinado</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="neutered"
                      checked={formData.neutered}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, neutered: checked as boolean })
                      }
                    />
                    <Label htmlFor="neutered">Castrado</Label>
                  </div>
                </div>

                <Button type="submit" disabled={loading}>
                  {loading ? 'Adicionando...' : 'Adicionar Pet'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets
            .filter(pet => 
              filterStatus === 'todos' ? true : 
              filterStatus === 'adotados' ? pet.adopted : !pet.adopted
            )
            .map((pet) => (
            <Card key={pet.id} className={pet.adopted ? 'opacity-60' : ''}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{pet.name}</CardTitle>
                    <CardDescription>
                      {pet.type === 'cachorro' ? '🐕' : '🐱'} {pet.breed} • {pet.age}
                    </CardDescription>
                  </div>
                  {pet.adopted && (
                    <Badge variant="secondary">Adotado</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {pet.description}
                  </p>
                </div>
                <Button
                  variant={pet.adopted ? 'outline' : 'default'}
                  className="w-full"
                  onClick={() => handleAdoptClick(pet)}
                >
                  {pet.adopted ? (
                    <>
                      <X className="mr-2 h-4 w-4" />
                      Disponibilizar
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Marcar como Adotado
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={showAdoptionModal} onOpenChange={setShowAdoptionModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Adoção</DialogTitle>
              <DialogDescription>
                Preencha as informações do adotante de {selectedPetForAdoption?.name}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAdoptionSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adopter_name">Nome Completo</Label>
                <Input
                  id="adopter_name"
                  value={adoptionData.adopter_name}
                  onChange={(e) => setAdoptionData({ ...adoptionData, adopter_name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adopter_cpf">CPF</Label>
                <Input
                  id="adopter_cpf"
                  value={adoptionData.adopter_cpf}
                  onChange={(e) => setAdoptionData({ ...adoptionData, adopter_cpf: e.target.value })}
                  placeholder="000.000.000-00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adopter_phone">Telefone</Label>
                <Input
                  id="adopter_phone"
                  value={adoptionData.adopter_phone}
                  onChange={(e) => setAdoptionData({ ...adoptionData, adopter_phone: e.target.value })}
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setShowAdoptionModal(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Registrando...' : 'Confirmar Adoção'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
