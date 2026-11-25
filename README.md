# Academia Builder

> **Project Status:** Discontinued - Preserved as a public portfolio showcase.  
> **Backend API:** Core endpoints implemented and **verified end-to-end via Postman**.  
> **Frontend:** Authentication, role-based dashboards, and classroom management implemented (course/question-bank UI views left unfinished).

**Academia Builder** is a full-stack education platform designed to connect teachers and students through structured courses and classrooms where teachers can assign questions/homework for students which would then be marked by an AI. Originally developed as a startup concept, the repository is preserved to document the architecture, security patterns, and full-stack workflows built during development.

---

## Tech Stack

### Frontend (`academia_builder/`)
* **Framework:** Next.js 15 (App Router), React 19, TypeScript
* **State & Data Fetching:** Redux Toolkit, RTK Query (with `async-mutex` automatic token refresh)
* **Styling & UI:** Tailwind CSS, Headless UI, Heroicons, React Toastify

### Backend (`academia_builder_api/`)
* **Framework:** Python 3.11, Django 5.1, Django REST Framework
* **Authentication:** SimpleJWT (HTTP-only cookies), Djoser, `social-auth-app-django` (Google OAuth2 & Microsoft Graph)
* **Async Tasks & Caching:** Celery, Celery Beat, Redis (`django-redis`)
* **Email & Infrastructure:** Amazon SES (`django-ses`), Docker & Docker Compose, SQLite (development)

---

## Key Features & Engineering Highlights

* **Dual-Role Account System:** Custom `UserAccount` model supporting distinct **Teacher** and **Student** accounts with strict role-based access control on both API views (`IsTeacher`, `IsStudent`) and Next.js route layouts (`RequireAuth`).
* **HTTP-Only Cookie JWT Auth with Mutex Refresh:** Custom `CustomJWTAuthentication` reads access and refresh tokens from secure HTTP-only cookies rather than `localStorage` to stop . On the frontend, an RTK Query `baseQueryWithReauth` wrapper uses `async-mutex` to prevent race conditions when multiple concurrent requests trigger a token refresh.
* **Two-Step OAuth2 Onboarding Pipeline:** Integrates Google and Microsoft sign-in via a custom `social_core` pipeline (`store_temporary_user`) that pauses registration for new users, caches their OAuth profile in **Redis** for 5 minutes, and redirects them to `/auth/select-account` to choose a Teacher or Student role before creating the database record.
* **Classroom Management & Dynamic Field Serialization:** Teachers can create classrooms linked to courses, generate 10-character unique join codes, rename classrooms, and batch-remove students. `DynamicFieldsModelSerializer` filters exposed fields (`TEACHER_ALLOWED_FIELDS` vs. `STUDENT_ALLOWED_FIELDS`) via `?fields=` query parameters so students never receive sensitive classroom data.
* **Hierarchical Course & Question Bank API:** Structured `Course` → `Module` → `SubTopic` → `Question` → `MultipleChoiceOption` schema supporting Multiple Choice (`MC`) and Long Answer (`LA`) questions with multi-parameter filtering endpoints.
* **Automated Database Cleanup & Transactional Emails:** Uses Amazon SES for account activation and password reset emails, paired with a scheduled **Celery Beat** background task (`delete_inactive_users`) that runs every night at midnight (`Europe/London`) to purge unactivated accounts older than 24 hours.

---

## Project Structure

```text
Academia_builder/
├── academia_builder/               # Next.js 15 Frontend
│   ├── app/                        # App Router pages (auth, dashboard, classroom, activation, password-reset)
│   ├── components/                 # Reusable UI components, dynamic forms, and RequireAuth guards
│   ├── hooks/                      # Custom hooks for auth, OAuth flows, and classroom settings
│   ├── redux/                      # Redux store, authSlice, and RTK Query API slices
│   └── utils/                      # Social OAuth redirect helpers
│
└── academia_builder_api/           # Django REST Framework Backend
    ├── academia_builder/           # Project settings, Celery schedule, URL routing, custom permissions
    ├── users/                      # Custom user model, HTTP-only JWT views, OAuth Redis pipeline, Celery tasks
    ├── classroom/                  # Classroom models, dynamic field serializers, and management endpoints
    ├── courses/                    # Course hierarchy, question bank models, and filtering endpoints
    ├── Dockerfile                  # Python 3.11 container image definition
    └── docker-compose.yml          # Multi-container orchestration (Django API, Redis, Celery Worker & Beat)
```

---

## Getting Started

Because the frontend and backend are decoupled applications, you will need to configure and run both services.

### Prerequisites
* **Node.js** 18+ and **npm**
* **Docker** & **Docker Compose** (recommended for the backend), or **Python 3.11+** with a running **Redis** instance

---

### 1. Clone the Repository

```bash
git clone https://github.com/Vertical-JEEV/Academia_builder.git
cd Academia_builder
```

---

### 2. Backend Setup (`academia_builder_api`)

1. Navigate to the backend directory:
   ```bash
   cd academia_builder_api
   ```

2. Create a `.env.local` file inside `academia_builder_api/` with the following configuration:
   ```env
   # Core Django Settings
   DJANGO_SECRET_KEY=replace-with-a-secure-random-key
   DJANGO_DEBUG=True
   DJANGO_ALLOWED_HOSTS=127.0.0.1,localhost
   DJANGO_CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
   REDIRECT_URLS=http://localhost:3000/auth/google,http://localhost:3000/auth/microsoft
   DOMAIN=localhost:3000
   AUTH_COOKIE_SECURE=False

   # OAuth2 Credentials (Required only if testing Google/Microsoft login)
   GOOGLE_AUTH_KEY=your-google-client-id
   GOOGLE_AUTH_SECRET_KEY=your-google-client-secret
   MICROSOFT_AUTH_KEY=your-microsoft-client-id
   MICROSOFT_AUTH_SECRET_KEY=your-microsoft-client-secret

   # Amazon SES Email Settings (Required only for sending activation/reset emails)
   AWS_SES_ACCESS_KEY_ID=your-aws-access-key
   AWS_SES_SECRET_ACCESS_KEY=your-aws-secret-key
   AWS_SES_REGION_NAME=eu-west-2
   AWS_SES_FROM_EMAIL=noreply@yourdomain.com
   ```
   > **Tip for local email testing:** If you don't have AWS SES credentials configured locally, you can temporarily swap `EMAIL_BACKEND` in `academia_builder/settings.py` to `'django.core.mail.backends.console.EmailBackend'` to print activation and password-reset links directly in your terminal.

3. **Run with Docker Compose (Recommended):**  
   This starts the Django API server alongside Redis, Celery Worker, and Celery Beat automatically:
   ```bash
   docker-compose up --build
   ```
   In a separate terminal, apply the database migrations and create an admin user (to populate courses/questions via `/admin`):
   ```bash
   docker-compose exec api_server python manage.py migrate
   docker-compose exec api_server python manage.py createsuperuser
   ```

4. **Alternative — Run Locally without Docker:**  
   *(Ensure a local Redis server is running and update `CACHES` and `CELERY_BROKER_URL` in `settings.py` from `redis://redis_db:6379` to `redis://127.0.0.1:6379`.)*
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

The backend API will be running at **`http://localhost:8000`** (Django Admin at **`http://localhost:8000/admin`**).

---

### 3. Frontend Setup (`academia_builder`)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd academia_builder
   ```

2. Create a `.env.local` file inside `academia_builder/`:
   ```env
   NEXT_PUBLIC_HOST=http://localhost:8000
   NEXT_PUBLIC_REDIRECT_URL=http://localhost:3000
   ```

3. Install dependencies and start the Next.js development server:
   ```bash
   npm install
   npm run dev
   ```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## API Reference (Postman Verified)

All endpoints below are prefixed with `/api/`.

### Authentication & Users

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/users/` | Public | Register a new `teacher` or `student` account |
| `POST` | `/api/users/activation/` | Public | Activate a newly registered account using `uid` and `token` |
| `POST` | `/api/jwt/create/` | Public | Authenticate with email/password and set HTTP-only JWT cookies |
| `POST` | `/api/jwt/refresh/` | Cookie | Refresh the access token using the HTTP-only refresh cookie |
| `POST` | `/api/jwt/verify/` | Cookie | Verify the current access token and return user `account_type` |
| `POST` | `/api/logout/` | Authenticated | Clear `access` and `refresh` cookies |
| `GET` / `POST` | `/api/o/<provider>/` | Public | Initiate or complete Google (`google-oauth2`) / Microsoft (`microsoft-graph`) OAuth2 |
| `POST` | `/api/complete-signup/` | Public | Finalise new OAuth user signup using the Redis cache token and selected role |
| `POST` | `/api/users/reset_password/` | Public | Request a password reset email |
| `POST` | `/api/users/reset_password_confirm/` | Public | Confirm password reset with `uid`, `token`, and new password |

### Classrooms

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/classroom/list-classrooms/` | Teacher / Student | List user's classrooms with role-restricted `?fields=` filtering |
| `POST` | `/api/classroom/create/` | Teacher | Create a classroom linked to a course and generate a unique join code |
| `PATCH` | `/api/classroom/rename/<id>/` | Teacher (Owner) | Rename a classroom |
| `DELETE` | `/api/classroom/delete/<id>/` | Teacher (Owner) | Permanently delete a classroom |
| `POST` | `/api/classroom/join-student/` | Student | Enrol in a classroom using its 10-character `unique_code` |
| `DELETE` | `/api/classroom/<id>/remove-students/` | Teacher (Owner) | Remove one or more `student_ids` from a classroom |

### Courses & Question Bank

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/courses/list-courses/` | Teacher / Student | Retrieve all available courses |
| `GET` | `/api/courses/retrieve-topic-list/<course_id>/` | Teacher / Student | Get all modules and nested subtopics for a course |
| `GET` | `/api/courses/filter-questions/<course_id>/` | Teacher / Student | Filter questions by comma-separated `module_ids` and/or `subtopics_ids` |

---

## Author

Developed by **[Vertical-JEEV](https://github.com/Vertical-JEEV)**.
