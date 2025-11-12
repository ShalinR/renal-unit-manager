# Authentication Debugging Guide

## Quick Fix Steps

### Step 1: Restart Your Spring Boot Application
The `DataInitializer` will automatically create/update users with correct passwords on startup.

### Step 2: Check if Users Were Created
After restarting, check your console for these messages:
```
✅ Created/Updated default admin user (username: admin, password: admin123)
✅ Created/Updated default doctor user (username: doctor, password: doctor123)
✅ Created/Updated default nurse user (username: nurse, password: nurse123)
```

### Step 3: Test User Creation (Optional)
You can use the test endpoint to verify users exist:
```
GET http://localhost:8081/api/test/users
```

Or check a specific user:
```
GET http://localhost:8081/api/test/check-user/admin
```

### Step 4: Try Login Again
Use these credentials:
- **Username:** `admin` / **Password:** `admin123`
- **Username:** `doctor` / **Password:** `doctor123`
- **Username:** `nurse` / **Password:** `nurse123`

## If Still Not Working

### Option 1: Reset Password via API
```
POST http://localhost:8081/api/test/reset-password/admin?newPassword=admin123
```

### Option 2: Delete and Recreate Users
Run this SQL:
```sql
DELETE FROM users;
```
Then restart the application.

### Option 3: Check Database Directly
```sql
SELECT username, role, enabled, 
       LENGTH(password) as pwd_length,
       SUBSTRING(password, 1, 4) as pwd_prefix
FROM users;
```

The password should:
- Start with `$2a$` (BCrypt format)
- Be 60 characters long

## Common Issues

1. **Users don't exist**: The DataInitializer should create them automatically
2. **Wrong password format**: Passwords must be BCrypt encoded (start with `$2a$`)
3. **User disabled**: Check that `enabled = true` in the database
4. **Wrong role format**: Roles should be uppercase (ADMIN, DOCTOR, NURSE)

## Test Endpoints Available

- `GET /api/test/users` - List all users
- `GET /api/test/check-user/{username}` - Check specific user details
- `POST /api/test/reset-password/{username}?newPassword=xxx` - Reset password
- `POST /api/test/create-test-user?username=xxx&password=xxx` - Create test user

