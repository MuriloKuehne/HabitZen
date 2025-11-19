export type HabitType = "daily" | "weekly";

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  type: HabitType;
  color: string;
  xp_value: number;
  weekly_frequency: number | null;
  created_at: string;
  updated_at: string;
}

export interface HabitCompletion {
  id: string;
  habit_id: string;
  completed_at: string;
  xp_earned: number;
  created_at: string;
}

export interface Profile {
  user_id: string;
  total_xp: number;
  current_level: number;
  current_streak: number;
  longest_streak: number;
  created_at: string;
  updated_at: string;
}

export interface HabitWithCompletions extends Habit {
  completions?: HabitCompletion[];
  isCompletedToday?: boolean;
  weeklyProgress?: {
    current: number;
    target: number;
    isCompleted: boolean;
  };
}

