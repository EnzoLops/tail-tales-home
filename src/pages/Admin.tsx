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
import { LogOut, Plus, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

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
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logout, user } = useAuth();

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
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!user.isAdmin) {
      toast({
        title: 'Acesso negado',
        description: 'Você não tem permissão para acessar esta página.',
        variant: 'destructive',
      });
      navigate('/pets');
      return;
    }

    loadPets();
  }, [user, navigate]);

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

  const handleLogout = async () => {
    await logout();
    toast({
      title: 'Desconectado',
      description: 'Você saiu da conta de administrador.',
    });
    navigate('/login');
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

  const toggleAdopted = async (petId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('pets')
        .update({ adopted: !currentStatus })
        .eq('id', petId);

      if (error) throw error;

      toast({
        title: currentStatus ? 'Pet disponível novamente' : 'Pet marcado como adotado',
        description: currentStatus 
          ? 'O pet voltou para a lista de disponíveis.' 
          : 'O pet foi marcado como adotado e não aparecerá mais no site.',
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
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Gerenciar Pets ({pets.length})
          </h2>
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
          {pets.map((pet) => (
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
                  onClick={() => toggleAdopted(pet.id, pet.adopted)}
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
      </main>
    </div>
  );
}
