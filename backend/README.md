# Sahayak AI - Spring Boot Backend

Production-ready REST API backend for **Sahayak AI** built with Java 17, Spring Boot 3.3.3, Spring Security 6 with JWT, and MongoDB.

---

## 🛠 Tech Stack

- **Language**: Java 17 (LTS)
- **Framework**: Spring Boot 3.3.3
- **Data Persistence**: Spring Data MongoDB
- **Security**: Spring Security 6 + JWT (io.jsonwebtoken:jjwt) + BCrypt password hashing
- **Validation**: Jakarta Bean Validation
- **Documentation**: Springdoc OpenAPI / Swagger UI 3.0
- **Database**: MongoDB (database name: `sahayak_ai`)

---

## 🚀 Quick Start

### 1. Prerequisites
- **Java 17+ JDK** (`java -version`)
- **Apache Maven 3.8+** (`mvn -version`)
- **MongoDB Community Server** running locally on port 27017 (`mongod --version`)

### 2. Environment Configuration
Copy `.env.example` to `.env` or set system environment variables:
```env
MONGODB_URI=mongodb://localhost:27017/sahayak_ai
JWT_SECRET=dGhpcy1pcy1hLXNlY3VyZS01MTItYml0LXNoYTI1Ni1zZWNyZXQta2V5LWZvci1zYWhheWFrLWFpLXByb2plY3Q=
JWT_EXPIRATION=86400000
FRONTEND_URL=http://localhost:5173
```

### 3. Build & Run
Run from the `backend/` directory:
```bash
mvn clean package -DskipTests
mvn spring-boot:run
```
Or execute the Windows launcher:
```cmd
run-backend.bat
```

The server will start at `http://localhost:8080`.

---

## 📖 API Documentation & Swagger UI

Interactive Swagger documentation is available once the server starts:
- **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI JSON**: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

---

## 🔑 Default Seed Users

On initial startup, `DataInitializer` seeds the following credentials into MongoDB:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Owner / Staff** | `owner@sahayak.ai` | `Password@123` | Case management, Dashboard KPIs, Emergency numbers |
| **Administrator** | `admin@sahayak.ai` | `Password@123` | Full system administration |
| **Citizen User** | `user@sahayak.ai` | `Password@123` | Case tracking, Emergency helplines, Assessment screening |

---

## 📡 REST Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register citizen or staff user (returns JWT)
- `POST /api/auth/login` — Sign in with email and password (returns JWT)
- `GET /api/auth/me` — Retrieve current authenticated user profile

### Cases (`/api/cases`)
- `GET /api/cases` — Get paginated cases with risk, status, and channel filters (Owner/Admin)
- `GET /api/cases/{id}` — Get single case details by Case ID
- `POST /api/cases` — Submit assessment for escalation (Public / Authenticated)
- `PATCH /api/cases/{id}/assign` — Assign case to a caseworker/counsellor (Owner/Admin)
- `POST /api/cases/{id}/notes` — Add a case progress note
- `PATCH /api/cases/{id}/escalate` — Escalate case for immediate human review
- `PATCH /api/cases/{id}/status` — Update case status (`open`, `assigned`, `in-review`, `closed`)
- `GET /api/cases/officers` — Get list of available counsellors and officers

### Emergency Helplines (`/api/emergency-numbers`)
- `GET /api/emergency-numbers` — Get verified national & regional helplines (Public)
- `GET /api/emergency-numbers/{id}` — Get helpline details by ID
- `POST /api/emergency-numbers` — Add emergency helpline (Owner/Admin)
- `PUT /api/emergency-numbers/{id}` — Update emergency helpline (Owner/Admin)
- `DELETE /api/emergency-numbers/{id}` — Remove emergency helpline (Owner/Admin)

### Operational Dashboard (`/api/dashboard`)
- `GET /api/dashboard/stats` — Live operational statistics, SVI distribution, and timeline buckets

### AI Chatbot (`/api/chat`)
- `POST /api/chat` — Trauma-informed AI assistant conversation endpoint
