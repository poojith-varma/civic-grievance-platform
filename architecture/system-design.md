1. High-Level System Architecture
The system is decoupled into three independent layers interacting via secure protocols:

Client Layer:

Mobile App (React Native Expo): Used by Citizens (reporting, tracking) and Field Workers (receiving assignments, updating status).

Web Admin (Next.js): Used by Admins (dashboard, manual overrides, worker management).

Application Layer (FastAPI):

Acts as the single source of truth and API Gateway. Handles business logic, AI orchestration, file processing, and DB operations.

Data & Storage Layer:

PostgreSQL (Supabase): Relational data (users, complaints, locations).

Supabase Realtime: WebSockets for instant notifications and live worker tracking.

Cloudinary: Optimized CDN and storage for grievance images.

2. Complete Scalable Folder Structure
Backend (FastAPI)
Using a modular, domain-driven structure.

Plaintext
backend/
├── app/
│   ├── core/                  # App-wide settings (config, security, exceptions)
│   ├── api/                   # Route definitions (e.g., api/v1/router.py)
│   ├── db/                    # Database connection, sessions, Alembic migrations
│   ├── modules/               # Feature-based domains
│   │   ├── complaints/        
│   │   │   ├── router.py      # Endpoints (GET, POST)
│   │   │   ├── schemas.py     # Pydantic models (validation)
│   │   │   ├── models.py      # SQLAlchemy DB models
│   │   │   └── service.py     # Business logic
│   │   ├── users/             # Citizen/Worker/Admin management
│   │   ├── ai/                # AI services (duplicate check, priority scoring)
│   │   └── locations/         # Geospatial queries and maps logic
│   ├── services/              # External integrations
│   │   ├── cloudinary.py      # Image upload logic
│   │   ├── supabase.py        # Realtime event triggers
│   │   └── translation.py     # Multilingual support service
│   └── main.py                # FastAPI entry point
├── tests/                     # Unit and integration tests
├── requirements.txt
└── .env
Mobile App (React Native Expo)
Separating generic UI components from feature-specific logic.

Plaintext
mobile/
├── src/
│   ├── app/                   # Expo Router (file-based routing)
│   │   ├── (auth)/            # Login, Signup
│   │   ├── (citizen)/         # Citizen tabs (Report, My Complaints, Map)
│   │   └── (worker)/          # Worker tabs (Tasks, Route)
│   ├── components/            # Reusable UI (Buttons, Cards, Inputs)
│   ├── features/              # Feature-specific logic
│   │   ├── complaints/        # Hooks, API calls for complaints
│   │   └── maps/              # Geolocation helpers, Map components
│   ├── store/                 # Global state (Zustand/Redux)
│   ├── i18n/                  # Multilingual configuration files
│   ├── theme/                 # Colors, typography, spacing
│   └── utils/                 # Helpers (permissions, formatting)
├── assets/                    # Images, fonts
└── app.json                   # Expo config
Admin Web (Next.js)
Using Next.js App Router for server-side rendering and SEO where needed.

Plaintext
admin-web/
├── src/
│   ├── app/                   # App Router pages (Dashboard, Settings)
│   ├── components/            # Shared UI (Sidebar, Tables, Charts)
│   ├── features/              # Domain-specific components
│   │   ├── ticket-management/ 
│   │   ├── user-roles/
│   │   └── analytics/         # AI insights dashboard
│   ├── lib/                   # API clients, Supabase config
│   ├── hooks/                 # Reusable React hooks
│   └── types/                 # TypeScript interfaces
├── public/                    # Static assets
├── tailwind.config.js
└── next.config.js
3. Communication & Data Flow
Frontend-Backend Communication
Standard Data (CRUD): The Expo app and Next.js admin communicate with FastAPI via standard REST API endpoints over HTTPS. All requests require a JWT authentication token.

Real-time Data (Live tracking, Notifications): The frontend subscribes directly to Supabase Realtime channels. When FastAPI updates the database, Supabase pushes the change to subscribed clients instantly.

Image Upload Flow:

Frontend selects an image.

Frontend requests a signed upload URL from FastAPI.

Frontend uploads directly to Cloudinary (saves backend bandwidth).

Frontend sends the resulting Cloudinary URL to FastAPI to store in the PostgreSQL database.

Database Interaction Flow
FastAPI -> PostgreSQL: FastAPI uses an ORM (like SQLAlchemy or SQLModel) via asyncpg to query the Supabase PostgreSQL database directly.

Row-Level Security (RLS): Supabase's RLS policies will act as a secondary safety net to ensure Citizens can only read their own data, while Admins have full access.

4. API Architecture
The API will be versioned (e.g., /api/v1) and follow RESTful principles.

Core Routes:

POST /api/v1/complaints/ (Create grievance)

GET /api/v1/complaints/{id} (Track status)

PATCH /api/v1/complaints/{id}/status (Worker/Admin updates status)

POST /api/v1/ai/categorize (Internal AI endpoint to tag grievances)

GET /api/v1/workers/nearby (Fetch workers using PostGIS geospatial queries)

AI Orchestration (Async):
Because AI tasks (especially LLM categorization or image analysis) can be slow, they will be processed as Background Tasks in FastAPI.

Flow: Citizen submits complaint -> API saves it as "Pending AI Review" -> API returns 200 OK -> Background task runs AI checks -> DB is updated -> Supabase Realtime notifies the Admin dashboard.

5. Reusable Component Strategy
To prevent code duplication, you will employ a strict component hierarchy:

Base UI Components (Dumb): Generic elements like PrimaryButton, InputField, StatusBadge, CameraModule. These accept props and do not fetch their own data.

Feature Components (Smart): Domain-specific elements like ComplaintCard or WorkerAssignmentList. These import Base Components and handle local state.

Custom Hooks: Abstract logic into hooks like useLocation(), useTranslation(), and useComplaintStream(complaintId) to manage API calls and real-time sockets.

6. Naming Conventions
Consistency is critical for enterprise software.

Python/FastAPI: snake_case for variables, functions, and filenames. PascalCase for Classes and Pydantic Models.

React/Next.js: PascalCase for component files (ComplaintCard.tsx). camelCase for variables, functions, and hooks (useUser()).

Database Tables: snake_case, pluralized (e.g., complaints, users, worker_locations).

API Endpoints: kebab-case, pluralized nouns (e.g., /api/v1/worker-assignments).

7. Environment Variable Structure
Keep configurations strictly separated by environment (Development, Staging, Production).

Backend (.env)

Code snippet
DATABASE_URL=postgresql+asyncpg://user:password@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
SUPABASE_URL=https://xyzcompany.supabase.co
SUPABASE_SERVICE_KEY=your-secret-role-key
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
AI_SERVICE_API_KEY=your-openai-or-custom-llm-key
SECRET_KEY=long-random-string-for-jwt
Mobile/Web (.env.local)

Code snippet
EXPO_PUBLIC_API_URL=https://api.yourdomain.com/v1
EXPO_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
(Note: Only public keys go in the frontend environments. Secrets remain on FastAPI).