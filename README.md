# E-Commerce Assignment

This is my full-stack e-commerce application for the assignment. It has React frontend and Spring Boot backend with JWT authentication and Google OAuth2.

## Project Overview

I built this using React for the frontend and Spring Boot for the backend. The app has user authentication with JWT tokens and also supports Google OAuth2 login. Users can register, login, and manage products. Admin users can create/update/delete products while regular users can only view them.

**Technologies used:**
- Frontend: React, React Router, Axios
- Backend: Spring Boot, Spring Security, JWT, OAuth2
- Database: MySQL with JPA/Hibernate
- Other: Lombok, BCrypt

**Main features:**
- User registration and login
- Google OAuth2 SSO
- Product management (CRUD)
- Role-based access control (Admin/User)
- JWT token authentication
- User profile management

## Setup Steps

### Prerequisites
- Java 17+
- Maven 3.6+
- Node.js 16+
- MySQL 8.0+

### Database Setup
First set up the database using the SQL scripts:

```bash
mysql -u root -p < database/ddl_create_tables.sql
mysql -u root -p < database/dml_insert_data.sql
```

This creates the database and adds demo users:
- admin/password (Admin role)
- user/password (User role)

### Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs on http://localhost:8080

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

Frontend runs on http://localhost:3000

## API Details

### Authentication APIs

**POST /api/auth/login**
```json
{
  "username": "admin",
  "password": "password"
}
```

**POST /api/auth/register**
```json
{
  "username": "newuser",
  "password": "password123",
  "email": "user@example.com"
}
```

**GET /api/auth/me**
Gets current user info (needs JWT token in header)

### Product APIs

**GET /api/products** - Get all products (authenticated users)

**POST /api/products** - Create product (Admin only)
```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99
}
```

**PUT /api/products/{id}** - Update product (Admin only)

**DELETE /api/products/{id}** - Delete product (Admin only)

### User APIs

**GET /api/profile** - Get user profile

**PUT /api/profile** - Update user profile
```json
{
  "email": "updated@example.com"
}
```

**PUT /api/change-password** - Change password
```json
{
  "oldPassword": "oldpass",
  "newPassword": "newpass"
}
```

## SSO Configuration

### Google OAuth2 Setup

1. Go to Google Cloud Console
2. Create new project
3. Enable Google+ API
4. Create OAuth2 Client ID (Web application)
5. Add redirect URI: http://localhost:8080/api/login/oauth2/code/google
6. Copy Client ID and Client Secret

### Configuration
Update application.yml with your Google credentials:

```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: your-google-client-id
            client-secret: your-google-client-secret
            scope: profile,email
            redirect-uri: http://localhost:8080/api/login/oauth2/code/google
```

Or set environment variables:
```bash
export GOOGLE_CLIENT_ID=your-google-client-id
export GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### How OAuth2 works
1. User clicks "Login with Google"
2. Redirects to Google for authentication
3. Google redirects back with authorization code
4. Spring Security exchanges code for user info
5. If user doesn't exist, creates new account with USER role
6. Generates JWT token and redirects to frontend

## Demo Users

**Admin User**
- Username: admin
- Password: password
- Can manage products

**Regular User**
- Username: user
- Password: password
- Can only view products
