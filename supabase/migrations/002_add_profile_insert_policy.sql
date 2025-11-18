-- Add INSERT policy for profiles table
-- This allows users to create their own profile if it doesn't exist
CREATE POLICY "Users can create own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

