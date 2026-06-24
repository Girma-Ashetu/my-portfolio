# 🌌 GAPortfolio - Modern AI Graduate Portfolio

[![Vercel Deployment](https://img.shields.io/badge/Deployment-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?style=flat-square&logo=mysql)](https://www.mysql.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=flat-square)](https://opensource.org/licenses/ISC)

A high-performance, visually stunning portfolio platform designed for AI graduates and modern developers. This full-stack application features a dynamic project showcase, a secure administrative dashboard, and an integrated contact management system.

---

## ✨ Key Features

-   **🚀 Dynamic Project Showcase**: Projects are served dynamically from a MySQL database, allowing for real-time updates without redeployment.
-   **🔐 Secured Admin Dashboard**: A private interface for managing portfolio content, including adding/deleting projects and viewing incoming messages.
-   **📧 Interactive Contact System**: A built-in contact form that captures and stores user inquiries for administrative review.
-   **📱 Responsive & Modern UI**: Built with a "Deep Space" aesthetic, featuring glassmorphism, smooth animations, and a fully responsive layout.
-   **☁️ Vercel Ready**: Optimized for seamless deployment on Vercel with serverless functions.

---

## 🛠️ Tech Stack

### Frontend
-   **HTML5 & CSS3**: Custom styles with advanced CSS variables and animations.
-   **JavaScript (ES6+)**: Pure JS for dynamic interactions and API integration.
-   **Aesthetics**: Glassmorphism, CSS Gradients, and micro-animations.

### Backend
-   **Node.js & Express.js**: Robust API server handling authentication and data management.
-   **Authentication**: Secure login via **JSON Web Tokens (JWT)** and **BcryptJS** hashing.
-   **Middleware**: Custom authentication and CORS management.

### Database
-   **MySQL**: Relational database for structured storage of projects, messages, and admin credentials.

---

## 🏗️ Project Structure

```text
GAPortfolio/
├── api/                # Vercel serverless functions (Entry points)
├── backend/            # Express.js server logic
│   ├── config/         # Database & environment configuration
│   ├── middleware/     # Auth & security middleware
│   └── server.js       # Main server entry Point
├── database/           # SQL seeds and migration scripts
├── frontend/           # Static assets and UI files
│   ├── admin/          # Admin dashboard interface
│   ├── css/            # Stylsheets (overhaul.css, styles.css)
│   ├── js/             # Frontend logic (projects.js, contact.js)
│   └── index.html      # Homepage
├── vercel.json         # Deployment configuration
└── package.json        # Project dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites
-   [Node.js](https://nodejs.org/) (v14 or higher)
-   [MySQL](https://www.mysql.com/) installed and running locally or on a cloud provider (e.g., PlanetScale, Railway).

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/yourusername/GAPortfolio.git
    cd GAPortfolio
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the `backend/` directory and add your credentials:
    ```env
    PORT=5001
    DB_HOST=localhost
    DB_USER=your_user
    DB_PASSWORD=your_password
    DB_NAME=gap_portfolio
    JWT_SECRET=your_super_secret_key
    ```

4.  **Database Migration**
    Execute the SQL scripts found in the `database/` folder (e.g., `seed.sql`) to set up your tables and initial data.

### Running Locally

```bash
# Start the development server (with nodemon)
npm run dev
```
The application will be available at `http://localhost:5001`.

---

## 🚢 Deployment

This project is optimized for **Vercel**. 

1.  Connect your GitHub repository to Vercel.
2.  Configure your Environment Variables in the Vercel Dashboard.
3.  Vercel will automatically detect the `vercel.json` and deploy the application.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the **ISC License**.

---

*Built with ❤️ by [Your Name/Handle]*
