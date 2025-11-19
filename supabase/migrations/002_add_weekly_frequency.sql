-- Add weekly_frequency column to habits table
ALTER TABLE habits
ADD COLUMN IF NOT EXISTS weekly_frequency INTEGER;

-- Set default value of 1 for existing weekly habits
UPDATE habits
SET weekly_frequency = 1
WHERE type = 'weekly' AND weekly_frequency IS NULL;

-- Add constraint: weekly_frequency must be between 1 and 100, and only set for weekly habits
ALTER TABLE habits
ADD CONSTRAINT check_weekly_frequency CHECK (
  (type = 'daily' AND weekly_frequency IS NULL) OR
  (type = 'weekly' AND weekly_frequency IS NOT NULL AND weekly_frequency >= 1 AND weekly_frequency <= 100)
);

-- Drop the unique index that prevents multiple completions per day
-- This allows weekly habits to be completed multiple times per day
DROP INDEX IF EXISTS idx_habit_completions_habit_date;

-- Create a function to prevent duplicate daily habit completions
CREATE OR REPLACE FUNCTION prevent_duplicate_daily_completions()
RETURNS TRIGGER AS $$
DECLARE
  habit_type_val habit_type;
BEGIN
  -- Get the habit type
  SELECT type INTO habit_type_val
  FROM habits
  WHERE id = NEW.habit_id;

  -- Only check for duplicates if it's a daily habit
  IF habit_type_val = 'daily' THEN
    IF EXISTS (
      SELECT 1
      FROM habit_completions
      WHERE habit_id = NEW.habit_id
        AND extract_date_immutable(completed_at) = extract_date_immutable(NEW.completed_at)
        AND id != NEW.id
    ) THEN
      RAISE EXCEPTION 'Daily habit already completed on this date';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce uniqueness for daily habits only
CREATE TRIGGER trigger_prevent_duplicate_daily_completions
  BEFORE INSERT ON habit_completions
  FOR EACH ROW
  EXECUTE FUNCTION prevent_duplicate_daily_completions();

