# 🏢 RetailIQ Platform - Complete Project Explanation

## Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Component Descriptions](#component-descriptions)
4. [How Data Flows](#how-data-flows)
5. [User Workflows](#user-workflows)
6. [Technology Stack](#technology-stack)
7. [Setup & Deployment](#setup--deployment)
8. [Communication Between Services](#communication-between-services)

---

## Project Overview

**RetailIQ Platform** is a complete retail intelligence system that helps businesses:
- Manage customer data
- Generate customer segments/cohorts
- Score leads
- Manage marketing campaigns
- Use AI/ML for customer clustering and segmentation

It's built as a **Microservices Architecture** where multiple independent services work together to provide a complete solution.

---

## System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER BROWSER                                │
│                 (http://localhost:3000)                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  FRONTEND (React + Vite)                        │
│              - Dashboard, Customers, Campaigns                  │
│              - Leads, Segments, ML Predictions                  │
│              - Authentication UI                                │
└─────────────────────┬──────────────────────────────────────────┘
                      │ (HTTP Requests)
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│              API GATEWAY (Port 8080)                            │
│         Routes requests to correct microservice                 │
└─┬──────────┬──────────┬──────────┬──────────┬──────────┬────────┘
  │          │          │          │          │          │
  ▼          ▼          ▼          ▼          ▼          ▼
┌─────┐ ┌────────┐ ┌──────────┐ ┌────────┐ ┌──────┐ ┌──────────┐
│Auth │ │Customer│ │Segmentation
│Svc  │ │  Svc   │ │  Svc     │
│8085 │ │  8081  │ │  8082    │
└─────┘ └────────┘ └──────────┘
                        │
                        ▼
                   ┌─────────────┐
                   │  ML Service │
                   │  (Port 5000)│
                   └─────────────┘

┌─────┐ ┌──────┐ ┌──────────┐
│Lead │ │Campaign
│ Svc │ │ Svc  │
│8083 │ │ 8084 │
└─────┘ └──────┘ └──────────┘

All Services Connect To:
  📊 MongoDB (Port 27017) - Database
  🔄 Kafka (Port 9092) - Message Broker
  🔧 Zookeeper (Port 2181) - Kafka Coordinator
```

---

## Component Descriptions

### 1. **Frontend (React + Vite)**
📍 **Port:** 3000  
**Purpose:** User-facing web application

**What it does:**
- Provides a web interface for users to access the platform
- Shows dashboards, customer lists, campaigns, leads, and segments
- Allows users to:
  - Login/Register
  - View customer data
  - Create and manage campaigns
  - See customer segments
  - Score leads
  - Run ML-based predictions

**Key Features:**
- Real-time UI with React
- Fast build and development with Vite
- Responsive design with Tailwind CSS
- Charts and data visualization with Recharts

---

### 2. **API Gateway**
📍 **Port:** 8080  
**Purpose:** Single entry point for all frontend requests

**What it does:**
- Acts as a "receptionist" that directs incoming requests
- Routes requests to the correct microservice
  - `/auth/*` → Auth Service
  - `/customers/*` → Customer Service
  - `/segments/*` → Segmentation Service
  - `/leads/*` → Lead Service
  - `/campaigns/*` → Campaign Service

**Why we need it:**
- Frontend doesn't need to know where each service is
- Provides security (authentication checks)
- Enables load balancing and monitoring

---

### 3. **Auth Service**
📍 **Port:** 8085  
**Database:** MongoDB (retailiq_auth)

**What it does:**
- Handles user login and registration
- Generates JWT tokens (security credentials)
- Validates user credentials
- Manages user sessions

**How authentication works:**
1. User enters username/password in the frontend
2. Frontend sends credentials to Auth Service
3. Auth Service verifies credentials in MongoDB
4. If valid → generates JWT token and returns it
5. Frontend stores this token and includes it in all future requests
6. Backend services verify the token for security

---

### 4. **Customer Service**
📍 **Port:** 8081  
**Database:** MongoDB (retailiq_customer)  
**Messaging:** Kafka

**What it does:**
- Manages all customer data (CRUD operations):
  - **Create** new customers
  - **Read** customer information
  - **Update** customer details
  - **Delete** customers
- Stores customer information like:
  - Name, Email, Phone
  - Purchase history
  - Location
  - Demographics

**How it works:**
1. Frontend makes request (create/read/update/delete)
2. API Gateway routes to Customer Service
3. Customer Service stores/retrieves data from MongoDB
4. When customer data changes, it publishes event to Kafka
5. Other services (like Segmentation) listen to these events

---

### 5. **Segmentation Service**
📍 **Port:** 8082  
**Database:** MongoDB (retailiq_segmentation)  
**Messaging:** Kafka  
**Depends on:** Customer Service, ML Service

**What it does:**
- Creates customer segments/cohorts based on behavior
- Groups similar customers together
- Runs clustering algorithms via ML Service
- Stores segment information

**How it works:**
1. Listens to Kafka for customer data changes
2. Collects customer data from Customer Service
3. Sends customer data to ML Service for clustering
4. ML Service analyzes data and finds patterns
5. Groups customers into segments (e.g., "High-Value", "At-Risk")
6. Stores segments in MongoDB
7. Other services use these segments for targeted actions

---

### 6. **Lead Service**
📍 **Port:** 8083  
**Database:** MongoDB (retailiq_lead)

**What it does:**
- Scores leads (ranks potential customers)
- Enriches lead information
- Determines which leads are most likely to convert

**How it works:**
1. Receives lead data from campaigns or imports
2. Analyzes lead characteristics
3. Assigns a score (0-100) based on:
   - Demographics
   - Behavior
   - Historical patterns
4. Ranks leads by score
5. Helps sales teams prioritize which leads to contact

---

### 7. **Campaign Service**
📍 **Port:** 8084  
**Database:** MongoDB (retailiq_campaign)

**What it does:**
- Manages marketing campaigns
- Tracks campaign performance
- Launches campaigns to specific customer segments

**How it works:**
1. User creates a campaign in frontend
2. Selects target segment or audience
3. Campaign Service stores campaign details
4. Can send notifications/emails to target customers
5. Tracks metrics like:
   - Who received the campaign
   - Who opened it
   - Who converted

---

### 8. **ML Service**
📍 **Port:** 5000  
**Language:** Python (Flask)  
**Purpose:** Machine Learning predictions

**What it does:**
- Runs clustering algorithms on customer data
- Identifies patterns in customer behavior
- Generates intelligent segments

**How it works:**
1. Segmentation Service sends customer data (JSON)
2. ML Service processes data using algorithms like K-Means
3. Analyzes features like:
   - Purchase amount
   - Purchase frequency
   - Time since last purchase
   - Location
4. Groups customers into optimal clusters
5. Returns segment assignments to Segmentation Service

**Algorithm:**
- Uses K-Means clustering
- Finds natural groupings in customer behavior
- Automatically determines optimal number of segments

---

### 9. **Infrastructure Services**

#### **MongoDB** 📊
📍 **Port:** 27017  
**Purpose:** Main data storage

**Structure:**
```
retailiq_auth         → User login data
retailiq_customer     → Customer profiles
retailiq_segmentation → Customer segments
retailiq_lead         → Lead information
retailiq_campaign     → Campaign data
```

**Why MongoDB?**
- Flexible schema (easy to add new fields)
- Great for storing complex nested data
- Scales well with microservices
- Fast read/write operations

---

#### **Kafka** 🔄
📍 **Port:** 9092  
**Purpose:** Messaging between services

**How it works:**
1. When customer data changes → Customer Service publishes event
2. Other services subscribe to these events
3. Multiple services can react to same event asynchronously
4. Services don't need to know about each other

**Topics (channels):**
- `customer.created` - New customer added
- `customer.updated` - Customer data changed
- `customer.deleted` - Customer removed
- Similar topics for other entities

**Benefits:**
- Decouples services (they don't call each other directly)
- Services can process events at their own pace
- No data loss (events are persisted)

---

#### **Zookeeper** 🔧
📍 **Port:** 2181  
**Purpose:** Manages Kafka coordination

**What it does:**
- Ensures only one instance of Kafka is the leader
- Maintains cluster state
- Handles failover if a Kafka broker goes down

---

## How Data Flows

### Scenario 1: User Registration and Login

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: User Registration                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  User enters: Email, Password, Name                              │
│        ↓                                                          │
│  Frontend sends to API Gateway                                   │
│        ↓                                                          │
│  API Gateway routes to Auth Service                              │
│        ↓                                                          │
│  Auth Service:                                                   │
│    - Checks if user exists                                       │
│    - Hashes password (security)                                  │
│    - Stores in MongoDB                                           │
│    - Returns success/error                                       │
│        ↓                                                          │
│  Frontend shows "Registration Successful"                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: User Login                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  User enters: Email, Password                                    │
│        ↓                                                          │
│  Frontend sends to API Gateway                                   │
│        ↓                                                          │
│  API Gateway routes to Auth Service                              │
│        ↓                                                          │
│  Auth Service:                                                   │
│    - Finds user in MongoDB                                       │
│    - Compares password (hashed)                                  │
│    - If valid → generates JWT token                              │
│    - Returns token to frontend                                   │
│        ↓                                                          │
│  Frontend stores token (in memory/localStorage)                  │
│  Frontend redirects to Dashboard                                 │
│        ↓                                                          │
│  Every request now includes: Authorization: Bearer {TOKEN}       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

### Scenario 2: Adding a New Customer and Creating Segment

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: Customer Added                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  User fills customer form (name, email, location, etc.)          │
│        ↓                                                          │
│  Frontend → API Gateway → Customer Service                       │
│        ↓                                                          │
│  Customer Service:                                               │
│    - Validates data                                              │
│    - Stores in MongoDB                                           │
│    - Publishes "customer.created" event to Kafka                 │
│    - Returns success                                             │
│        ↓                                                          │
│  Frontend shows "Customer Added!"                                │
│                                                                   │
│            ┌──── Event propagated to Kafka ────┐                 │
│            │                                    │                 │
│            ▼                                    ▼                 │
│    Segmentation Service picks up event         Other Services    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: Segmentation Service Processes Customer                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Segmentation Service receives Kafka event                       │
│        ↓                                                          │
│  Fetches all customer data from Customer Service                 │
│        ↓                                                          │
│  Prepares data for ML analysis:                                  │
│    - Purchase history                                            │
│    - Customer value                                              │
│    - Behavior patterns                                           │
│        ↓                                                          │
│  Sends to ML Service: POST /api/cluster                          │
│        ↓                                                          │
│  ML Service (Python):                                            │
│    - Receives customer data                                      │
│    - Runs K-Means clustering                                     │
│    - Identifies groups/patterns                                  │
│    - Returns cluster assignments                                 │
│        ↓                                                          │
│  Segmentation Service:                                           │
│    - Receives clusters                                           │
│    - Names segments (e.g., "Premium", "At-Risk")                 │
│    - Stores in MongoDB                                           │
│        ↓                                                          │
│  Segments updated and available for campaigns!                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

### Scenario 3: Running a Campaign

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: User Creates Campaign                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  User selects:                                                   │
│    - Campaign name: "Summer Sale"                                │
│    - Target segment: "Premium Customers"                         │
│    - Message: "50% off this weekend!"                            │
│        ↓                                                          │
│  Frontend → API Gateway → Campaign Service                       │
│        ↓                                                          │
│  Campaign Service:                                               │
│    - Stores campaign details in MongoDB                          │
│    - Retrieves target segment from Segmentation Service          │
│    - Gets customer list from that segment                        │
│    - Sends message to each customer (email/notification)         │
│    - Tracks who received it                                      │
│        ↓                                                          │
│  Campaign launched!                                              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: Tracking Campaign Performance                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Campaign Service tracks:                                        │
│    ✓ Messages sent: 1,500                                        │
│    ✓ Emails opened: 890                                          │
│    ✓ Click-through rate: 45%                                     │
│    ✓ Conversions: 320 purchases                                  │
│    ✓ Revenue generated: $15,000                                  │
│        ↓                                                          │
│  Frontend displays analytics dashboard                           │
│  Shows campaign performance metrics                              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## User Workflows

### Workflow 1: Sales Team - Prospect Leads

```
Sales Manager's Day:

1. ✅ Login to Platform
   └─ Enters email/password
   └─ Receives JWT token (security pass)

2. 📊 View Dashboard
   └─ Sees key metrics: Total customers, segments, campaigns
   └─ Last 30 days performance

3. 👥 Go to Leads Section
   └─ Sees leads sorted by score (best first)
   └─ High-score leads are most likely to buy
   └─ View lead details: name, company, contact info

4. 🎯 Contact Top Leads
   └─ Sales team reaches out to highest-scoring leads
   └─ Updates lead status in system

5. 📈 Track Success
   └─ Notes which leads converted
   └─ System learns from conversions to improve scoring
```

---

### Workflow 2: Marketing Team - Campaign Management

```
Marketing Manager's Day:

1. ✅ Login to Platform
   └─ Accesses marketing dashboard

2. 📊 Analyze Customer Segments
   └─ Sees system-generated segments:
      • "High-Value Repeat Customers" (500 customers)
      • "One-Time Buyers" (800 customers)
      • "At-Risk Customers" (200 customers)
   └─ ML analyzed 1,500 customers and found patterns

3. 🚀 Create Campaign
   └─ Targets "High-Value Repeat Customers"
   └─ Designs message: "Exclusive VIP preview!"
   └─ Sets discount: 20% off

4. 📧 Send Campaign
   └─ System sends 500 emails/notifications
   └─ Tracks who opened, clicked, purchased

5. 📈 Review Results
   └─ Sees campaign metrics:
      • 380 opened (76% open rate)
      • 290 clicked (76% click rate)
      • 145 purchased ($8,700 revenue)

6. ♻️ Repeat & Optimize
   └─ Learns what works
   └─ Creates similar campaigns for other segments
```

---

### Workflow 3: Data Analyst - Customer Intelligence

```
Data Analyst's Day:

1. ✅ Login to Platform
   └─ Accesses analytics dashboard

2. 📊 Export Customer Data
   └─ Gets full customer list with:
      • Demographics
      • Purchase history
      • Segment assignments
      • Lifetime value

3. 🔍 Analyze Segments
   └─ Reviews ML-generated segments
   └─ Understands what makes each segment unique
   └─ Example: "Premium" customers have:
      • Average order value: $250+
      • Purchase frequency: 2x/month
      • Location: Urban areas

4. 🎯 Provide Insights
   └─ Reports to business stakeholders:
      • "Segment A has 40% growth potential"
      • "Segment B is declining, needs intervention"
      • Recommendations for marketing

5. 🧪 A/B Testing
   └─ Creates two campaign variations
   └─ Tests with different segments
   └─ Measures which performs better
```

---

## Technology Stack

### Frontend Stack
| Technology | Purpose |
|-----------|---------|
| **React** | UI framework for interactive components |
| **Vite** | Fast build tool and dev server |
| **Tailwind CSS** | Styling and responsive design |
| **Axios** | HTTP requests to API |
| **Recharts** | Data visualization (charts, graphs) |
| **React Router** | Navigation between pages |
| **React Query** | Efficient data fetching and caching |

### Backend Stack
| Technology | Purpose |
|-----------|---------|
| **Spring Boot 3.2.5** | Framework for building microservices |
| **Java 17** | Programming language |
| **Spring Cloud** | Microservices utilities |
| **MongoDB** | NoSQL database |
| **Kafka** | Message broker for async communication |
| **JWT** | Secure token-based authentication |
| **Docker** | Container technology for deployment |

### ML Stack
| Technology | Purpose |
|-----------|---------|
| **Python 3** | Programming language |
| **Flask** | Web framework for API |
| **Scikit-learn** | Machine learning algorithms |

---

## Setup & Deployment

### Local Development (Using Docker Compose)

#### Prerequisites
- Docker
- Docker Compose
- Git

#### Step-by-Step Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd Project_3

# 2. Start all services with one command
docker-compose up --build

# This starts:
# ✓ MongoDB (Port 27017)
# ✓ Zookeeper (Port 2181)
# ✓ Kafka (Port 9092)
# ✓ ML Service (Port 5000)
# ✓ Auth Service (Port 8085)
# ✓ Customer Service (Port 8081)
# ✓ Segmentation Service (Port 8082)
# ✓ Lead Service (Port 8083)
# ✓ Campaign Service (Port 8084)
# ✓ API Gateway (Port 8080)
# ✓ Frontend (Port 3000)

# 3. Access the application
# Frontend: http://localhost:3000
# API Gateway: http://localhost:8080
```

#### Useful Commands

```bash
# Start in background
docker-compose up --build -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f api-gateway

# Rebuild a specific service
docker-compose up --build customer-service

# Remove all containers and volumes
docker-compose down -v
```

### Deployment Architecture

```
                    🌐 Users on Internet
                            │
                            ▼
            ┌───────────────────────────────┐
            │    Cloud Load Balancer        │
            │  (distributes traffic)        │
            └───────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
    ┌────────┐     ┌────────┐     ┌────────┐
    │ Pod 1  │     │ Pod 2  │     │ Pod 3  │
    │(copy of│     │(copy of│     │(copy of│
    │all svc)│     │all svc)│     │all svc)│
    └────────┘     └────────┘     └────────┘
        │               │               │
        └───────────────┼───────────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
    ┌────────────┐ ┌──────────┐ ┌─────────┐
    │ MongoDB    │ │  Kafka   │ │Zookeeper│
    │ Cluster    │ │ Cluster  │ │ Cluster │
    └────────────┘ └──────────┘ └─────────┘
        (Replicated)  (Distributed) (Replicated)
```

---

## Communication Between Services

### REST API (Synchronous)

Services call each other directly via HTTP:

```
Frontend
   │
   └─→ GET /api/customers
       (API Gateway)
         └─→ GET /customers/list
             (Customer Service)
                └─→ MongoDB Query
                    └─→ Returns customer list
```

**Benefits:**
- Immediate response
- Request-response pattern

**Drawbacks:**
- Tight coupling
- If one service is slow, all slow down

---

### Kafka Messaging (Asynchronous)

Services publish events that others listen to:

```
Customer Service publishes:
"customer.updated" event

Kafka stores event

Segmentation Service listens:
"Hey! Customer data changed!"
└─ Fetches updated data
└─ Recomputes segments
└─ Completes at own pace

Lead Service listens:
"New customer added!"
└─ May create lead record
└─ Enrich with lead info

Campaign Service listens:
"Customer moved to Premium segment!"
└─ May target with special offer
```

**Benefits:**
- Services don't need to know about each other
- Asynchronous (non-blocking)
- Reliable (events are persisted)
- Scalable

**Drawbacks:**
- Slight delay (events are eventually processed)
- Complex debugging

---

## Key Concepts Explained Simply

### Microservices
Instead of one big application, we have small independent services:
- Each handles one business capability
- Each has own database
- Each can be developed/deployed independently
- Easy to scale specific services

### API Gateway
The "security guard" at the entrance:
- Frontend talks only to gateway
- Gateway routes to correct service
- Gateway checks authentication
- Simplifies frontend code

### JWT Token
A secure "ID card" for logged-in users:
1. User logs in with password
2. Auth Service gives JWT token
3. User carries token in all requests
4. Services verify token = verified user
5. Token expires after time period

### MongoDB (NoSQL Database)
Different from traditional SQL databases:
- No tables/columns
- Document-based (like JSON)
- Flexible schema (easy to add fields)
- Great for microservices

### Kafka (Event Bus)
Like a company-wide announcement board:
- Services publish events
- Other services listen
- Event is recorded
- Services process at own pace

### ML Clustering
Finding patterns in customer behavior:
- Input: Customer data (500 customers)
- Algorithm: K-Means
- Process: Find natural groups
- Output: Customer segments (5 groups identified)
- Result: "Premium", "Regular", "At-Risk", etc.

---

## Common Scenarios

### Scenario: What happens when frontend loads dashboard?

```
1. User opens http://localhost:3000
2. Frontend loads (React + Vite)
3. Frontend checks for JWT token
   - If no token: shows Login page
   - If valid token: shows Dashboard
4. Frontend makes requests:
   - GET /api/dashboard/metrics
     → API Gateway → Customer Service
     → Returns total customers, segments
   
   - GET /api/segments
     → API Gateway → Segmentation Service
     → Returns list of segments
   
   - GET /api/campaigns
     → API Gateway → Campaign Service
     → Returns recent campaigns
5. Data flows back to frontend
6. Charts and numbers render on page
7. User sees complete dashboard
```

### Scenario: What happens during a server restart?

```
If MongoDB crashes:
1. Requests to any service fail
2. Services try to reconnect
3. docker-compose restarts MongoDB
4. Reconnection succeeds
5. Services resume normal operation
6. Some requests might fail (user sees error)
7. User can retry

If Kafka crashes:
1. Real-time events stop flowing
2. Services can still work (REST calls work)
3. Segmentation pauses (needs Kafka events)
4. docker-compose restarts Kafka
5. Missed events are re-processed
6. System catches up

If one service crashes:
1. That specific feature breaks
2. Other services unaffected
3. docker-compose restarts the service
4. Feature becomes available again
```

---

## Performance & Scalability

### Current Architecture (Development)
- Single instance of each service
- All in containers on one machine
- Good for learning and testing

### Production Architecture
```
Multiple instances of services (load balanced)
                    │
    ┌───────────┬───┼───┬───────────┐
    ▼           ▼   ▼   ▼           ▼
[API-GW-1] [API-GW-2] [API-GW-3]
[Cust-1]   [Cust-2]   [Cust-3]
[Seg-1]    [Seg-2]    [Seg-3]
    
All connected to:
- MongoDB Replica Set (data consistency)
- Kafka Cluster (fault tolerance)
- Load Balancer (distribute traffic)
```

---

## Troubleshooting

### Issue: Services won't start

```bash
# Check if ports are free
netstat -ano | findstr "8080 8081 8082"

# Check Docker is running
docker --version

# View service logs
docker-compose logs

# Rebuild everything
docker-compose down
docker-compose up --build
```

### Issue: Frontend can't connect to backend

```bash
# Check API Gateway is running
curl http://localhost:8080/health

# Check if request header has JWT token
# Frontend should send:
# Authorization: Bearer {token}

# Check CORS settings in API Gateway
# Should allow requests from http://localhost:3000
```

### Issue: ML Service errors

```bash
# Check ML Service logs
docker-compose logs ml-service

# Check if customer data is valid JSON
# ML Service expects specific format

# Check Python requirements are installed
docker-compose logs ml-service | grep "ModuleNotFoundError"
```

---

## Summary

**RetailIQ Platform** is a complete retail intelligence system built with modern microservices architecture:

1. **Frontend** - React UI for users
2. **API Gateway** - Routes requests to services
3. **Microservices** - Auth, Customer, Segmentation, Lead, Campaign
4. **ML Service** - Python clustering engine
5. **Data Layer** - MongoDB for storage
6. **Messaging** - Kafka for inter-service communication

**Key benefits:**
- ✅ Scalable (add more instances of any service)
- ✅ Maintainable (small independent services)
- ✅ Flexible (can develop services independently)
- ✅ Resilient (one service failure doesn't break everything)
- ✅ Intelligent (ML-powered customer insights)

---

## Quick Reference Card

| Component | Port | Purpose |
|-----------|------|---------|
| Frontend | 3000 | User interface |
| API Gateway | 8080 | Request router |
| Auth Service | 8085 | User authentication |
| Customer Service | 8081 | Customer data |
| Segmentation | 8082 | Customer segments |
| Lead Service | 8083 | Lead scoring |
| Campaign Service | 8084 | Campaign management |
| ML Service | 5000 | ML clustering |
| MongoDB | 27017 | Main database |
| Kafka | 9092 | Message broker |

---

## For Questions

When someone asks you: **"How does this project work?"**

You can say:
> "It's a retail intelligence platform with 6 backend microservices that work together. The frontend (React) talks to an API Gateway, which routes requests to the right service. Services communicate both synchronously via REST and asynchronously via Kafka. MongoDB stores data, and a Python ML service provides intelligent customer clustering. All services run in Docker containers and can be started with a single command!"

✅ **You now have a complete reference document for explaining this project!**

