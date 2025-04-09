# Job Application Tracker - Backend

This directory contains the backend API server for the Job Application Tracker application, built with Node.js, Express, and PostgreSQL.

## Prerequisites

* [Node.js](https://nodejs.org/) (LTS version recommended)
* [npm](https://www.npmjs.com/) (usually comes with Node.js)
* [PostgreSQL](https://www.postgresql.org/) database server running.

## Installation

1. **Clone the repository (if you haven't already):**

   ```bash
   git clone <your-repository-url>
   cd job-application-tracker/backend
   ```
2. **Install dependencies:**

   ```bash
   npm install
   ```

## Configuration

1. **Set up Environment Variables:**

   * Create a `.env` file in the `backend` directory by copying the example file:
     ```bash
     cp .env.example .env
     ```
   * Edit the `.env` file and replace the placeholder values with your actual PostgreSQL database credentials (`DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_HOST`, `DB_PORT`) and a secure `JWT_SECRET`.
   * Adjust the `PORT` if needed (default is 5001).
2. **Database Setup:**

   * Ensure your PostgreSQL server is running.
   * Create the database specified in your `.env` file (e.g., `job_tracker_db`).
   * Run the necessary SQL commands or migrations to create the `applications` table. You can find an example schema in the project documentation or use a migration tool like Sequelize CLI if configured.
     * *(Optional: If using Sequelize migrations)*
       ```bash
       # Configure config/config.json (or ensure it reads from .env)
       npx sequelize-cli db:migrate
       ```

## Running the Application

1. **Development Mode (using ts-node for automatic recompilation):**

   * Ensure `ts-node` is installed (`npm install -D ts-node`)
   * Start the server:
     ```bash
     npm run dev
     ```

   *(You might need to add `"dev": "ts-node server.ts"` to the `scripts` section in your `package.json`)*
2. **Production Mode:**

   * **Build the TypeScript code:**
     ```bash
     npm run build
     ```

     *(This requires a `"build": "tsc"` script in your `package.json`)*
   * **Start the server:**
     ```bash
     npm start
     ```

     *(This requires a `"start": "node dist/server.js"` script in your `package.json`)*

The server will start, typically on `http://localhost:5001` (or the port specified in your `.env` file).

## API Endpoints

The API provides the following endpoints under the `/api/applications` base path:

* `GET /`: Get all job applications.
* `POST /`: Create a new job application.
* `GET /:id`: Get a specific job application by its ID.
* `PUT /:id`: Update a specific job application by its ID.
* `DELETE /:id`: Delete a specific job application by its ID.
