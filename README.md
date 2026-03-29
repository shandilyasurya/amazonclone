# Amazon Clone - High-Fidelity E-commerce Marketplace

A production-ready Amazon clone featuring a premium user experience, robust order management, and a clean, responsive design.

## 🚀 Tech Stack

### **Frontend**
- **React (Vite 8.0)**: Modern, lightning-fast development with optimized builds.
- **Redux Toolkit (RTK Query)**: Advanced state management and efficient API data fetching.
- **Lucide React**: Beautiful, consistent iconography.
- **Vanilla CSS & Flexbox/Grid**: Custom-built, high-fidelity UI styling with modern animations (no heavy CSS frameworks).
- **React Router**: Seamless client-side navigation.

### **Backend**
- **Node.js & Express**: Scalable RESTful API architecture.
- **Sequelize ORM**: Powerful database management with PostgreSQL (Neon DB).
- **JWT Authentication**: Secure user sessions and role-based access control.
- **PostgreSQL**: Reliable, enterprise-grade relational database.

---

## 🛠️ Setup Instructions

### **1. Prerequisites**
- Node.js (v18+)
- PostgreSQL (or a Neon DB project)
- npm or yarn

### **2. Backend Setup**
1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   npm install
   ```
2. Create a `.env` file in the `Backend` folder and populate it with your credentials:
   ```env
   PORT=5001
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_super_secret_key
   CLOUDINARY_CLOUD_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   FRONTEND_URL=http://localhost:5173
   ```
3. Start the server:
   ```bash
   npm start
   ```

### **3. Frontend Setup**
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

---

## ✨ Key Features
- **Premium Checkout Experience**: Realistic, non-blocking order placement with high-fidelity loading overlays and a "Processing..." stage.
- **Dynamic Product Gallery**: High-resolution imagery (including our custom-fixed Yonex badminton racket!).
- **Order Tracking**: Visual status bars and historical order tracking for users.
- **Responsive Navbar**: Featuring a custom "All" options sidebar and smart search integration.
- **Cart Management**: Real-time cart updates and persistent user sessions.

---

## 💡 Assumptions Made
1. **Database Access**: A PostgreSQL instance is available and reachable via the `DATABASE_URL`.
2. **Local Image Hosting**: Critical product images (like fixed racket photography) are currently hosted in the `frontend/public/images` folder for immediate local accessibility.
3. **No Email Requirements**: To ensure local reliability and ease of testing, the system currently skips SMTP email dispatch for orders, prioritizing a fast UI/UX with database integrity.
4. **JWT Security**: The `JWT_SECRET` is used for signing tokens, assuming standard HS256 encryption.

---

## 📄 License
This project is for educational and portfolio demonstration purposes. 🚀
