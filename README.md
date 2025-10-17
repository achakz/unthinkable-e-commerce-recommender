AI-Powered E-commerce Product Recommender

This is a full-stack web application that demonstrates a modern e-commerce recommendation system. It uses a simple logic-based recommender combined with a powerful Large Language Model (LLM) to provide users with personalized product suggestions and clear, human-readable explanations for why each product was recommended.

Features

Interactive Product Catalog: Users can browse a catalog of products.

User History Tracking: Clicking "View Product" adds an item to the user's browsing history.

Personalized Recommendations: Generates product recommendations based on the user's viewing history.

LLM-Powered Explanations: For each recommendation, users can click "Why Recommended?" to get a unique, AI-generated explanation detailing the connection between their history and the suggested product.

Responsive Design: A clean, modern, and responsive interface built with React and Tailwind CSS.

Decoupled Architecture: A RESTful API backend (Node.js/Express) serves data and handles business logic, while a separate frontend (React/Vite) handles the user interface.

Tech Stack

Frontend: React, Vite, Tailwind CSS

Backend: Node.js, Express.js

AI Model: Google Gemini API for generating explanations.

Database: In-memory JSON (for this MVP)

Setup and Installation

Follow these steps to get the project running locally.

Prerequisites

Node.js and npm (or yarn/pnpm)

A Google Gemini API Key. You can get one from Google AI Studio.

1. Clone the Repository

git clone <your-repository-url>
cd ai-recommender


2. Backend Setup

Navigate to the backend directory and set up the server.

# Go to the backend folder
cd backend

# Install dependencies
npm install

# Create a .env file for your API key
touch .env


Open the .env file and add your Gemini API key:

GEMINI_API_KEY=your_google_api_key_here


3. Frontend Setup

In a separate terminal, navigate to the frontend directory.

# Go to the frontend folder (from the root directory)
cd frontend

# Install dependencies
npm install


Running the Application

You need to run both the backend and frontend servers simultaneously in two separate terminals.

Terminal 1: Start the Backend Server

# From the 'backend' directory
node server.js


The server will be running on http://localhost:5001.

Terminal 2: Start the Frontend App

# From the 'frontend' directory
npm run dev


The React application will open in your browser, usually at http://localhost:5173.