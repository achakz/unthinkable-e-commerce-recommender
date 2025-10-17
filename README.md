# 🛍️ AI-Powered E-commerce Product Recommender

This is a **full-stack web application** that demonstrates a modern e-commerce recommendation system. It combines a **logic-based recommender** with a **Large Language Model (LLM)** to provide users with personalized product suggestions and human-readable explanations for why each product was recommended.

---

## 🚀 Features

* **Interactive Product Catalog:** Users can browse a catalog of products.
* **User History Tracking:** Clicking *"View Product"* adds an item to the user's browsing history.
* **Personalized Recommendations:** Generates product recommendations based on the user's viewing history.
* **LLM-Powered Explanations:** For each recommendation, users can click *"Why Recommended?"* to get a unique, AI-generated explanation detailing the connection between their history and the suggested product.
* **Responsive Design:** Built with **React** and **Tailwind CSS** for a modern, mobile-friendly experience.
* **Decoupled Architecture:** A RESTful API backend (**Node.js/Express**) serves data and handles business logic, while a separate frontend (**React/Vite**) manages the UI.

---

## 🧠 Tech Stack

| Layer        | Technology                |
| ------------ | ------------------------- |
| **Frontend** | React, Vite, Tailwind CSS |
| **Backend**  | Node.js, Express.js       |
| **AI Model** | Google Gemini API         |
| **Database** | In-memory JSON (for MVP)  |

---

## ⚙️ Setup and Installation

Follow these steps to get the project running locally.

### 🧩 Prerequisites

* [Node.js](https://nodejs.org/) and npm (or yarn/pnpm)
* A **Google Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/achakz/unthinkable-e-commerce-recommender
cd unthinkable-e-commerce-recommender
```

---

### 2️⃣ Backend Setup

Navigate to the backend directory and set up the server.

```bash
# Go to the backend folder
cd backend

# Install dependencies
npm install

# Create a .env file for your API key
touch .env
```

Open the `.env` file and add your Gemini API key:

```env
GEMINI_API_KEY=your_google_api_key_here
```

---

### 3️⃣ Frontend Setup

In a separate terminal, navigate to the frontend directory.

```bash
# Go to the frontend folder (from the root directory)
cd frontend

# Install dependencies
npm install
```

---

## ▶️ Running the Application

You need to run both the backend and frontend servers simultaneously in two separate terminals.

### 🖥️ Terminal 1: Start the Backend Server

```bash
# From the 'backend' directory
node server.js
```

The server will be running at **[http://localhost:5001](http://localhost:5001)**.

---

### 🌐 Terminal 2: Start the Frontend App

```bash
# From the 'frontend' directory
npm run dev
```

The React application will open in your browser, usually at **[http://localhost:5173](http://localhost:5173)**.

---

## 💡 Future Enhancements

* Replace in-memory storage with a real database (MongoDB/PostgreSQL)
* Add authentication and user profiles
* Implement collaborative filtering for smarter recommendations
* Containerize with Docker and add CI/CD support

---

## 🧑‍💻 Author

**Anirban Chakrabortty**
🌐 [LinkedIn](https://www.linkedin.com/in/anirban-chakrabortty-785999277/) • [GitHub](https://github.com/achakz)
