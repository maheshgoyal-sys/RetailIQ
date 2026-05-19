# RetailIQ Platform

A modular full-stack retail intelligence application with Spring Boot microservices, a React + Vite frontend, a Python ML service, MongoDB, and Kafka.

## Repository Structure

- `backend/`
  - `api-gateway/` — API gateway for routing requests to backend microservices.
  - `auth-service/` — authentication service with JWT support.
  - `customer-service/` — customer CRUD operations.
  - `segmentation-service/` — customer segmentation and cohort generation.
  - `lead-service/` — lead scoring and enrichment.
  - `campaign-service/` — campaign dispatch and campaign management.
- `frontend/` — React + Vite web UI.
- `ml-service/` — Python ML service for clustering/segmentation.
- `docker-compose.yml` — local development orchestration for all services, MongoDB, Kafka, and Zookeeper.

## Features

- Spring Boot microservices communicating via REST and Kafka.
- MongoDB as the primary data store.
- Kafka for messaging between services.
- Python ML service exposed over HTTP for clustering support.
- React frontend served in a container.
- All services can be started together using Docker Compose.

## Prerequisites

- Docker
- Docker Compose
- Git

> The project is designed to run inside containers, so no local Java or Python installation is required for compose-based development.

## Run Locally

From the repo root:

```bash
docker-compose up --build
```

This command builds and starts:

- `mongodb` on port `27017`
- `zookeeper` and `kafka` for messaging
- `ml-service` on port `5000`
- `auth-service` on port `8085`
- `customer-service` on port `8081`
- `segmentation-service` on port `8082`
- `lead-service` on port `8083`
- `campaign-service` on port `8084`
- `api-gateway` on port `8080`
- `frontend` on port `3000`

## Access the App

- Frontend UI: `http://localhost:3000`
- API Gateway: `http://localhost:8080`

## Useful Commands

Build and start in detached mode:

```bash
docker-compose up --build -d
```

Stop and remove containers:

```bash
docker-compose down
```

View logs for all services:

```bash
docker-compose logs -f
```

## Notes

- Environment variables for backend services are configured in `docker-compose.yml`.
- Each backend service has its own `Dockerfile` under `backend/*/`.
- The frontend is built from `frontend/Dockerfile`.

## Development

For frontend development inside the `frontend/` folder, run the normal Vite commands if you want hot reload locally.

```bash
cd frontend
npm install
npm run dev
```

For backend service development, open the relevant module under `backend/<service-name>`.
