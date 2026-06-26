# RetailIQ Project Documentation

## 1. Project Overview

RetailIQ is a modular retail intelligence platform built as a small microservice ecosystem. It combines:
- A React + Vite frontend web dashboard
- Spring Boot backend microservices for authentication, customers, segmentation, leads, and campaigns
- A Python ML service for customer clustering and segment generation
- MongoDB as the primary database for each backend service
- Kafka for asynchronous event notification between services
- An API gateway to route and secure requests

The platform is intended to help marketing users view customer details, generate customer segments, score leads, and manage campaign workflows.

## 2. Tech Stack

### Backend
- Java 17
- Spring Boot 3.2.x
- Spring Data MongoDB
- Spring Cloud Gateway
- Spring Security / JWT
- Spring Kafka
- Maven build system with a parent POM in `backend/pom.xml`

### Frontend
- React 19
- Vite
- Tailwind CSS
- Axios
- React Router Dom
- React Hook Form
- React Query

### ML Service
- Python 3 (Flask)
- Custom K-Means clustering implementation

### Infrastructure
- Docker and Docker Compose
- MongoDB
- Apache Kafka + Zookeeper

## 3. Folder Structure Breakdown

```
Project_3/
├── backend/
│   ├── api-gateway/             # Spring Cloud Gateway routes and JWT filter
│   ├── auth-service/            # Authentication, registration, login, JWT tokens
│   ├── customer-service/        # Customer CRUD, search, pagination, CSV import, Kafka events
│   ├── segmentation-service/    # Customer segmentation orchestration, ML service integration
│   ├── lead-service/            # Lead generation and Kafka-driven updates
│   ├── campaign-service/        # Campaign management and dispatch logic
│   ├── mvnw, mvnw.cmd, pom.xml  # Maven wrapper and parent pom
├── frontend/                    # React UI code, components, pages, API integration
├── ml-service/                  # Python Flask ML service for customer segment clustering
├── docker-compose.yml           # Local development orchestration for services, MongoDB, Kafka, frontend
├── README.md                    # Short project summary and quick start
└── PROJECT_DOCUMENTATION.md     # This longer documentation guide
```

### backend/
- Contains a multi-module Maven project.
- `pom.xml` at root is the parent POM and defines shared dependencies, Java version, and modules.
- Each service has its own `pom.xml`, `Dockerfile`, Java source, and configuration.

### frontend/
- React application powered by Vite.
- Contains UI pages, shared components and API wrapper functions.
- Uses `package.json` for packages and scripts.

### ml-service/
- A simple Flask application exposing an HTTP endpoint at `/ml/segment`.
- Implements K-Means clustering in Python.

## 4. Important Files and What They Do

### Root Files
- `docker-compose.yml` - orchestrates all services, database, Kafka, and frontend.
- `README.md` - quick overview and commands.
- `PROJECT_DOCUMENTATION.md` - detailed architecture and developer guide.

### Backend Files
- `backend/pom.xml` - Maven parent POM controlling Java version, shared dependencies, and modules.

#### api-gateway
- `backend/api-gateway/src/main/resources/application.yml` - gateway routing and CORS configuration.
- `backend/api-gateway/src/main/java/com/retailiq/gateway/filter/GatewayJwtFilter.java` - validates JWTs and injects user headers downstream.
- `backend/api-gateway/src/main/java/com/retailiq/gateway/config/GatewaySecurityConfig.java` - configures Spring WebFlux security.
- `backend/api-gateway/src/main/java/com/retailiq/gateway/GatewayApplication.java` - gateway entry point.

#### auth-service
- `backend/auth-service/src/main/java/com/retailiq/auth/controller/AuthController.java` - handles `/api/auth/register`, `/api/auth/login`, `/api/auth/refresh-token`.
- `backend/auth-service/src/main/resources/application.yml` - MongoDB + JWT config.

#### customer-service
- `backend/customer-service/src/main/java/com/retailiq/customer/controller/CustomerController.java` - customer CRUD endpoints and CSV bulk import.
- `backend/customer-service/src/main/java/com/retailiq/customer/service/CustomerService.java` - business logic, MongoDB queries, Kafka events.
- `backend/customer-service/src/main/resources/application.yml` - MongoDB + Kafka config.

#### segmentation-service
- `backend/segmentation-service/src/main/java/com/retailiq/segmentation/controller/SegmentationController.java` - endpoints for segments and segmentation jobs.
- `backend/segmentation-service/src/main/java/com/retailiq/segmentation/service/SegmentationService.java` - orchestrates customer fetch, ML service call, segment saving, event dispatch.
- `backend/segmentation-service/src/main/resources/application.yml` - MongoDB, Kafka, ML service URL, and customer service URL.

#### lead-service and campaign-service
- `backend/lead-service/src/main/resources/application.yml` - connects to MongoDB, Kafka consumer, and other backend URLs.
- `backend/campaign-service/src/main/resources/application.yml` - connects to MongoDB, Kafka, and segmentation service.

### Frontend Files
- `frontend/src/main.jsx` - React app bootstrap.
- `frontend/src/App.jsx` - route definitions and private route guard.
- `frontend/src/services/api.js` - Axios instance, JWT injection, public / guest fallback behavior.
- `frontend/src/components/Sidebar.jsx` - navigation menu.
- `frontend/src/pages/*` - individual pages: `Login`, `Dashboard`, `Customers`, `Segments`, `Leads`, `Campaigns`, `RunMl`.

### ML Service File
- `ml-service/app.py` - Flask app with `/ml/segment` and `/health`. Implements the clustering logic.

## 5. How the Project Works Step-by-Step

### Startup Flow
1. `docker-compose up --build` starts:
   - `mongodb`
   - `zookeeper`
   - `kafka`
   - `ml-service`
   - `auth-service`
   - `customer-service`
   - `segmentation-service`
   - `lead-service`
   - `campaign-service`
   - `api-gateway`
   - `frontend`
2. Each backend service starts on its port using Spring Boot.
3. The API gateway runs on `http://localhost:8080` and forwards requests to services.
4. The frontend runs on `http://localhost:3000` and talks only to the API gateway.

### User Request to Final Output
1. User opens the app in the browser and logs in via the frontend.
2. Frontend stores JWT in `localStorage` and adds it to every request.
3. User clicks a page, e.g. `Customers`.
4. Frontend calls API Gateway at `/api/customers`.
5. Gateway JWT filter validates the token and passes user headers.
6. Gateway forwards request to `customer-service`.
7. `customer-service` fetches data from MongoDB and returns JSON.
8. Frontend receives the JSON and renders the table.

## 6. Backend Logic Flow

### Request Routing
- All frontend API calls go through `api-gateway` at `http://localhost:8080/api/*`.
- Route mapping in `backend/api-gateway/src/main/resources/application.yml`:
  - `/api/auth/**` -> auth-service
  - `/api/customers/**` -> customer-service
  - `/api/segments/**` -> segmentation-service
  - `/api/leads/**` -> lead-service
  - `/api/campaigns/**` -> campaign-service

### Security and Headers
- `GatewayJwtFilter` checks `Authorization: Bearer <token>`.
- Public auth paths are allowed without JWT.
- Valid tokens are decoded and user identity headers are attached:
  - `X-User-Id`
  - `X-User-Name`
  - `X-User-Roles`

### Customer Service Flow
- `CustomerController` defines REST endpoints under `/api/customers`.
- `CustomerService` performs business logic:
  - Query with optional filters: city, gender, search, pagination
  - Save or update customers
  - Delete customers
  - Bulk import customers from CSV
  - Emit Kafka events for create/update/delete using topic `customer-events`

### Segmentation Service Flow
- `SegmentationController` exposes:
  - `GET /api/segments`
  - `GET /api/segments/{id}`
  - `GET /api/segments/summary`
  - `POST /api/segments/run`
- `SegmentationService.runSegmentationJob()` does:
  1. Fetch customers from `customer-service`.
  2. Call Python ML service at `/ml/segment`.
  3. Map returned segment labels to customer records.
  4. Update each customer via `customer-service` REST calls.
  5. Save aggregated segment stats in MongoDB.
  6. Publish a Kafka event to `segmentation-events`.

### ML Service Flow
- `ml-service/app.py` exposes `/ml/segment`.
- It accepts customer records and extracts features: `totalSpend` and `purchaseCount`.
- It normalizes values and applies K-Means clustering.
- It maps cluster assignments to segment labels like `High value loyal`, `Regular buyers`, `At-risk customers`, `Dormant`.
- Returns a JSON mapping of `customer_id -> segment_label`.

### Event Flow
- `customer-service` emits events to `customer-events` for create/update/delete.
- `segmentation-service` emits `SEGMENTATION_RUN_COMPLETED` to `segmentation-events` after running a segmentation job.
- `lead-service` is configured to consume Kafka events from `segmentation-events` and can react to segmentation changes.

## 7. Frontend Flow

### App Initialization
- `frontend/src/main.jsx` renders `App` inside a React `StrictMode` root.
- `frontend/src/App.jsx` defines browser routes and wraps private pages using `PrivateRoute`.
- If the user is not logged in, `PrivateRoute` redirects to `/login`.

### API Layer
- `frontend/src/services/api.js` creates an Axios client pointed at `http://localhost:8080/api`.
- A request interceptor attaches:
  - `Authorization: Bearer <token>`
  - `X-User-Id` from stored user information
- This ensures requests are authenticated and routed through the gateway.

### Page Rendering
- `Login.jsx` handles authentication and stores user info locally.
- `Dashboard.jsx`, `Customers.jsx`, `Segments.jsx`, `Leads.jsx`, `Campaigns.jsx`, and `RunMl.jsx` fetch data and display it.
- `Sidebar.jsx` provides navigation to pages.
- Each page uses state and hooks to display data and UI.

### Guest Mode
- `frontend/src/services/api.js` includes fallback seed data in `SEED_CUSTOMERS`, `SEED_LEADS`, `SEED_SEGMENTS`, and `SEED_CAMPAIGNS`.
- Guest sessions can work even without backend data by using these seeded example records.

## 8. Example Real Feature Flow

### Feature: Run Customer Segmentation End-to-End

1. User clicks the `Run ML` page or button.
2. Frontend sends `POST /api/segments/run` to the gateway.
3. Gateway validates JWT and forwards request to `segmentation-service`.
4. `SegmentationService` fetches customers from `customer-service` using `GET /api/customers?size=1000`.
5. It sends the customer list to ML service at `http://ml-service:5000/ml/segment`.
6. ML service returns customer segment labels.
7. `SegmentationService` updates each customer record with the new `segment` value.
8. It stores summarized segment documents in MongoDB.
9. `segmentation-service` emits a Kafka event that the segmentation job completed.
10. Frontend receives success and refreshes the segment list.

This feature flows through:
- frontend → API Gateway → segmentation-service → customer-service + ml-service → MongoDB + Kafka

## 9. Debugging Guide

### Common Places to Check
- `docker-compose logs -f` to see all service logs.
- Backend service logs in Docker containers: each service writes logs during startup and request handling.
- Python ML service logs in `ml-service/app.py` if ML requests fail.
- API gateway logs from `GatewayJwtFilter` when JWT validation fails.
- MongoDB connectivity problems in `backend/*/src/main/resources/application.yml`.
- Kafka connection problems in service configs.

### Service-Specific Tips
- `api-gateway`
  - If requests fail with `401`, verify the token header and `jwt.secret`.
  - If routes are missing, inspect `backend/api-gateway/src/main/resources/application.yml`.

- `auth-service`
  - If login fails, check `AuthController` and MongoDB user records.
  - Ensure `MONGO_URI` is correct.

- `customer-service`
  - Check `CustomerController` for route behavior.
  - If pagination or search is wrong, inspect `CustomerService.getCustomers()`.
  - If CSV import fails, validate uploaded CSV headers and values.

- `segmentation-service`
  - If segmentation job fails, inspect `SegmentationService.runSegmentationJob()`.
  - If ML calls fail, verify `ml.service.url` and `ml-service` health.
  - Check fallback rule-based segmentation when ML is unreachable.

- `ml-service`
  - If clustering fails, inspect Flask exception details in container logs.
  - Ensure the request body contains valid numeric `totalSpend` and `purchaseCount` values.

- `frontend`
  - Open browser console for network errors.
  - If API calls fail, confirm the app is sending `Authorization` and `X-User-Id` headers.
  - If route navigation fails, verify `App.jsx` routes and `PrivateRoute` logic.

### Useful Debug Commands
- Start services: `docker-compose up --build`
- Stop services: `docker-compose down`
- Show logs: `docker-compose logs -f`
- Rebuild single service: `docker-compose up --build <service-name>`
- Open backend Swagger UI for development services if running.

## 10. How to Safely Make Changes

### General Rules
- Make small, isolated changes and test them immediately.
- Keep frontend and backend responsibilities separate.
- Use version control: create a branch before editing.

### Backend Changes
- If changing a backend endpoint, update the controller and service together.
- If changing data shape, update the corresponding MongoDB model and any consumer code.
- Add or update tests before changing business logic.
- Verify environment variables in `docker-compose.yml` and service `application.yml`.

### Frontend Changes
- Update UI changes in a single page or component.
- Keep API calls inside `frontend/src/services/api.js` or page-level functions.
- Use React router paths consistently with `App.jsx`.
- Use the browser dev console to catch runtime errors.

### ML Service Changes
- Keep the ML endpoint contract stable: it must still accept a list of customers and return a mapping object.
- If changing clustering logic, maintain labels and handle missing values safely.

### Deployment and Test Flow
1. Make code changes.
2. Rebuild only the affected service(s) if using Docker.
3. Run `docker-compose up --build <service>` or `docker-compose up --build` for a full rebuild.
4. Test the affected feature from the UI.
5. Use logs to confirm expected behavior.

## 11. Separation of Responsibilities

### Frontend
- `frontend/` handles user interaction, routing, page rendering, form submission, and displaying results.
- It does not contain business rules or long-running processes.

### API Gateway
- `api-gateway/` handles routing, CORS, JWT validation, and forwarding requests to backend services.
- It is the single entry point for all API calls.

### Authentication Service
- `auth-service/` handles user registration, login, JWT issuing, and refresh tokens.
- It stores users in MongoDB.

### Customer Service
- `customer-service/` owns customer data.
- It stores customer documents in MongoDB and publishes changes to Kafka.

### Segmentation Service
- `segmentation-service/` owns customer segment logic and segment summaries.
- It orchestrates ML calls and updates customer segment assignments.

### Lead Service
- `lead-service/` consumes segmentation-related Kafka events and manages lead scoring.

### Campaign Service
- `campaign-service/` manages campaign planning and dispatch, using segmentation information.

### ML Service
- `ml-service/` performs clustering and returns customer segment labels.
- It is intentionally simple and isolated.

## 12. Where to Start for a New Developer

1. Read this documentation.
2. Start the full stack with `docker-compose up --build`.
3. Open the frontend at `http://localhost:3000`.
4. Open the gateway at `http://localhost:8080` and backend APIs via Swagger if needed.
5. Browse the frontend pages: `Customers`, `Segments`, `Leads`, `Campaigns`, `Run ML`.
6. Trace a request in the logs from frontend to gateway to backend.

## 13. Quick Reference

- Frontend UI: `http://localhost:3000`
- API Gateway: `http://localhost:8080`
- Auth Service: `http://localhost:8085`
- Customer Service: `http://localhost:8081`
- Segmentation Service: `http://localhost:8082`
- Lead Service: `http://localhost:8083`
- Campaign Service: `http://localhost:8084`
- ML Service: `http://localhost:5000`
- MongoDB port exposed: `27018`

---

This documentation is intended to help developers understand, debug, and safely modify RetailIQ without needing deep familiarity with the codebase.
