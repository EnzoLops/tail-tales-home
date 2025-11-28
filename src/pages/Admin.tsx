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
import { LogOut, Plus, Check, X, Filter, ClipboardList, PawPrint } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

interface Adoption {
  id: string;
  pet_id: string;
  adopter_name: string;
  adopter_cpf: string;
  adopter_phone: string;
  adoption_date: string;
  adopted_at: string;
  pet_name?: string;
}

// Exemplos fictícios de adoções
const fakeAdoptions: Adoption[] = [
  {
    id: '1',
    pet_id: 'fake-1',
    adopter_name: 'Maria Silva Santos',
    adopter_cpf: '123.456.789-00',
    adopter_phone: '(11) 98765-4321',
    adoption_date: '2024-01-15',
    adopted_at: '2024-01-15T10:30:00Z',
    pet_name: 'Pipoca',
  },
  {
    id: '2',
    pet_id: 'fake-2',
    adopter_name: 'João Pedro Oliveira',
    adopter_cpf: '987.654.321-00',
    adopter_phone: '(21) 99876-5432',
    adoption_date: '2024-02-20',
    adopted_at: '2024-02-20T14:00:00Z',
    pet_name: 'Rock',
  },
  {
    id: '3',
    pet_id: 'fake-3',
    adopter_name: 'Ana Carolina Ferreira',
    adopter_cpf: '456.789.123-00',
    adopter_phone: '(31) 97654-3210',
    adoption_date: '2024-03-10',
    adopted_at: '2024-03-10T09:15:00Z',
    pet_name: 'Cacau',
  },
  {
    id: '4',
    pet_id: 'fake-4',
    adopter_name: 'Carlos Eduardo Lima',
    adopter_cpf: '321.654.987-00',
    adopter_phone: '(41) 96543-2109',
    adoption_date: '2024-04-05',
    adopted_at: '2024-04-05T16:45:00Z',
    pet_name: 'Nina',
  },
  {
    id: '5',
    pet_id: 'fake-5',
    adopter_name: 'Fernanda Costa Souza',
    adopter_cpf: '654.321.987-00',
    adopter_phone: '(51) 95432-1098',
    adoption_date: '2024-05-22',
    adopted_at: '2024-05-22T11:20:00Z',
    pet_name: 'Max',
  },
];

// Exemplos fictícios de pets adotados para exibir no filtro
import dogBob from '@/assets/dog-bob.png';
import dogRex from '@/assets/dog-rex.png';
import dogThor from '@/assets/dog-thor.png';
import catLuna from '@/assets/cat-luna.png';
import catMia from '@/assets/cat-mia.png';

const fakeAdoptedPets: Pet[] = [
  {
    id: 'fake-adopted-1',
    name: 'Pipoca',
    type: 'cachorro',
    breed: 'Vira-lata',
    age: '3 anos',
    gender: 'Fêmea',
    size: 'Médio',
    vaccinated: true,
    neutered: true,
    description: 'Cachorrinha alegre e brincalhona',
    history: 'Resgatada das ruas',
    image: dogBob,
    address: 'São Paulo - SP',
    adopted: true,
  },
  {
    id: 'fake-adopted-2',
    name: 'Rock',
    type: 'cachorro',
    breed: 'Labrador',
    age: '2 anos',
    gender: 'Macho',
    size: 'Grande',
    vaccinated: true,
    neutered: true,
    description: 'Cachorro forte e leal',
    history: 'Abandonado em estrada',
    image: dogRex,
    address: 'Rio de Janeiro - RJ',
    adopted: true,
  },
  {
    id: 'fake-adopted-3',
    name: 'Cacau',
    type: 'gato',
    breed: 'Persa',
    age: '4 anos',
    gender: 'Fêmea',
    size: 'Pequeno',
    vaccinated: true,
    neutered: true,
    description: 'Gatinha carinhosa e tranquila',
    history: 'Resgatada de maus-tratos',
    image: catLuna,
    address: 'Belo Horizonte - MG',
    adopted: true,
  },
  {
    id: 'fake-adopted-4',
    name: 'Nina',
    type: 'gato',
    breed: 'Siamês',
    age: '1 ano',
    gender: 'Fêmea',
    size: 'Pequeno',
    vaccinated: true,
    neutered: false,
    description: 'Gatinha curiosa e ativa',
    history: 'Encontrada em parque',
    image: catMia,
    address: 'Curitiba - PR',
    adopted: true,
  },
  {
    id: 'fake-adopted-5',
    name: 'Max',
    type: 'cachorro',
    breed: 'Golden Retriever',
    age: '5 anos',
    gender: 'Macho',
    size: 'Grande',
    vaccinated: true,
    neutered: true,
    description: 'Cachorro dócil e companheiro',
    history: 'Resgatado de abrigo',
    image: dogThor,
    address: 'Porto Alegre - RS',
    adopted: true,
  },
];

export default function Admin() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [adoptions, setAdoptions] = useState<Adoption[]>(fakeAdoptions);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showAdoptionModal, setShowAdoptionModal] = useState(false);
  const [selectedPetForAdoption, setSelectedPetForAdoption] = useState<Pet | null>(null);
  const [filterStatus, setFilterStatus] = useState<'todos' | 'disponiveis' | 'adotados'>('disponiveis');
  const [activeTab, setActiveTab] = useState('pets');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Adoption form state
  const [adoptionData, setAdoptionData] = useState({
    adopter_name: '',
    adopter_cpf: '',
    adopter_phone: '',
    adoption_date: new Date().toISOString().split('T')[0],
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
    loadAdoptions();
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

  const loadAdoptions = async () => {
    try {
      const { data, error } = await supabase
        .from('adoptions')
        .select('*')
        .order('adopted_at', { ascending: false });

      if (error) throw error;
      
      // Merge real adoptions with fake examples
      if (data && data.length > 0) {
        // Get pet names for real adoptions
        const adoptionsWithPetNames = await Promise.all(
          data.map(async (adoption) => {
            const { data: petData } = await supabase
              .from('pets')
              .select('name')
              .eq('id', adoption.pet_id)
              .maybeSingle();
            return {
              ...adoption,
              pet_name: petData?.name || 'Pet não encontrado',
            };
          })
        );
        setAdoptions([...adoptionsWithPetNames, ...fakeAdoptions]);
      }
    } catch (error: any) {
      console.log('Erro ao carregar adoções:', error.message);
      // Keep fake data if there's an error
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
      toggleAvailable(pet.id);
    } else {
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
      const { error: adoptionError } = await supabase
        .from('adoptions')
        .insert([{
          pet_id: selectedPetForAdoption.id,
          adopter_name: adoptionData.adopter_name,
          adopter_cpf: adoptionData.adopter_cpf,
          adopter_phone: adoptionData.adopter_phone,
          adoption_date: adoptionData.adoption_date,
        }]);

      if (adoptionError) throw adoptionError;

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
        adoption_date: new Date().toISOString().split('T')[0],
      });
      loadPets();
      loadAdoptions();
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="pets" className="flex items-center gap-2">
              <PawPrint className="h-4 w-4" />
              Gerenciar Pets
            </TabsTrigger>
            <TabsTrigger value="adoptions" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Registros de Adoção
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pets">
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
              {[...pets, ...(filterStatus === 'adotados' || filterStatus === 'todos' ? fakeAdoptedPets : [])]
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
          </TabsContent>

          <TabsContent value="adoptions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Registros de Adoção
                </CardTitle>
                <CardDescription>
                  Histórico de todas as adoções realizadas ({adoptions.length} registros)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Pet</TableHead>
                        <TableHead>Nome do Adotante</TableHead>
                        <TableHead>CPF</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>Data da Adoção</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adoptions.map((adoption) => (
                        <TableRow key={adoption.id}>
                          <TableCell className="font-medium">
                            {adoption.pet_name || 'Pet'}
                          </TableCell>
                          <TableCell>{adoption.adopter_name}</TableCell>
                          <TableCell>{adoption.adopter_cpf}</TableCell>
                          <TableCell>{adoption.adopter_phone}</TableCell>
                          <TableCell>{formatDate(adoption.adoption_date)}</TableCell>
                        </TableRow>
                      ))}
                      {adoptions.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                            Nenhum registro de adoção encontrado.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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

              <div className="space-y-2">
                <Label htmlFor="adoption_date">Data da Adoção</Label>
                <Input
                  id="adoption_date"
                  type="date"
                  value={adoptionData.adoption_date}
                  onChange={(e) => setAdoptionData({ ...adoptionData, adoption_date: e.target.value })}
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
