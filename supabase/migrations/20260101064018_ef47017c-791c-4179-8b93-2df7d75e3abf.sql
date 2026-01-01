-- Create stats table for tracking counts
CREATE TABLE public.site_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  total_users integer NOT NULL DEFAULT 0,
  total_software integer NOT NULL DEFAULT 0,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Insert initial stats row
INSERT INTO public.site_stats (id, total_users, total_software) 
VALUES (gen_random_uuid(), 0, 0);

-- Enable RLS
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

-- Everyone can read stats
CREATE POLICY "Anyone can view stats" ON public.site_stats
FOR SELECT USING (true);

-- Only system (via triggers) can update stats - no direct user updates
CREATE POLICY "Only owner can update stats" ON public.site_stats
FOR UPDATE USING (public.has_role(auth.uid(), 'owner'));

-- Create software table
CREATE TABLE public.software (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  version text,
  platforms text[] NOT NULL DEFAULT '{}',
  download_link text,
  is_paid boolean NOT NULL DEFAULT false,
  price numeric(10,2),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.software ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view software" ON public.software
FOR SELECT USING (true);

CREATE POLICY "Users can create their own software" ON public.software
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own software" ON public.software
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own software or admins/owner" ON public.software
FOR DELETE USING (
  auth.uid() = user_id OR 
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'owner')
);

-- Create news table
CREATE TABLE public.news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  excerpt text,
  content text,
  category text NOT NULL DEFAULT 'Announcement',
  image_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view news" ON public.news
FOR SELECT USING (true);

CREATE POLICY "Admins and owner can create news" ON public.news
FOR INSERT WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'owner')
);

CREATE POLICY "Admins and owner can update news" ON public.news
FOR UPDATE USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'owner')
);

CREATE POLICY "Admins and owner can delete news" ON public.news
FOR DELETE USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'owner')
);

-- Create comments table
CREATE TABLE public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comments" ON public.comments
FOR SELECT USING (true);

CREATE POLICY "Users can create their own comments" ON public.comments
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON public.comments
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments or admins/owner" ON public.comments
FOR DELETE USING (
  auth.uid() = user_id OR 
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'owner')
);

-- Create requests table
CREATE TABLE public.requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  software_name text NOT NULL,
  description text,
  platform text,
  upvotes integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view requests" ON public.requests
FOR SELECT USING (true);

CREATE POLICY "Users can create their own requests" ON public.requests
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own requests" ON public.requests
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own requests or admins/owner" ON public.requests
FOR DELETE USING (
  auth.uid() = user_id OR 
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'owner')
);

-- Create reports table
CREATE TABLE public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  issue_type text NOT NULL,
  subject text NOT NULL,
  related_url text,
  description text NOT NULL,
  contact_email text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reports or admins/owner" ON public.reports
FOR SELECT USING (
  auth.uid() = user_id OR 
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'owner')
);

CREATE POLICY "Users can create their own reports" ON public.reports
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports or admins/owner" ON public.reports
FOR UPDATE USING (
  auth.uid() = user_id OR 
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'owner')
);

CREATE POLICY "Users can delete their own reports or admins/owner" ON public.reports
FOR DELETE USING (
  auth.uid() = user_id OR 
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'owner')
);

-- Function to increment user count on signup
CREATE OR REPLACE FUNCTION public.increment_user_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.site_stats SET total_users = total_users + 1, updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger to increment user count when a new profile is created
CREATE TRIGGER on_profile_created_increment_count
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_user_count();

-- Function to increment software count
CREATE OR REPLACE FUNCTION public.increment_software_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.site_stats SET total_software = total_software + 1, updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger to increment software count when new software is uploaded
CREATE TRIGGER on_software_created_increment_count
  AFTER INSERT ON public.software
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_software_count();

-- Function to decrement software count on delete
CREATE OR REPLACE FUNCTION public.decrement_software_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.site_stats SET total_software = total_software - 1, updated_at = now();
  RETURN OLD;
END;
$$;

-- Trigger to decrement software count when software is deleted
CREATE TRIGGER on_software_deleted_decrement_count
  AFTER DELETE ON public.software
  FOR EACH ROW
  EXECUTE FUNCTION public.decrement_software_count();

-- Add updated_at triggers to new tables
CREATE TRIGGER update_software_updated_at
  BEFORE UPDATE ON public.software
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON public.news
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_requests_updated_at
  BEFORE UPDATE ON public.requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();