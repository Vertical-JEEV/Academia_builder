# Academia Builder

**Project Status:** Discontinued - preserved as a public portfolio showcase.

**Backend API:** Core endpoints implemented and verified end-to-end via Postman.

**Frontend:** Authentication, role-based dashboards, and classroom management implemented (course/question-bank UI views left unfinished).

Academia Builder is a full-stack education platform designed to connect teachers and students through structured courses and classrooms. Teachers can assign questions and homework to students, which are intended to be marked by an AI.

Originally developed as a startup concept, this repository is preserved to document the architecture, security patterns, and full-stack workflows built during development.

---

## Tech Stack

### Frontend (`academia_builder/`)

- **Framework:** Next.js 15 (App Router), React 19, TypeScript
- **State & Data Fetching:** Redux Toolkit, RTK Query (with `async-mutex` automatic token refresh)
- **Styling & UI:** Tailwind CSS, Headless UI, Heroicons, React Toastify

### Backend (`academia_builder_api/`)

- **Framework:** Python 3.11, Django 5.1, Django REST Framework
- **Authentication:** SimpleJWT (HTTP-only cookies), Djoser, `social-auth-app-django` (Google OAuth2 & Microsoft Graph)
- **Async Tasks & Caching:** Celery, Celery Beat, Redis (`django-redis`)
- **Email & Infrastructure:** Amazon SES (`django-ses`), Docker & Docker Compose, SQLite (development)

---

## Key Features & Engineering Highlights

- **Dual-Role Account System:** Custom `UserAccount` model supporting distinct Teacher and Student accounts with strict role-based access control on both API views (`IsTeacher`, `IsStudent`) and Next.js route layouts (`RequireAuth`).
- **HTTP-Only Cookie JWT Authentication with Mutex Refresh:** Custom `CustomJWTAuthentication` reads access and refresh tokens from secure HTTP-only cookies rather than `localStorage`. On the frontend, an RTK Query `baseQueryWithReauth` wrapper uses `async-mutex` to prevent race conditions when multiple concurrent requests trigger a token refresh.
- **Two-Step OAuth2 Onboarding Pipeline:** Integrates Google and Microsoft sign-in via a custom `social_core` pipeline (`store_temporary_user`) that pauses registration for new users, caches their OAuth profile in Redis for 5 minutes, and redirects them to `/auth/select-account` to choose a Teacher or Student role before creating the database record.
- **Classroom Management & Dynamic Field Serialization:** Teachers can create classrooms linked to courses, generate 10-character unique join codes, rename classrooms, and batch-remove students. `DynamicFieldsModelSerializer` filters exposed fields (`TEACHER_ALLOWED_FIELDS` vs. `STUDENT_ALLOWED_FIELDS`) via `?fields=` query parameters so students never receive sensitive classroom data.
- **Hierarchical Course & Question Bank API:** Structured `Course` → `Module` → `SubTopic` → `Question` → `MultipleChoiceOption` schema supporting Multiple Choice (`MC`) and Long Answer (`LA`) questions with multi-parameter filtering endpoints.
- **Automated Database Cleanup & Transactional Emails:** Uses Amazon SES for account activation and password reset emails, paired with a scheduled Celery Beat background task (`delete_inactive_users`) that runs every night at midnight (`Europe/London`) to purge unactivated accounts older than 24 hours.

---

## Project Structure

```text
Academia_builder/
├── academia_builder/                 # Next.js 15 Frontend
│   ├── app/                           # App Router pages (auth, dashboard, classroom, activation, password-reset)
│   ├── components/                    # Reusable UI components, dynamic forms, and RequireAuth guards
│   ├── hooks/                         # Custom hooks for auth, OAuth flows, and classroom settings
│   ├── redux/                         # Redux store, authSlice, and RTK Query API slices
│   └── utils/                         # Social OAuth redirect helpers
│
└── academia_builder_api/              # Django REST Framework Backend
    ├── academia_builder/              # Project settings, Celery schedule, URL routing, custom permissions
    ├── users/                         # Custom user model, HTTP-only JWT views, OAuth Redis pipeline, Celery tasks
    ├── classroom/                     # Classroom models, dynamic field serializers, and management endpoints
    ├── courses/                       # Course hierarchy, question bank models, and filtering endpoints
    ├── Dockerfile                     # Python 3.11 container image definition
    └── docker-compose.yml             # Django API, Redis, Celery Worker & Beat
```

---

## Getting Started

The frontend and backend are separate applications. The quickest way to run the project locally is to use Docker Compose for the backend and npm for the frontend.

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose

### 1. Clone the repository

```bash
git clone https://github.com/Vertical-JEEV/Academia_builder.git
cd Academia_builder
```

### 2. Configure the backend

Create `academia_builder_api/.env.local`:

```env
# Django
DJANGO_SECRET_KEY='replace-with-a-secure-random-key'
DJANGO_DEBUG='True'
DJANGO_ALLOWED_HOSTS='127.0.0.1,localhost'
DJANGO_CORS_ALLOWED_ORIGINS='http://localhost:3000,http://127.0.0.1:3000'
REDIRECT_URLS='http://localhost:3000/auth/google,http://localhost:3000/auth/microsoft'
DOMAIN='localhost:3000'
AUTH_COOKIE_SECURE='False'

# Redis: one instance, two logical databases
REDIS_CACHE_URL='redis://redis_db:6379/0'
CELERY_BROKER_URL='redis://redis_db:6379/1'

# Amazon SES email
AWS_SES_ACCESS_KEY_ID='your-aws-access-key'
AWS_SES_SECRET_ACCESS_KEY='your-aws-secret-key'
AWS_SES_REGION_NAME='your-aws-region'
AWS_SES_FROM_EMAIL='noreply@yourdomain.com'

# Optional: Google and Microsoft OAuth
GOOGLE_AUTH_KEY='your-google-client-id'
GOOGLE_AUTH_SECRET_KEY='your-google-client-secret'
MICROSOFT_AUTH_KEY='your-microsoft-client-id'
MICROSOFT_AUTH_SECRET_KEY='your-microsoft-client-secret'
```

**Redis configuration:** Docker Compose starts one Redis server for both Django caching and Celery. The `/0` and `/1` suffixes select separate logical databases; you do not need two Redis instances or an external Redis URL. `redis_db` must match the Redis service name in `docker-compose.yml`.

If you run Django directly on your machine instead of inside Docker, change both Redis hostnames from `redis_db` to `127.0.0.1`:

```env
REDIS_CACHE_URL='redis://127.0.0.1:6379/0'
CELERY_BROKER_URL='redis://127.0.0.1:6379/1'
```

### 3. Start the backend

From `academia_builder_api/`, run:

```bash
docker-compose up --build
```

In another terminal, from the same directory, run the migrations, seed the database and create an admin user:

```bash
docker-compose exec api_server python manage.py makemigrations
docker-compose exec api_server python manage.py migrate
docker-compose exec api_server python manage.py loaddata testdata.json
docker-compose restart
docker-compose exec api_server python manage.py createsuperuser
```

The API is available at `http://localhost:8000` and Django Admin at `http://localhost:8000/admin`.

### 4. Start the frontend

In a new terminal, from the repository root:

```bash
cd academia_builder
```

Create `academia_builder/.env.local`:

```env
NEXT_PUBLIC_HOST=http://localhost:8000
NEXT_PUBLIC_REDIRECT_URL=http://localhost:3000
```

Then install dependencies and start Next.js:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### 5. Optional: External Services Setup (Email & OAuth)

Standard email/password registration requires Amazon SES, while social login requires Google and/or Microsoft OAuth credentials.

#### Amazon SES (Email Activation & Password Resets)

1. **Verify an Identity:** In the [AWS SES Console](https://amazon.com), select your region (e.g., `eu-west-2`), go to **Identities**, and verify a sender email address (`AWS_SES_FROM_EMAIL`). _(Note: New accounts in the SES Sandbox can only send emails to verified addresses)._
2. **Generate Credentials:** In the [AWS IAM Console](https://amazon.com), create a user with the **`AmazonSESFullAccess`** policy attached.
3. Under the user's **Security credentials** tab, create an **Access key** (select _Local code_) and copy the `AWS_SES_ACCESS_KEY_ID` and `AWS_SES_SECRET_ACCESS_KEY` into `academia_builder_api/.env.local`.

> **Local Alternative (No AWS Required):** To test registration without AWS, open `academia_builder_api/academia_builder/settings.py` and temporarily change `EMAIL_BACKEND` to `'django.core.mail.backends.console.EmailBackend'`. Activation and reset links will print directly in your Docker terminal.

#### Google & Microsoft OAuth2 (Social Login)

If you want to test the two-step OAuth onboarding flow, register an application in the respective developer consoles and add the matching redirect URIs from your `.env.local`:

- **Google Cloud Console** (_APIs & Services > Credentials > Create OAuth Client ID_):
  - **Authorized JavaScript origins:** `http://localhost:3000`
  - **Authorized redirect URIs:** `http://localhost:3000/auth/google`
  - Copy the **Client ID** (`GOOGLE_AUTH_KEY`) and **Client Secret** (`GOOGLE_AUTH_SECRET_KEY`).

- **Microsoft Entra / Azure Portal** (_App registrations > New registration_):
  - **Platform:** Web
  - **Redirect URI:** `http://localhost:3000/auth/microsoft`
  - Copy the **Application (client) ID** (`MICROSOFT_AUTH_KEY`) and generate a value under _Certificates & secrets_ (`MICROSOFT_AUTH_SECRET_KEY`).

---

## API Reference (Postman Verified)

All endpoints below are prefixed with `/api/`.

### Authentication & Users

| Method         | Endpoint                             | Access        | Description                                                                          |
| -------------- | ------------------------------------ | ------------- | ------------------------------------------------------------------------------------ |
| `POST`         | `/api/users/`                        | Public        | Register a new `teacher` or `student` account                                        |
| `POST`         | `/api/users/activation/`             | Public        | Activate an account using `uid` and `token`                                          |
| `POST`         | `/api/jwt/create/`                   | Public        | Authenticate and set HTTP-only JWT cookies                                           |
| `POST`         | `/api/jwt/refresh/`                  | Cookie        | Refresh the access token using the refresh cookie                                    |
| `POST`         | `/api/jwt/verify/`                   | Cookie        | Verify the access token and return `account_type`                                    |
| `POST`         | `/api/logout/`                       | Authenticated | Clear the `access` and `refresh` cookies                                             |
| `GET` / `POST` | `/api/o/<provider>/`                 | Public        | Initiate or complete Google (`google-oauth2`) / Microsoft (`microsoft-graph`) OAuth2 |
| `POST`         | `/api/complete-signup/`              | Public        | Complete OAuth signup using the Redis cache token and selected role                  |
| `POST`         | `/api/users/reset_password/`         | Public        | Request a password reset email                                                       |
| `POST`         | `/api/users/reset_password_confirm/` | Public        | Confirm a password reset using `uid`, `token`, and a new password                    |

### Classrooms

| Method   | Endpoint                               | Access            | Description                                                           |
| -------- | -------------------------------------- | ----------------- | --------------------------------------------------------------------- |
| `GET`    | `/api/classroom/list-classrooms/`      | Teacher / Student | List classrooms with role-restricted `?fields=` filtering             |
| `POST`   | `/api/classroom/create/`               | Teacher           | Create a classroom linked to a course and generate a unique join code |
| `PATCH`  | `/api/classroom/rename/<id>/`          | Teacher (Owner)   | Rename a classroom                                                    |
| `DELETE` | `/api/classroom/delete/<id>/`          | Teacher (Owner)   | Permanently delete a classroom                                        |
| `POST`   | `/api/classroom/join-student/`         | Student           | Join a classroom using its 10-character `unique_code`                 |
| `DELETE` | `/api/classroom/<id>/remove-students/` | Teacher (Owner)   | Remove one or more `student_ids` from a classroom                     |

### Courses & Question Bank

| Method | Endpoint                                        | Access            | Description                                                             |
| ------ | ----------------------------------------------- | ----------------- | ----------------------------------------------------------------------- |
| `GET`  | `/api/courses/list-courses/`                    | Teacher / Student | Retrieve all available courses                                          |
| `GET`  | `/api/courses/retrieve-topic-list/<course_id>/` | Teacher / Student | Retrieve modules and nested subtopics for a course                      |
| `GET`  | `/api/courses/filter-questions/<course_id>/`    | Teacher / Student | Filter questions by comma-separated `module_ids` and/or `subtopics_ids` |

---

## Author

Developed by [Vertical-JEEV](https://github.com/Vertical-JEEV).
