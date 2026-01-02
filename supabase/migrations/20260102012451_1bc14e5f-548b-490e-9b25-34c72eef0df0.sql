-- Remove duplicate/legacy count triggers to avoid double increments/decrements
DO $$
BEGIN
  -- software
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_software_created_increment_count') THEN
    EXECUTE 'DROP TRIGGER on_software_created_increment_count ON public.software';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_software_deleted_decrement_count') THEN
    EXECUTE 'DROP TRIGGER on_software_deleted_decrement_count ON public.software';
  END IF;

  -- profiles
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_profile_created') THEN
    EXECUTE 'DROP TRIGGER on_profile_created ON public.profiles';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_profile_created_increment_count') THEN
    EXECUTE 'DROP TRIGGER on_profile_created_increment_count ON public.profiles';
  END IF;
END $$;

-- Ensure exactly one trigger exists for each counter
DROP TRIGGER IF EXISTS on_software_created ON public.software;
CREATE TRIGGER on_software_created
  AFTER INSERT ON public.software
  FOR EACH ROW EXECUTE FUNCTION public.increment_software_count();

DROP TRIGGER IF EXISTS on_software_deleted ON public.software;
CREATE TRIGGER on_software_deleted
  AFTER DELETE ON public.software
  FOR EACH ROW EXECUTE FUNCTION public.decrement_software_count();

DROP TRIGGER IF EXISTS on_user_created ON public.profiles;
CREATE TRIGGER on_user_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.increment_user_count();

-- Re-sync stats to ground truth
UPDATE public.site_stats 
SET 
  total_software = (SELECT COUNT(*) FROM public.software),
  total_users = (SELECT COUNT(*) FROM public.profiles),
  updated_at = now()
WHERE id = (SELECT id FROM public.site_stats LIMIT 1);