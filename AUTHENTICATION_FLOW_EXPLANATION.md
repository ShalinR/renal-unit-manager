# Authentication System - Complete Step-by-Step Explanation

## Overview
This application uses **JWT (JSON Web Token)** based authentication with Spring Security on the backend and React Context API on the frontend. The system follows a stateless authentication pattern where tokens are used to authenticate subsequent requests.

---

## Architecture Components

### Backend Components:
1. **AuthenticationController** - REST endpoint for login
2. **AuthenticationService** - Business logic for authentication
3. **UserDetailsServiceImpl** - Loads user details for Spring Security
4. **JwtTokenService** - Generates and validates JWT tokens
5. **JwtAuthenticationFilter** - Intercepts requests to validate tokens
6. **SecurityConfig** - Configures Spring Security rules

### Frontend Components:
1. **Login.tsx** - Login form component
2. **AuthContext.tsx** - Manages authentication state
3. **ProtectedRoute.tsx** - Route guard for protected pages
4. **api.ts** - Utility to add tokens to API requests

---

## Complete Authentication Flow

### PHASE 1: Initial Login Request (Frontend → Backend)

#### Step 1: User Submits Login Form
**File:** `frontend/src/pages/Login.tsx`

```typescript
// User enters username and password, clicks "Sign In"
const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  await login(username, password);  // Calls AuthContext login function
  navigate("/ward-management");
}
```

#### Step 2: AuthContext Makes API Call
**File:** `frontend/src/context/AuthContext.tsx` (lines 50-113)

```typescript
const login = async (username: string, password: string) => {
  // Makes POST request to backend
  const response = await fetch("http://localhost:8081/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
}
```

**What happens:**
- Creates HTTP POST request to `/api/auth/login`
- Sends username and password as JSON in request body
- No authentication token needed (login endpoint is public)

---

### PHASE 2: Backend Receives Login Request

#### Step 3: Request Reaches AuthenticationController
**File:** `backend/renal/src/main/java/com/peradeniya/renal/controller/AuthenticationController.java`

```java
@PostMapping("/login")
public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
    LoginResponse response = authenticationService.authenticate(loginRequest);
    return ResponseEntity.ok(response);
}
```

**What happens:**
- Spring receives POST request at `/api/auth/login`
- `@Valid` annotation validates the request (checks username/password are not blank)
- Request body is deserialized into `LoginRequest` DTO
- Delegates to `AuthenticationService.authenticate()`

**Security Note:** This endpoint is **publicly accessible** (configured in `SecurityConfig.java` line 39: `.requestMatchers("/api/auth/**").permitAll()`)

#### Step 4: AuthenticationService Processes Login
**File:** `backend/renal/src/main/java/com/peradeniya/renal/service/AuthenticationService.java`

**Step 4a: Check User Exists**
```java
User user = userRepository.findByUsername(loginRequest.getUsername())
    .orElseThrow(() -> new RuntimeException("User not found"));
```

**Step 4b: Check User is Enabled**
```java
if (!user.getEnabled()) {
    throw new RuntimeException("User account is disabled");
}
```

**Step 4c: Authenticate Credentials**
```java
authenticationManager.authenticate(
    new UsernamePasswordAuthenticationToken(
        loginRequest.getUsername(),
        loginRequest.getPassword()
    )
);
```

**What happens here:**
- Spring's `AuthenticationManager` is called
- It uses `UserDetailsService` (implemented by `UserDetailsServiceImpl`) to load user
- Compares provided password with stored BCrypt-hashed password
- Throws `BadCredentialsException` if password doesn't match

#### Step 5: UserDetailsService Loads User Details
**File:** `backend/renal/src/main/java/com/peradeniya/renal/service/UserDetailsServiceImpl.java`

```java
@Override
public UserDetails loadUserByUsername(String username) {
    User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    
    return User.builder()
        .username(user.getUsername())
        .password(user.getPassword())  // BCrypt hashed password
        .authorities(getAuthorities(user.getRole()))  // Converts role to "ROLE_ADMIN", etc.
        .disabled(!user.getEnabled())
        .build();
}
```

**What happens:**
- Loads user from database
- Converts `User` entity to Spring Security's `UserDetails` object
- Maps role (e.g., "ADMIN") to authority (e.g., "ROLE_ADMIN")
- Returns user details for password comparison

**Password Verification:**
- Spring Security automatically compares the plain-text password from login request
- With the BCrypt-hashed password from database
- Using `BCryptPasswordEncoder` (configured in `SecurityConfig.java` line 67-69)

#### Step 6: Generate JWT Token
**File:** `backend/renal/src/main/java/com/peradeniya/renal/service/AuthenticationService.java` (line 53)

```java
UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getUsername());
String token = jwtTokenService.generateToken(userDetails);
```

**JWT Token Generation Details:**
**File:** `backend/renal/src/main/java/com/peradeniya/renal/service/JwtTokenService.java`

```java
public String generateToken(UserDetails userDetails) {
    Map<String, Object> claims = new HashMap<>();
    return createToken(claims, userDetails.getUsername());
}

private String createToken(Map<String, Object> claims, String subject) {
    return Jwts.builder()
        .claims(claims)
        .subject(subject)  // Username
        .issuedAt(new Date(System.currentTimeMillis()))
        .expiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY))  // 24 hours
        .signWith(getSigningKey())  // HMAC SHA-256 with secret key
        .compact();
}
```

**Token Contents:**
- **Subject:** Username
- **Issued At:** Current timestamp
- **Expiration:** 24 hours from now
- **Signature:** Signed with secret key (HMAC SHA-256)

#### Step 7: Build Login Response
**File:** `backend/renal/src/main/java/com/peradeniya/renal/service/AuthenticationService.java` (lines 55-61)

```java
return new LoginResponse(
    token,              // JWT token
    user.getUsername(),
    user.getRole(),     // ADMIN, DOCTOR, NURSE
    user.getFullName(),
    "Login successful"
);
```

**LoginResponse Structure:**
```java
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "username": "admin",
    "role": "ADMIN",
    "fullName": "Administrator",
    "message": "Login successful"
}
```

---

### PHASE 3: Frontend Receives Response

#### Step 8: AuthContext Processes Response
**File:** `frontend/src/context/AuthContext.tsx` (lines 72-90)

```typescript
const data = await response.json();

// Validate response
if (!data.token || !data.username) {
    throw new Error("Invalid response from server");
}

const userData: User = {
    username: data.username,
    role: data.role,
    fullName: data.fullName,
    token: data.token,
};

// Store in localStorage
localStorage.setItem("token", data.token);
localStorage.setItem("user", JSON.stringify(userData));

setUser(userData);  // Update React state
```

**What happens:**
- Parses JSON response from backend
- Validates that token and username are present
- Stores token and user data in `localStorage` (persists across page refreshes)
- Updates React state with user data
- Shows success toast notification

#### Step 9: User Redirected to Dashboard
**File:** `frontend/src/pages/Login.tsx` (line 34)

```typescript
await login(username, password);
navigate("/ward-management", { replace: true });  // Redirect to protected route
```

---

### PHASE 4: Subsequent API Requests (Token-Based Authentication)

#### Step 10: Frontend Makes Authenticated Request
**File:** `frontend/src/lib/api.ts`

```typescript
export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();  // Gets token from localStorage
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;  // Adds token to header
  }

  return fetch(url, { ...options, headers });
};
```

**Example Request:**
```
GET /api/patients
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Step 11: JWT Filter Intercepts Request
**File:** `backend/renal/src/main/java/com/peradeniya/renal/filter/JwtAuthenticationFilter.java`

**Step 11a: Extract Token from Header**
```java
final String requestTokenHeader = request.getHeader("Authorization");

// JWT Token is in the form "Bearer token"
if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
    jwtToken = requestTokenHeader.substring(7);  // Remove "Bearer " prefix
    username = jwtTokenService.getUsernameFromToken(jwtToken);
}
```

**Step 11b: Validate Token**
```java
if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
    UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
    
    // Validate token signature and expiration
    if (jwtTokenService.validateToken(jwtToken, userDetails)) {
        // Set authentication in Spring Security context
        UsernamePasswordAuthenticationToken authToken = 
            new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authToken);
    }
}
```

**Token Validation Process:**
**File:** `backend/renal/src/main/java/com/peradeniya/renal/service/JwtTokenService.java`

```java
public Boolean validateToken(String token, UserDetails userDetails) {
    final String username = getUsernameFromToken(token);
    return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
}

private Boolean isTokenExpired(String token) {
    final Date expiration = getExpirationDateFromToken(token);
    return expiration.before(new Date());
}
```

**What happens:**
1. Extracts username from token
2. Checks if token is expired (compares expiration date with current time)
3. Verifies username in token matches username from database
4. Validates token signature (ensures token wasn't tampered with)

#### Step 12: Spring Security Checks Authorization
**File:** `backend/renal/src/main/java/com/peradeniya/renal/config/SecurityConfig.java`

```java
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/auth/**").permitAll()  // Public endpoints
    .anyRequest().authenticated()  // All other endpoints require authentication
)
```

**What happens:**
- If token is valid, `SecurityContext` contains authenticated user
- Request proceeds to the controller
- If token is invalid/expired, Spring Security returns 401 Unauthorized

---

### PHASE 5: Protected Routes (Frontend)

#### Step 13: ProtectedRoute Component Guards Routes
**File:** `frontend/src/components/ProtectedRoute.tsx`

```typescript
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <FullPageSpinner />;  // Show loading while checking auth
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;  // Redirect to login if not authenticated
  }

  return <>{children}</>;  // Render protected content
};
```

**What happens:**
- On app load, `AuthContext` checks `localStorage` for token (lines 33-48)
- If token exists, user is considered authenticated
- If no token, user is redirected to login page

---

## Security Features

### 1. Password Hashing
- Passwords are stored using **BCrypt** hashing algorithm
- Never stored in plain text
- One-way encryption (cannot be reversed)

### 2. JWT Token Security
- Tokens are **signed** with a secret key (HMAC SHA-256)
- Tokens have **expiration** (24 hours)
- Tokens contain username but not password
- Signature prevents tampering

### 3. Stateless Authentication
- No server-side session storage
- All authentication info is in the JWT token
- Scalable (works across multiple servers)

### 4. CORS Configuration
- Only allows requests from `http://localhost:5173` (frontend)
- Prevents unauthorized cross-origin requests

### 5. Route Protection
- Backend: All endpoints except `/api/auth/**` require authentication
- Frontend: `ProtectedRoute` component guards routes

---

## Error Handling

### Login Failures:

1. **User Not Found**
   - Backend throws: `RuntimeException("User not found")`
   - Frontend shows: "Invalid username or password"

2. **Wrong Password**
   - Backend throws: `BadCredentialsException`
   - Frontend shows: "Invalid username or password"

3. **User Disabled**
   - Backend throws: `RuntimeException("User account is disabled")`
   - Frontend shows: "Authentication failed: User account is disabled"

4. **Network Error**
   - Frontend catches: `Failed to fetch`
   - Frontend shows: "Cannot connect to server. Please ensure the backend is running"

5. **Invalid Token**
   - Backend: `JwtAuthenticationFilter` fails validation
   - Returns: 401 Unauthorized
   - Frontend: User redirected to login

---

## Token Lifecycle

1. **Token Generation:** Created during login, valid for 24 hours
2. **Token Storage:** Stored in browser `localStorage`
3. **Token Usage:** Sent in `Authorization: Bearer <token>` header for all API requests
4. **Token Validation:** Validated on every request by `JwtAuthenticationFilter`
5. **Token Expiration:** After 24 hours, user must login again
6. **Token Revocation:** Logout removes token from `localStorage` (but token remains valid until expiration)

---

## Key Files Summary

| File | Purpose |
|------|---------|
| `Login.tsx` | Login form UI |
| `AuthContext.tsx` | Frontend authentication state management |
| `ProtectedRoute.tsx` | Route guard component |
| `api.ts` | Adds JWT token to API requests |
| `AuthenticationController.java` | Login REST endpoint |
| `AuthenticationService.java` | Login business logic |
| `UserDetailsServiceImpl.java` | Loads user for Spring Security |
| `JwtTokenService.java` | Generates/validates JWT tokens |
| `JwtAuthenticationFilter.java` | Validates tokens on each request |
| `SecurityConfig.java` | Spring Security configuration |

---

## Testing the Flow

### 1. Test Login:
```bash
POST http://localhost:8081/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### 2. Test Protected Endpoint:
```bash
GET http://localhost:8081/api/patients
Authorization: Bearer <token-from-login>
```

### 3. Test Token Validation:
```bash
GET http://localhost:8081/api/auth/validate
Authorization: Bearer <token>
```

---

## Common Issues & Solutions

1. **"User not found"** → Check user exists in database
2. **"Invalid username or password"** → Verify password is correct (BCrypt hashed)
3. **"Token is valid" but 401 error** → Check token format: `Bearer <token>`
4. **CORS errors** → Verify frontend URL matches `SecurityConfig` CORS settings
5. **Token expired** → User must login again (tokens expire after 24 hours)

---

This authentication system provides secure, stateless authentication suitable for a clinical application managing sensitive patient data.


