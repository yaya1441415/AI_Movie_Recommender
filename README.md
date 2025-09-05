# 🎬 AI Movie Recommender  

An AI-powered **movie recommendation system** built with **React.js (frontend)**, **FastAPI (backend)**, and **MongoDB (database)**.  
The system recommends movies based on **user prompts and semantic similarity (Sentence-BERT embeddings)**, while storing user profiles and preferences in MongoDB.  

---

## ✨ Features  

- 🔑 **User Authentication**  
  - Secure registration & login with **bcrypt password hashing** and **JWT authentication**.  
  - Password reset flow with **email verification via SMTP + JWT tokens**.  

- 👤 **User Profiles**  
  - Stores user info, preferences, and liked movies in **MongoDB**.  
  - Personalized greetings and movie suggestions.  

- 🎥 **AI-Powered Recommendations**  
  - **Semantic recommendation engine** powered by **Sentence-BERT embeddings**.  
  - Uses **cosine similarity** + **Approximate Nearest Neighbors (FAISS)** for efficient retrieval.  
  - Clustering with **MiniBatch K-Means** for organizing movies into themes.  

- 🌐 **Frontend (React.js)**  
  - Handles authentication tokens, interactive UI, and dynamic movie lists.  
  - Clean state management with hooks (`useState`, `useEffect`).  

- ⚡ **Backend (FastAPI / Flask)**  
  - API endpoints for authentication, recommendations, and profile management.  
  - Robust error handling with JSON responses.  
  - Asynchronous request handling & multi-threading for performance.  

---

## 🛠️ Tech Stack  

- **Frontend:** React.js, Axios, HTML/CSS  
- **Backend:** FastAPI (Python), Flask (for prototyping)  
- **Database:** MongoDB (PyMongo)  
- **AI/NLP:** Sentence-BERT, FAISS, MiniBatch K-Means, cosine similarity  
- **Security:** bcrypt, JWT, HTTPS cookies, CORS handling  
- **Other Tools:** smtplib for email, concurrent futures for threading  

---

- 📊 **Machine Learning Highlights**
    -**SBERT** – encodes movies & prompts into embeddings.
    -**FAISS ANN Index** – speeds up vector search.
    -**Cosine Similarity** – measures semantic closeness.
    -**MiniBatch K-Means** – organizes movies into thematic clusters.

- 📈 ***What I Learned***
    - Building full-stack AI apps with React + Python.
    - Handling authentication securely with bcrypt & JWT.
    - Using semantic embeddings for smarter recommendations.
    - Scaling search with FAISS & clustering.
    - Managing user profiles with MongoDB.
    - Debugging CORS issues, JWT storage, and async operations.

- 🚀 **Future Improvements**
    - Support for multiple recommendation strategies (collaborative     filtering + content-based).
    - Deploy to Docker + cloud hosting.
    - Expand dataset with real-time movie metadata APIs.

- ***How To Run:***
  - Get DataSet and put it in Backend repo, Link : https://drive.google.com/file/d/1bXtcnbh7l44RzFOWubQqyWvU3GljwlOb/view?usp=sharing
  - Cd Backend => python server.py
  - cd app- => npm run dev
  