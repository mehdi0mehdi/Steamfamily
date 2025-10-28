-- Create First Admin User
-- Replace 'your-email@example.com' with your actual email address

-- After you've signed up through the app, run this to make yourself an admin:
UPDATE profiles 
SET is_admin = TRUE 
WHERE email = 'your-email@example.com';

-- Verify admin status:
SELECT email, is_admin FROM profiles WHERE email = 'your-email@example.com';
