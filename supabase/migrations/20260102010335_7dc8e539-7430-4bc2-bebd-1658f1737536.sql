-- Drop and recreate the increment_software_count function with proper WHERE clause
CREATE OR REPLACE FUNCTION public.increment_software_count()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.site_stats 
  SET total_software = total_software + 1, updated_at = now()
  WHERE id = (SELECT id FROM public.site_stats LIMIT 1);
  RETURN NEW;
END;
$function$;

-- Also fix decrement_software_count
CREATE OR REPLACE FUNCTION public.decrement_software_count()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.site_stats 
  SET total_software = total_software - 1, updated_at = now()
  WHERE id = (SELECT id FROM public.site_stats LIMIT 1);
  RETURN OLD;
END;
$function$;

-- Fix increment_user_count as well
CREATE OR REPLACE FUNCTION public.increment_user_count()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.site_stats 
  SET total_users = total_users + 1, updated_at = now()
  WHERE id = (SELECT id FROM public.site_stats LIMIT 1);
  RETURN NEW;
END;
$function$;

-- Ensure site_stats has at least one row
INSERT INTO public.site_stats (id, total_software, total_users)
SELECT gen_random_uuid(), 0, 0
WHERE NOT EXISTS (SELECT 1 FROM public.site_stats LIMIT 1);