# Task Manager API

## Description

The Task Manager API is a backend application built with Node.js and Sequelize, designed to help users manage their daily tasks. It supports CRUD operations for tasks, task categorization, and soft deletion of tasks. Users can manage their tasks by assigning categories, updating task details, and marking tasks as deleted without physically removing them from the database.

---

## Features

- **Task Management**: Users can create, read, update, and delete tasks.
- **Categories**: Tasks can be categorized into different groups (e.g., Work, Personal, etc.).
- **Soft Delete**: Tasks can be marked as deleted but not physically removed from the database, allowing for recovery.

---

## Technologies Used

- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework for Node.js.
- **Sequelize**: ORM (Object-Relational Mapper) for interacting with PostgreSQL.
- **PostgreSQL**: Relational database management system.

---

## Installation

### Prerequisites

- **Node.js** (v14 or later)
- **PostgreSQL** (You can use a hosted database like Heroku or a local installation)

### Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/task-manager-api.git
    cd task-manager-api
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables. Create a `.env` file in the root directory with the following content:

    ```env
    DATABASE_URL=your_postgresql_connection_string
    ```

    Replace `your_postgresql_connection_string` with your actual PostgreSQL connection string (e.g., `postgres://username:password@host:port/database_name`).

4. Sync the database:
    ```bash
    npm run sync
    ```

5. Start the server:
    ```bash
    npm start
    ```

    The server will run on `http://localhost:5000` by default.

---

## Endpoints

### **Categories**

- **Create Category**: `POST /categories`
    - **Request Body**:
      ```json
      {
        "name": "Work"
      }
      ```
    - **Response**:
      ```json
      {
        "id": 1,
        "name": "Work"
      }
      ```

- **Get All Categories**: `GET /categories`
    - **Response**:
      ```json
      [
        {
          "id": 1,
          "name": "Work"
        }
      ]
      ```

## Error Handling

The API returns standardized error messages in the following format:

```json
{
  "error": "Error message"
}
