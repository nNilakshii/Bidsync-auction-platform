# Bidsync Auction Platform

Real-time USC community auction prototype showcasing a React client, Spring Boot WebSocket backend, and PostgreSQL persistence. The project is structured as a multi-app workspace with separate `backend/` and `frontend/` packages.

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
	The application reads credentials from environment variables. In production (Render) use the managed Postgres connection string; for local development you can still fall back to `postgres/postgres` on `localhost:5432`.
2. Start the Spring Boot service:
	```bash
	cd backend
	./gradlew bootRun --args='--spring.profiles.active=local'
	```

The backend publishes REST endpoints under `https://bidsync-auction-platform.onrender.com/api` and a STOMP WebSocket (SockJS) endpoint at `https://bidsync-auction-platform.onrender.com/ws`.

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

The UI now defaults to the production backend at `https://bidsync-auction-platform.onrender.com`; configure different origins via `VITE_API_BASE_URL` and `VITE_WS_BASE_URL` in an `.env.local` file if you are running locally.

### Quick Start Checklist

Use this end-to-end script the next time you need both services running locally. Commands assume macOS with Homebrew, `nvm`, and the repo root as the working directory.

```bash
# 1. Ensure Node 20.19+ is active (installs via nvm if missing)
if ! command -v nvm >/dev/null; then
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  source ~/.nvm/nvm.sh
fi
nvm install 20.19.0
nvm use 20.19.0

# 2. Start/ensure PostgreSQL 16 is running (install if needed)
brew list postgresql@16 >/dev/null 2>&1 || brew install postgresql@16
brew services start postgresql@16

# 3. Make sure the database and role exist
createuser -s postgres 2>/dev/null || true
psql -d postgres -c "ALTER USER postgres WITH PASSWORD 'postgres';"
createdb bidsync 2>/dev/null || true

# 4. Export backend environment variables for this shell
export SPRING_DATASOURCE_URL=<your-render-jdbc-url>
export SPRING_DATASOURCE_USERNAME=postgres
export SPRING_DATASOURCE_PASSWORD=postgres
export SPRING_PROFILES_ACTIVE=local

# 5. Start the backend (leave running)
cd backend
./gradlew bootRun --args='--spring.profiles.active=local'
```

Open a new terminal for the frontend:

```bash
# From the repo root
nvm use 20.19.0
cd frontend
rm -rf node_modules package-lock.json   # optional clean install
npm install
npm run dev -- --host
```

Once both servers print their “ready” messages, visit `http://localhost:5173` for the UI (or your deployed site) and use `curl https://bidsync-auction-platform.onrender.com/api/items` to verify the production API.

## Key Directories

- `backend/src/main/java/com/bidsync/backend` – Spring Boot application code
- `backend/src/main/resources` – configuration profiles
- `frontend/src` – React components, pages, and API clients

## Deployment Notes

- Backend: target AWS Elastic Beanstalk or ECS Fargate with a managed PostgreSQL (RDS/Neon). Use Gradle `bootJar` to build artifacts.
- Frontend: deploy static build (`npm run build`) to GitHub Pages or S3 + CloudFront. Configure environment variables via build-time `.env` files.

Additional documentation (API contracts, infra diagrams, CI/CD workflows) should live alongside each app as the project evolves.