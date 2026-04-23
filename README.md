# 🚀 MockAPI Pro

A dynamic mock API generator platform that allows developers to create, manage, and test REST APIs without writing backend code.

---

## 📌 Overview

MockAPI Pro enables frontend developers and QA engineers to generate realistic API responses instantly using schema-based configurations.

It removes dependency on backend development during early stages of product building and testing.

---

## ✨ Features

### 🔐 Authentication

* JWT-based authentication
* Secure password hashing using bcrypt

### 📁 Project Management

* Create, update, delete projects
* Unique API key for each project

### ⚙️ Dynamic Mock API Engine

* Catch-all route: `/mock/:projectId/*`
* Dynamic route matching
* Supports path parameters (`/users/:id`)
* Query parameter passthrough

### 🎲 Data Generation

* Schema-based response generation
* Faker.js integration
* Supports nested objects and arrays

### 🚦 Rate Limiting

* Redis-based rate limiting
* Prevents API abuse

### 📊 Request Logging & Analytics

* Logs every request (IP, endpoint, response time)
* Analytics:

  * Total requests
  * Top endpoints
  * Requests over time

### 🛡️ Security & Optimization

* Helmet.js for security headers
* Input validation (express-validator)
* Global error handling middleware
* MongoDB indexing for performance
* TTL index for automatic log cleanup

---

## 🏗️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Authentication:** JWT
* **Caching:** Redis
* **Data Generation:** Faker.js

---

## 📂 Project Structure

```
src/
 ├── controllers/
 ├── models/
 ├── routes/
 ├── middleware/
 ├── utils/
 └── server.js
```

---

## ⚙️ Setup Instructions

### 1. Clone repository

```
git clone <your-repo-link>
cd mockapi-pro
```

### 2. Install dependencies

```
npm install
```

### 3. Configure environment variables

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
REDIS_URL=your_redis_url
```

### 4. Run server

```
npm run dev
```

---

## 🧪 API Usage

### Create Project

```
POST /api/projects
```

### Create Endpoint

```
POST /api/projects/:projectId/endpoints
```

### Mock API Example

```
GET /mock/:projectId/users/1
```

### Analytics

```
GET /api/projects/:projectId/analytics
```

---

## 📈 Example Response

```json
{
  "id": "123",
  "name": "John Doe"
}
```

---

## 🎯 Key Highlights

* Built a dynamic API engine with runtime route matching
* Implemented Redis-based rate limiting for scalability
* Designed MongoDB aggregation pipelines for analytics
* Developed a logging system with TTL-based cleanup

---

## 🚀 Future Improvements

* Frontend dashboard (React)
* Swagger API documentation
* Role-based access control

---

## 👩‍💻 Author

Shambhavi Kulkarni

---

## ⭐ If you like this project, give it a star!

