# Dynamic Form Builder

A full-stack application that allows users to create dynamic forms with different field types, store form submissions, and view responses.

## Features

- Create forms with multiple field types (Text Input, Checkbox)
- Add/remove form fields dynamically
- Mark fields as required
- View list of all created forms
- Submit responses to forms
- View form responses

## Tech Stack

- Frontend: React.js with Material-UI
- Backend: Node.js with Express
- Database: MongoDB

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or a MongoDB Atlas account)
- npm or yarn package manager

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd dynamic-form-builder
```

2. Install backend dependencies:
```bash
cd server
npm install
```

3. Install frontend dependencies:
```bash
cd ../client
npm install
```

4. Create a `.env` file in the server directory with the following content:
```
MONGODB_URI=mongodb://localhost:27017/form-builder
PORT=5000
```

5. Start the backend server:
```bash
cd ../server
npm run dev
```

6. In a new terminal, start the frontend development server:
```bash
cd ../client
npm start
```

The application should now be running at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Usage

1. Click "Create Form" to create a new form
2. Add form fields by clicking "Add Field"
3. Set field type, label, and required status
4. Save the form
5. View the form from the home page
6. Fill out and submit the form
7. View previous responses

## API Endpoints

- GET /api/forms - Get all forms
- GET /api/forms/:id - Get a specific form with responses
- POST /api/forms - Create a new form
- POST /api/forms/:id/responses - Submit a form response 