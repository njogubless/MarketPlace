#  Marketplace Monorepo

A full-stack marketplace application built with **Django (backend API)** and **React (frontend UI)**, structured as a monorepo for better scalability and development workflow.

---

## Project Structure

```
marketproject/
│
├── backend/              # Django backend (API)
│   └── marketplacebackend/
│
├── frontend/             # React frontend
│
├── .gitignore
├── README.md
```

---

##  Tech Stack

### Backend

* Python
* Django
* Django REST Framework
* PostgreSQL (recommended)

### Frontend

* React
* JavaScript / TypeScript (optional)
* Axios / Fetch API

---

##  Features (Planned / In Progress)

* User authentication (buyers & vendors)
* Product listings
* Order management
* RESTful API
* Vendor dashboard
* Cart & checkout system
* Payment integration (future)

---

##  Setup Instructions

### 1. Clone the repository

```
git clone https://github.com/YOUR_USERNAME/marketplace-monorepo.git
cd marketplace-monorepo
```

---

## Backend Setup (Django)

```
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Run migrations:

```
python manage.py makemigrations
python manage.py migrate
```

Start server:

```
python manage.py runserver
```

Backend will run at:

```
http://127.0.0.1:8000/
```

---

## Frontend Setup (React)

```
cd frontend
npm install
npm start
```

Frontend will run at:

```
http://localhost:3000/
```

---

## API Integration

The frontend communicates with the Django backend via REST APIs.

Example:

```
GET /api/products/
```

---

## Git Workflow

* `main` → production-ready code
* `dev` → active development
* feature branches → new features

Example:

```
git checkout -b feature/add-products
```

---

## Environment Variables

Create `.env` files in both `backend/` and `frontend/` for sensitive data:

### Backend

```
SECRET_KEY=your_secret_key
DEBUG=True
```

### Frontend

```
REACT_APP_API_URL=http://127.0.0.1:8000
```

---

## Best Practices

* Do not commit `venv/` or `node_modules/`
* Keep backend and frontend isolated
* Use environment variables for secrets
* Write reusable API endpoints

---

## Future Improvements

* Docker setup
* CI/CD pipeline
* Payment integration (Stripe / M-Pesa)
* Notifications (email/SMS)
* Advanced search & filtering

---

## License

This project is licensed under the MIT License.

---

##  Author

Built by Bless
