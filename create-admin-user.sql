-- Create admin user with verified email and password
-- This uses Supabase's auth extension functions

-- First, ensure the user exists in admin_users (already done)
INSERT INTO public.admin_users (email, role) 
VALUES ('phinehasmadams@icloud.com', 'super_admin') 
ON CONFLICT (email) DO UPDATE SET role = 'super_admin';

-- Create auth user using Supabase's auth extension
-- Note: Password will be 'Admin123!' - change this after first login
DO $$
DECLARE
  user_id uuid;
  password_hash text;
BEGIN
  -- Check if user already exists
  SELECT id INTO user_id FROM auth.users WHERE email = 'phinehasmadams@icloud.com';
  
  IF user_id IS NULL THEN
    -- Create new user
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      confirmation_sent_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'phinehasmadams@icloud.com',
      crypt('Admin123!', gen_salt('bf')),
      now(),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    ) RETURNING id INTO user_id;
    
    RAISE NOTICE 'User created with ID: %', user_id;
  ELSE
    -- Update existing user to verify email and set password
    UPDATE auth.users 
    SET 
      email_confirmed_at = now(),
      encrypted_password = crypt('Admin123!', gen_salt('bf')),
      updated_at = now()
    WHERE id = user_id;
    
    RAISE NOTICE 'User updated: %', user_id;
  END IF;
END $$;
