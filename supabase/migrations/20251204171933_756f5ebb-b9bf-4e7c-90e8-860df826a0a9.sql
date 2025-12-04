-- Adicionar coluna de endereço do adotante na tabela adoptions
ALTER TABLE public.adoptions 
ADD COLUMN adopter_address text NOT NULL DEFAULT '';