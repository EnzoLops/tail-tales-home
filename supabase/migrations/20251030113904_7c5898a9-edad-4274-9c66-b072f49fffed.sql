-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policy for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to check if user has role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create enum for pet types
CREATE TYPE public.pet_type AS ENUM ('cachorro', 'gato');

-- Create enum for pet gender
CREATE TYPE public.pet_gender AS ENUM ('Macho', 'Fêmea');

-- Create enum for pet size
CREATE TYPE public.pet_size AS ENUM ('Pequeno', 'Médio', 'Grande');

-- Create pets table
CREATE TABLE public.pets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type pet_type NOT NULL,
  breed TEXT NOT NULL,
  age TEXT NOT NULL,
  gender pet_gender NOT NULL,
  size pet_size NOT NULL,
  vaccinated BOOLEAN NOT NULL DEFAULT false,
  neutered BOOLEAN NOT NULL DEFAULT false,
  description TEXT NOT NULL,
  history TEXT NOT NULL,
  image TEXT NOT NULL,
  address TEXT NOT NULL,
  adopted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

-- Create policies for pets (readable by everyone, but only admins can modify)
CREATE POLICY "Anyone can view non-adopted pets"
  ON public.pets
  FOR SELECT
  USING (adopted = false);

CREATE POLICY "Admins can view all pets"
  ON public.pets
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert pets"
  ON public.pets
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update pets"
  ON public.pets
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create storage bucket for pet images
INSERT INTO storage.buckets (id, name, public)
VALUES ('pet-images', 'pet-images', true);

-- Create storage policies
CREATE POLICY "Anyone can view pet images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'pet-images');

CREATE POLICY "Admins can upload pet images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'pet-images' AND
    public.has_role(auth.uid(), 'admin')
  );

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_pets_updated_at
  BEFORE UPDATE ON public.pets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial pets data
INSERT INTO public.pets (name, type, breed, age, gender, size, vaccinated, neutered, description, history, image, address)
VALUES
  ('Thor', 'cachorro', 'Vira-lata', '3 anos', 'Macho', 'Grande', true, true, 
   'Thor é um vira-lata carinhoso e brincalhão que adora crianças.', 
   'Thor foi resgatado das ruas quando ainda era filhote. Ele é muito sociável e se dá bem com outros animais.',
   '/src/assets/dog-thor.png', 'Rua das Flores, 123 - Centro, São Paulo - SP'),
  
  ('Luna', 'gato', 'Vira-lata', '2 anos', 'Fêmea', 'Pequeno', true, true,
   'Luna é uma gatinha tranquila e elegante, perfeita para apartamentos.',
   'Luna foi encontrada abandonada em uma caixa. Hoje é uma gatinha saudável e carinhosa.',
   '/src/assets/cat-luna.png', 'Rua das Flores, 123 - Centro, São Paulo - SP'),
  
  ('Bob', 'cachorro', 'Vira-lata', '4 anos', 'Macho', 'Médio', true, true,
   'Bob é um cachorro calmo e fiel, ideal para famílias.',
   'Bob viveu nas ruas por alguns anos antes de ser resgatado. É muito grato e companheiro.',
   '/src/assets/dog-bob.png', 'Rua das Flores, 123 - Centro, São Paulo - SP'),
  
  ('Mel', 'gato', 'Vira-lata', '1 ano', 'Fêmea', 'Pequeno', true, false,
   'Mel é uma gatinha peluda e super afetuosa.',
   'Mel foi doada por uma família que não podia mais cuidar dela. É muito carinhosa e adora colo.',
   '/src/assets/cat-mel.png', 'Rua das Flores, 123 - Centro, São Paulo - SP'),
  
  ('Rex', 'cachorro', 'Vira-lata', '2 anos', 'Macho', 'Pequeno', true, true,
   'Rex é protetor e leal, ótimo guardião para sua casa.',
   'Rex foi treinado como cão de guarda mas seu antigo dono precisou se mudar. Ele é obediente e inteligente.',
   '/src/assets/dog-rex.png', 'Rua das Flores, 123 - Centro, São Paulo - SP'),
  
  ('Mia', 'gato', 'Vira-lata', '2 anos', 'Fêmea', 'Pequeno', true, false,
   'Mia é uma gatinha brincalhona e cheia de energia.',
   'Mia nasceu na rua e foi resgatada muito novinha. É curiosa e adora brinquedos.',
   '/src/assets/cat-mia.png', 'Rua das Flores, 123 - Centro, São Paulo - SP');