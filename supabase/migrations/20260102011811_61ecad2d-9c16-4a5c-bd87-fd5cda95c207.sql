-- Add total_downloads column to site_stats
ALTER TABLE public.site_stats ADD COLUMN IF NOT EXISTS total_downloads integer NOT NULL DEFAULT 0;

-- Create trigger for software count on insert
DROP TRIGGER IF EXISTS on_software_created ON public.software;
CREATE TRIGGER on_software_created
  AFTER INSERT ON public.software
  FOR EACH ROW EXECUTE FUNCTION public.increment_software_count();

-- Create trigger for software count on delete
DROP TRIGGER IF EXISTS on_software_deleted ON public.software;
CREATE TRIGGER on_software_deleted
  AFTER DELETE ON public.software
  FOR EACH ROW EXECUTE FUNCTION public.decrement_software_count();

-- Create trigger for user count on profile creation
DROP TRIGGER IF EXISTS on_user_created ON public.profiles;
CREATE TRIGGER on_user_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.increment_user_count();

-- Create function to increment download count
CREATE OR REPLACE FUNCTION public.increment_download_count()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.site_stats 
  SET total_downloads = total_downloads + 1, updated_at = now()
  WHERE id = (SELECT id FROM public.site_stats LIMIT 1);
END;
$$;

-- Update current stats to reflect actual counts
UPDATE public.site_stats 
SET 
  total_software = (SELECT COUNT(*) FROM public.software),
  total_users = (SELECT COUNT(*) FROM public.profiles),
  updated_at = now()
WHERE id = (SELECT id FROM public.site_stats LIMIT 1);