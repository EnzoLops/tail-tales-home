-- Create adoptions table to store adopter information
CREATE TABLE public.adoptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  adopter_name TEXT NOT NULL,
  adopter_cpf TEXT NOT NULL,
  adopter_phone TEXT NOT NULL,
  adopted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.adoptions ENABLE ROW LEVEL SECURITY;

-- Admins can view all adoptions
CREATE POLICY "Admins can view all adoptions"
ON public.adoptions
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can insert adoptions
CREATE POLICY "Admins can insert adoptions"
ON public.adoptions
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster lookups
CREATE INDEX idx_adoptions_pet_id ON public.adoptions(pet_id);