-- Fix handle_new_user function to explicitly use public.profiles schema
-- This prevents "relation profiles does not exist" errors when the trigger fires
-- The trigger runs in the auth schema context, so we need to qualify the table name

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id)
  VALUES (NEW.id);
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Profile already exists, which is fine (idempotent)
    RETURN NEW;
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    -- This ensures users can still be created even if profile creation fails
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

