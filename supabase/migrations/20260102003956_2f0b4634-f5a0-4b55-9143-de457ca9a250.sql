-- Add Razorpay gateway fields to profiles for authors
ALTER TABLE public.profiles 
ADD COLUMN razorpay_key_id TEXT,
ADD COLUMN razorpay_key_secret TEXT,
ADD COLUMN razorpay_setup_complete BOOLEAN NOT NULL DEFAULT false;

-- Update the existing RLS policy to allow users to update their Razorpay settings
-- (Already covered by "Users can update their own profile" policy)