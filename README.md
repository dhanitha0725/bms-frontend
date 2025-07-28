# 📚 Book Management System (BMS) Frontend

A modern web application built with **React**, **TypeScript**, and **Material UI** for managing your book collections with ease. BMS offers comprehensive CRUD operations, user authentication, and a sleek, responsive interface—empowering you to organize, search, and maintain your personal or shared library.

---

## 🚀 Overview

**Book Management System (BMS)** is a comprehensive app designed to help users manage their book collections, streamline the process, and enjoy an intuitive, fast, and secure user experience. From authentication to powerful search and error handling, BMS is built for reliability and clarity.

---

## ✨ Features

### 🛡️ User Authentication
- Secure registration & login
- JWT-based authentication
- Password validation with security requirements
- Protected routes for authenticated users

### 📘 Book Management
- Create, read, update, and delete books
- View detailed book information
- Form validation using Zod schemas
- Comprehensive error handling for API interactions

### 🔍 Search & Navigation
- Real-time search across multiple fields
- Pagination with customizable rows per page
- Responsive design for all device sizes
- Intuitive navigation between sections

### 🎨 User Experience
- Clean, modern Material UI components
- Responsive layouts for any screen size
- Visual feedback with snackbar notifications
- Consistent error handling and user guidance

---

## 🗂️ Project Structure

The project follows a modern, five-folder architecture for maintainability and clarity:

```
bms-frontend/
├── src/
│   ├── api/               # API integration layer
│   ├── components/        # Shared UI components
│   ├── features/          # Feature-specific modules (auth, book, home)
│   ├── pages/             # Page components and containers
│   ├── context/           # React context providers
│   ├── router/            # Routing configuration
│   ├── theme/             # Theme customization
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   └── validations/       # Form validation schemas
```

---

## 🏗️ Core Architecture Patterns

- **Feature-First Organization:** Components are grouped by feature for easy navigation and maintenance.
- **Container/Component Pattern:** Stateful containers (pages) are separated from presentational components.
- **Context API for Global State:** Authentication and user info are managed globally via React Context.
- **Form Validation Strategy:** Centralized Zod schemas ensure robust, type-safe form validation across the app.

---

## 💡 Get Started

1. **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/bms-frontend.git
    cd bms-frontend
    ```

2. **Install dependencies:**
    ```bash
    npm install
    # or
    yarn
    ```

3. **Run the development server:**
    ```bash
    npm start
    # or
    yarn start
    ```

4. **Visit:** [http://localhost:3000](http://localhost:3000)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues](https://github.com/yourusername/bms-frontend/issues) or submit a pull request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🙏 Acknowledgements

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Material UI](https://mui.com/)
- [Zod](https://zod.dev/)

---

*Happy reading & organizing!*
