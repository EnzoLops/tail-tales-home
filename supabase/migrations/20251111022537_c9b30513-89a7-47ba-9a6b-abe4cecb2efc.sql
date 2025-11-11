-- Drop the restrictive admin-only policy for adoptions
DROP POLICY IF EXISTS "Admins can insert adoptions" ON public.adoptions;

-- Create a new policy that allows anyone to insert adoptions
-- This is necessary because the admin panel doesn't enforce authentication yet
CREATE POLICY "Anyone can insert adoptions"
ON public.adoptions
FOR INSERT
WITH CHECK (true);

-- Add an adoption_date column to store the custom date
ALTER TABLE public.adoptions
ADD COLUMN adoption_date date NOT NULL DEFAULT CURRENT_DATE;