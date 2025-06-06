# Waste Management System 🌱

A full-stack waste management platform designed to streamline waste collection processes for admins, users, and collectors. Built with modern web technologies to ensure scalability and ease of use.

![Project Banner](https://github.com/TakibYeasar/WasteKnack_Waste_Management_Website/blob/main/screencapture-localhost-3000-2025-03-07-11_30_45.png)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub Issues](https://img.shields.io/github/issues/TakibYeasar/WasteKnack_Waste_Management_Website)](https://github.com/TakibYeasar/WasteKnack_Waste_Management_Website/issues)

## Features ✨

### 👨💼 Admin Panel
- **Dashboard Analytics**: Real-time statistics on users, collectors, and admin
- **User Management**: CRUD operations for all user roles
- **Pickup Assignment**: Manual assignment of requests to collectors
- **Content Management**: Announcements, FAQs, and notifications system

### 🏠 User Features
- **Pickup Scheduling**: Intuitive calendar interface with waste type categorization
- **Live Tracking**: Real-time status updates (Pending → In Progress → Completed)
- **Payment Integration**: Secure transactions via Stripe/Razorpay
- **Feedback System**: Rating and review collectors post-service

### 🚚 Collector Portal
- **Task Management**: Accept/reject pickups with schedule optimization
- **Navigation Support**: Integrated maps (Google Maps/Mapbox)
- **Performance Metrics**: Earnings dashboard and service ratings
- **Mobile-First Design**: Responsive interface for on-the-go updates

## Tech Stack 🛠️

**Frontend**  
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss)](https://tailwindcss.com/)

**Backend**  
[![Django](https://img.shields.io/badge/Django-092E20?style=flat&logo=django)](https://www.djangoproject.com/)
[![Django REST](https://img.shields.io/badge/Django_REST-FF1709?style=flat&logo=django)](https://www.django-rest-framework.org/)

**Database**  
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql)](https://www.postgresql.org/)

**Authentication**  
[![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens)](https://jwt.io/)

**Deployment**  
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Render-46E3B7?style=flat&logo=render)](https://render.com/)

## Installation 💻

1. **Clone Repository**
   ```bash
   git clone https://github.com/TakibYeasar/WasteKnack_Waste_Management_Website.git
   cd WasteKnack_Waste_Management_Website
   ```

2. **Backend Setup**
   ```bash
   cd backend
   poetry install
   poetry shell
   cp .env.example .env
   # Configure environment variables (see below)
   python manage.py migrate
   python manage.py runserver
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   npm start
   ```

4. **Database Initialization**  
   Create PostgreSQL database and update DATABASE_URL in backend `.env` file

## Environment Variables ⚙️

Create `.env` files in both frontend/backend directories:

**Backend (.env)**
```env
DEBUG=0
SECRET_KEY=your_django_secret_key

# Database Configuration
DB_NAME = your_database_name
DB_USER = your_database_username
DB_PASS = your_database_user_password

# Email Configuration
EMAIL_HOST_USER = your_email_address
EMAIL_HOST_PASSWORD = your_email_host_password
```

**Frontend (.env)**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GEMINI_API_KEY = 
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 
```

## Contributing 🤝

We welcome contributions! Please follow these steps:
1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📄

Distributed under the MIT License. See `LICENSE` for more information.

---

**Happy Recycling! ♻️**  
[Report Bug](https://github.com/TakibYeasar/WasteKnack_Waste_Management_Website/issues) | [Request Feature](https://github.com/TakibYeasar/WasteKnack_Waste_Management_Website/issues)
```

The content above is encoded in UTF-8, which should display correctly on most platforms. If you need any further adjustments, feel free to ask!