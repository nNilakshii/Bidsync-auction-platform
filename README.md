# Bidsync Auction Platform

Real-time auction prototype showcasing a React client, Spring Boot WebSocket backend, and PostgreSQL persistence. The project is structured as a multi-app workspace with separate `backend/` and `frontend/` packages.

## Prerequisites

- Java 21 (recommended via SDKMAN or asdf)
- Gradle wrapper (bundled)
- PostgreSQL 15+ running locally (`bidsync` database)
- Node.js 20.19+ and npm 10+

## Local Setup

### Backend

1. Create a PostgreSQL database:
	```bash
	createdb bidsync
	```
	The application reads credentials from environment variables. For local development the defaults are `postgres/postgres` on `localhost:5432`.
2. Start the Spring Boot service:
	```bash
	cd backend
	./gradlew bootRun --args='--spring.profiles.active=local'
	```

The backend publishes REST endpoints under `http://localhost:8080/api` and a STOMP WebSocket endpoint at `http://localhost:8080/ws`.

### Frontend

1. Install dependencies:
	```bash
	cd frontend
	npm install
	```
2. Run the Vite dev server:
	```bash
	npm run dev -- --host
	```

The UI expects the backend at `http://localhost:8080`. Configure different origins via `VITE_API_BASE_URL` and `VITE_WS_BASE_URL` in an `.env.local` file if needed.

## Key Directories

- `backend/src/main/java/com/bidsync/backend` – Spring Boot application code
- `backend/src/main/resources` – configuration profiles
- `frontend/src` – React components, pages, and API clients

## Deployment Notes

- Backend: target AWS Elastic Beanstalk or ECS Fargate with a managed PostgreSQL (RDS/Neon). Use Gradle `bootJar` to build artifacts.
- Frontend: deploy static build (`npm run build`) to GitHub Pages or S3 + CloudFront. Configure environment variables via build-time `.env` files.

Additional documentation (API contracts, infra diagrams, CI/CD workflows) should live alongside each app as the project evolves.