-- Add is_banned column to profiles table
ALTER TABLE public.profiles ADD COLUMN is_banned boolean NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN ban_reason text;
ALTER TABLE public.profiles ADD COLUMN banned_at timestamp with time zone;
ALTER TABLE public.profiles ADD COLUMN banned_by uuid;

-- Create function to check if user is banned
CREATE OR REPLACE FUNCTION public.is_user_banned(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_banned FROM public.profiles WHERE id = _user_id),
    false
  )
$$;

-- Policy for owner to update ban status
CREATE POLICY "Owner can ban users"
ON public.profiles
FOR UPDATE
USING (has_role(auth.uid(), 'owner'::app_role))
WITH CHECK (has_role(auth.uid(), 'owner'::app_role));