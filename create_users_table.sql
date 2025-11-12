-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    email VARCHAR(255),
    full_name VARCHAR(255),
    INDEX idx_username (username)
);

-- NOTE: Users will be automatically created by the DataInitializer class on application startup
-- with properly BCrypt-encoded passwords. You don't need to manually insert users here.
-- 
-- Default users that will be created:
-- - admin / admin123 (ADMIN role)
-- - doctor / doctor123 (DOCTOR role)  
-- - nurse / nurse123 (NURSE role)
--
-- If you want to manually create users, make sure to use BCrypt encoding.
-- The application will create these users automatically if they don't exist.

