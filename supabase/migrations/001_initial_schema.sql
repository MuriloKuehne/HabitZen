-- Create enum for habit type
CREATE TYPE habit_type AS ENUM ('daily', 'weekly');

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp INTEGER NOT NULL DEFAULT 0,
  current_level INTEGER NOT NULL DEFAULT 1,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create habits table
CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  type habit_type NOT NULL,
  color TEXT NOT NULL DEFAULT '#3b82f6',
  xp_value INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT check_xp_value CHECK (
    (type = 'daily' AND xp_value = 10) OR
    (type = 'weekly' AND xp_value = 50)
  )
);

-- Create habit_completions table
CREATE TABLE IF NOT EXISTS habit_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  xp_earned INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(habit_id, DATE(completed_at))
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_habit_id ON habit_completions(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_completed_at ON habit_completions(completed_at);
CREATE INDEX IF NOT EXISTS idx_habit_completions_habit_date ON habit_completions(habit_id, DATE(completed_at));

-- Function to calculate level from XP
CREATE OR REPLACE FUNCTION get_level_from_xp(total_xp INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN FLOOR(SQRT(total_xp / 100.0)) + 1;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to get XP needed for a level
CREATE OR REPLACE FUNCTION get_xp_for_level(level INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN POWER(level - 1, 2) * 100;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to update user stats when habit is completed
CREATE OR REPLACE FUNCTION calculate_xp_and_level()
RETURNS TRIGGER AS $$
DECLARE
  habit_xp INTEGER;
  new_total_xp INTEGER;
  new_level INTEGER;
BEGIN
  -- Get XP value from habit
  SELECT xp_value INTO habit_xp
  FROM habits
  WHERE id = NEW.habit_id;

  -- Update total XP
  UPDATE profiles
  SET total_xp = total_xp + habit_xp,
      updated_at = NOW()
  WHERE user_id = (SELECT user_id FROM habits WHERE id = NEW.habit_id)
  RETURNING total_xp INTO new_total_xp;

  -- Calculate new level
  new_level := get_level_from_xp(new_total_xp);

  -- Update level if changed
  UPDATE profiles
  SET current_level = new_level
  WHERE user_id = (SELECT user_id FROM habits WHERE id = NEW.habit_id)
    AND current_level < new_level;

  -- Update XP earned in completion
  NEW.xp_earned := habit_xp;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to recalculate stats when habit is uncompleted
CREATE OR REPLACE FUNCTION recalculate_user_stats()
RETURNS TRIGGER AS $$
DECLARE
  habit_xp INTEGER;
  new_total_xp INTEGER;
  new_level INTEGER;
BEGIN
  -- Get XP value from habit
  SELECT xp_value INTO habit_xp
  FROM habits
  WHERE id = OLD.habit_id;

  -- Recalculate total XP
  SELECT COALESCE(SUM(h.xp_value), 0) INTO new_total_xp
  FROM habit_completions hc
  JOIN habits h ON h.id = hc.habit_id
  WHERE h.user_id = (SELECT user_id FROM habits WHERE id = OLD.habit_id);

  -- Calculate level
  new_level := get_level_from_xp(new_total_xp);

  -- Update profile
  UPDATE profiles
  SET total_xp = new_total_xp,
      current_level = new_level,
      updated_at = NOW()
  WHERE user_id = (SELECT user_id FROM habits WHERE id = OLD.habit_id);

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate streak
CREATE OR REPLACE FUNCTION calculate_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  streak_count INTEGER := 0;
  current_date DATE := CURRENT_DATE;
  has_completion BOOLEAN;
BEGIN
  LOOP
    -- Check if user has any completion on this date
    SELECT EXISTS(
      SELECT 1
      FROM habit_completions hc
      JOIN habits h ON h.id = hc.habit_id
      WHERE h.user_id = p_user_id
        AND DATE(hc.completed_at) = current_date
    ) INTO has_completion;

    IF NOT has_completion THEN
      EXIT;
    END IF;

    streak_count := streak_count + 1;
    current_date := current_date - INTERVAL '1 day';
  END LOOP;

  RETURN streak_count;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update XP and level on completion
CREATE TRIGGER trigger_calculate_xp_and_level
  BEFORE INSERT ON habit_completions
  FOR EACH ROW
  EXECUTE FUNCTION calculate_xp_and_level();

-- Trigger to recalculate stats on uncompletion
CREATE TRIGGER trigger_recalculate_stats
  AFTER DELETE ON habit_completions
  FOR EACH ROW
  EXECUTE FUNCTION recalculate_user_stats();

-- Trigger to update streak on completion
CREATE OR REPLACE FUNCTION update_streak_on_completion()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id UUID;
  new_streak INTEGER;
BEGIN
  SELECT user_id INTO v_user_id
  FROM habits
  WHERE id = NEW.habit_id;

  new_streak := calculate_streak(v_user_id);

  UPDATE profiles
  SET current_streak = new_streak,
      longest_streak = GREATEST(longest_streak, new_streak),
      updated_at = NOW()
  WHERE user_id = v_user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_streak_on_completion
  AFTER INSERT ON habit_completions
  FOR EACH ROW
  EXECUTE FUNCTION update_streak_on_completion();

-- Trigger to update streak on uncompletion
CREATE OR REPLACE FUNCTION update_streak_on_uncompletion()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id UUID;
  new_streak INTEGER;
BEGIN
  SELECT user_id INTO v_user_id
  FROM habits
  WHERE id = OLD.habit_id;

  new_streak := calculate_streak(v_user_id);

  UPDATE profiles
  SET current_streak = new_streak,
      updated_at = NOW()
  WHERE user_id = v_user_id;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_streak_on_uncompletion
  AFTER DELETE ON habit_completions
  FOR EACH ROW
  EXECUTE FUNCTION update_streak_on_uncompletion();

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for habits
CREATE POLICY "Users can view own habits"
  ON habits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own habits"
  ON habits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habits"
  ON habits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own habits"
  ON habits FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for habit_completions
CREATE POLICY "Users can view own completions"
  ON habit_completions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM habits
      WHERE habits.id = habit_completions.habit_id
        AND habits.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own completions"
  ON habit_completions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM habits
      WHERE habits.id = habit_completions.habit_id
        AND habits.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own completions"
  ON habit_completions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM habits
      WHERE habits.id = habit_completions.habit_id
        AND habits.user_id = auth.uid()
    )
  );

