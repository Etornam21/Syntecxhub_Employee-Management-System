# Syntecxhub_Employee-Management-System

A full-stack employee management system built with the **MERN** stack (MongoDB, Express, React, Node.js).

## Features
- Add, edit, delete and list employees (full CRUD)
- Employee data: name, email, role, department, salary, date joined
- Form validation on **both** the React client and the Express API (express-validator + Mongoose schema)
- Duplicate-email detection with a clear field-level error
- Search by name, email or role, and filter by department
- Responsive layout: table on desktop, stacked cards on mobile
- Accessible dialogs, keyboard focus states and labelled controls

## Tech stack
| Layer    | Tools                                        |
|----------|----------------------------------------------|
| Frontend | React 18, Vite, plain CSS                    |
| Backend  | Node.js, Express, express-validator, CORS    |
| Database | MongoDB with Mongoose                        |

## Getting started

**Prerequisites:** Node.js 18+ and MongoDB (local install or a MongoDB Atlas connection string).

```bash
# 1. API
cd server
npm install
cp .env.example .env      # then edit MONGO_URI if needed
npm run dev               # http://localhost:5000

# 2. Client (new terminal)
cd client
npm install
npm run dev               # http://localhost:5173
```

The Vite dev server proxies `/api` to `http://localhost:5000`, so no extra client config is needed.

## API reference
| Method | Endpoint              | Description                                      |
|--------|-----------------------|--------------------------------------------------|
| GET    | `/api/employees`      | List employees (`?search=` and `?department=`)   |
| GET    | `/api/employees/:id`  | Get one employee                                 |
| POST   | `/api/employees`      | Create an employee                               |
| PUT    | `/api/employees/:id`  | Update an employee                               |
| DELETE | `/api/employees/:id`  | Delete an employee                               |

Example body:
```json
{
  "name": "Ama Mensah",
  "email": "ama@company.com",
  "role": "Backend developer",
  "department": "Engineering",
  "salary": 8500,
  "dateJoined": "2024-03-01"
}
```

Validation errors return `400` with `{ "message": "...", "errors": { "field": "reason" } }`. Duplicate emails return `409`.

## Environment variables (`server/.env`)
| Variable        | Default                                           |
|-----------------|---------------------------------------------------|
| `PORT`          | `5000`                                            |
| `MONGO_URI`     | `mongodb://127.0.0.1:27017/employee_management`   |
| `CLIENT_ORIGIN` | `http://localhost:5173`                           |

## Screenshots
_Add screenshots of the employee list, the add/edit form and the mobile view here._

## Author
Built as Project 3 of the Syntecxhub internship program.
