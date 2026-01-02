-- Recreate triggers to ensure they're attached
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

-- Sync stats with actual counts (fix negative values)
UPDATE public.site_stats 
SET 
  total_software = GREATEST(0, (SELECT COUNT(*) FROM public.software)),
  total_users = GREATEST(1, (SELECT COUNT(*) FROM public.profiles)),
  updated_at = now()
WHERE id = (SELECT id FROM public.site_stats LIMIT 1);