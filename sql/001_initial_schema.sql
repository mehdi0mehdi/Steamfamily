-- Steam Family Database Schema Migration
-- Run this in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
-- Stores user profile information with admin flag
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tools table
-- Stores gaming tools/utilities information
CREATE TABLE IF NOT EXISTS tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  download_url TEXT NOT NULL,
  mirror_url TEXT,
  donate_url TEXT,
  telegram_url TEXT,
  version TEXT NOT NULL,
  downloads INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reviews table
-- Stores user reviews and ratings for tools
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  body TEXT NOT NULL CHECK (length(body) >= 10 AND length(body) <= 2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tool_id, user_id) -- One review per user per tool
);

-- Downloads log table
-- Tracks download events for analytics
CREATE TABLE IF NOT EXISTS downloads_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indices for better query performance
CREATE INDEX IF NOT EXISTS idx_tools_slug ON tools(slug);
CREATE INDEX IF NOT EXISTS idx_tools_visible ON tools(visible);
CREATE INDEX IF NOT EXISTS idx_reviews_tool_id ON reviews(tool_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_log_tool_id ON downloads_log(tool_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads_log ENABLE ROW LEVEL SECURITY;

-- Profiles policies
-- Anyone can read profiles (for displaying review authors)
CREATE POLICY "Profiles are viewable by everyone" 
  ON profiles FOR SELECT 
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Tools policies
-- Everyone can view visible tools
CREATE POLICY "Visible tools are viewable by everyone" 
  ON tools FOR SELECT 
  USING (visible = true OR (SELECT is_admin FROM profiles WHERE id = auth.uid()));

-- Admin panel visible only to admins — implementer: ensure Supabase RLS/policies protect admin writes.
-- Only admins can insert tools
CREATE POLICY "Only admins can insert tools" 
  ON tools FOR INSERT 
  WITH CHECK ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = true);

-- Only admins can update tools
CREATE POLICY "Only admins can update tools" 
  ON tools FOR UPDATE 
  USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = true);

-- Only admins can delete tools
CREATE POLICY "Only admins can delete tools" 
  ON tools FOR DELETE 
  USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = true);

-- Reviews policies
-- Everyone can read reviews
CREATE POLICY "Reviews are viewable by everyone" 
  ON reviews FOR SELECT 
  USING (true);

-- Linkless reviews: client uses regex /(https?:\/\/|www\.)/i to reject URLs. Server policies also reject them.
-- Only authenticated users can insert reviews (with URL and bad word checks)
CREATE POLICY "Authenticated users can insert reviews" 
  ON reviews FOR INSERT 
  WITH CHECK (
    auth.uid() IS NOT NULL 
    AND auth.uid() = user_id
    AND NOT body ~* '(https?://|www\.)'  -- Reject URLs
    AND length(body) >= 10 
    AND length(body) <= 2000
    AND rating >= 1 
    AND rating <= 5
  );

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews" 
  ON reviews FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (
    NOT body ~* '(https?://|www\.)'  -- Reject URLs
    AND length(body) >= 10 
    AND length(body) <= 2000
    AND rating >= 1 
    AND rating <= 5
  );

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews" 
  ON reviews FOR DELETE 
  USING (auth.uid() = user_id);

-- Downloads log policies
-- Anyone can insert download logs (including anonymous users)
CREATE POLICY "Anyone can insert download logs" 
  ON downloads_log FOR INSERT 
  WITH CHECK (true);

-- Only the user who created the log can view it (or admins)
CREATE POLICY "Users can view own download logs" 
  ON downloads_log FOR SELECT 
  USING (
    user_id = auth.uid() 
    OR (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
  );

-- Function to increment download count
CREATE OR REPLACE FUNCTION increment_downloads(tool_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE tools
  SET downloads = downloads + 1
  WHERE id = tool_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, is_admin)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    FALSE
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signups
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
