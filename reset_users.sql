-- Script to reset users table
-- This will delete existing users so the DataInitializer can recreate them with correct passwords

-- Delete all existing users
DELETE FROM users;

-- The application will automatically recreate default users on startup:
-- - admin / admin123 (ADMIN role)
-- - doctor / doctor123 (DOCTOR role)
-- - nurse / nurse123 (NURSE role)
--
-- Just restart your Spring Boot application after running this script.

