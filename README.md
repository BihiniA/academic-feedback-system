# AI Academic Feedback System

An AI-powered academic feedback system designed to help academic staff generate, review, edit, approve, and manage personalized feedback for student assignments.

## 1. Overview

The AI Academic Feedback System provides a centralized platform where academic staff can submit assignment information and student answers to receive AI-generated academic feedback.

The system supports a human-in-the-loop approach, allowing academic staff to review and modify AI-generated feedback before approving the final results.

The system is designed to support the following academic staff roles:

- Instructor
- Assistant Lecturer
- Lecturer
- Senior Lecturer
- Professor

## 2. Main Features

### 2.1 Academic Staff Registration

Academic staff can register using the following details:

- Full Name
- Email
- Academic Role
- Staff ID
- Contact Number
- Password
- Confirm Password

Supported academic roles include Instructor, Assistant Lecturer, Lecturer, Senior Lecturer, and Professor.

### 2.2 Academic Staff Login

<<<<<<< HEAD
Registered academic staff can log in using their email address and password. After successful authentication, they can access the academic dashboard.
=======
The current application allows users to access the system directly by clicking the Sign In button without entering an email address or password.

After clicking Sign In, users are redirected to the academic dashboard and can access the available feedback management functions.

Note: This is the current demonstration implementation. Authentication and credential verification are not required for this login flow.
>>>>>>> f0c2305e0a1201eea0914dc1a4e7a8f0a623c1e5

### 2.3 Dashboard

The dashboard provides an overview of the system and access to the main feedback management functions.

### 2.4 Create New Feedback

Academic staff can create a feedback request by providing:

- Module
- Assignment Name
- Student Name and Student ID
- Assignment Questions
- Question Specification
- Marking Rubric
- Student Answer or Programming Code

The question specification and marking rubric can be optional, depending on the assignment requirements.

### 2.5 AI-Generated Feedback

The system analyses the assignment information and student answer to generate academic feedback. The generated feedback may identify:

- Strengths
- Coding Errors
- Logical Weaknesses
- Missing Requirements
- Improvement Suggestions
- Rubric-Based Suggested Marks
- Personalized Academic Feedback

AI-generated marks and feedback are suggestions and should be reviewed by an academic staff member.

### 2.6 Edit, Review and Approve Feedback

Academic staff can review AI-generated results, edit feedback where necessary, adjust marks, add lecturer comments, and approve the final result.

The system maintains a distinction between AI-suggested results and lecturer-approved results.

### 2.7 Feedback History

Academic staff can view previously generated feedback records.

The feedback history supports:

- Searching feedback records
- Filtering records by status
- Viewing assignment information and student answers
- Reviewing AI-generated analysis and suggested marks
- Editing feedback for lecturer review
- Viewing lecturer-approved results
- Deleting feedback records

## 3. System Workflow

```text
Academic Staff Login
        |
        v
Academic Dashboard
        |
        v
Create New Feedback
        |
        v
Enter Assignment Information
        |
        v
Enter Student Answer
        |
        v
AI Feedback Generation
        |
        v
Review Generated Feedback
        |
        v
Edit Marks and Feedback
        |
        v
Lecturer Approval
        |
        v
Save Final Result
        |
        v
Feedback History
```

## 4. Technology Stack

The project uses the following technologies, based on the current application implementation:

| Component | Technology |
|---|---|
| Frontend | React |
| Frontend development and build tool | Vite |
| Styling | Tailwind CSS |
| Backend API | Node.js and Express.js |
| Database | MongoDB with Mongoose |
| AI feedback processing | AI service integrated with the backend |
| API communication | HTTP and JSON |

The exact AI provider and model configuration depend on the project's AI service implementation.

## 5. Software Requirements

Install the following software before running the application:

- **Node.js and npm:** Required to run the frontend and backend JavaScript applications.
- **MongoDB:** Required to store feedback records and other application data.
- **Git:** Required to clone the source code repository.
- **Visual Studio Code or another code editor:** Recommended for development and configuration.
- **A modern web browser:** Required to access the frontend.
- **AI service credentials:** Required if the configured AI service uses an external provider that requires an API key.

Use a Node.js version supported by the project's dependencies. Check the `package.json` files for the specific project scripts and dependency requirements.

## 6. Installation and Execution Instructions

### 6.1 Obtain the Source Code

Clone the repository:

```bash
git clone https://github.com/BihiniA/academic-feedback-system.git
```

Navigate into the project directory:

```bash
cd academic-feedback-system
```

Replace the repository URL and directory name with the actual values used in your GitHub repository.

### 6.2 Configure the Backend

Open a terminal and navigate to the backend directory.

For example, if the backend is stored in a folder named `backend`:

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory using the environment variables required by the backend implementation.

Example configuration:

```env
PORT=7000
MONGODB_URI=mongodb+srv://bihiniamarasinghe98_db_user:67oyhYtycKCCry3L@cluster0.2wy3g6h.mongodb.net/?appName=Cluster0
GEMINI_API_KEY=AQ.Ab8RN6IBqNftsehd5N8jcu1MSPe86Dl6bqtQIdrRI3oPAIjWQw
```

These are example variable names. Confirm the actual names required by the backend configuration and AI service before running the application.

Do not commit real API keys, database credentials, or passwords to GitHub.

Start the backend using the script defined in its `package.json`. For example:

```bash
npm run dev
```

If the project does not define a `dev` script, use the appropriate existing start script.

The frontend currently communicates with the feedback API at:

```text
http://localhost:7000/api/feedback
```

Ensure that the backend is configured to use the expected port and that the API routes are registered correctly.

### 6.3 Configure the Frontend

Open another terminal and navigate to the frontend directory.

For example:

```bash
cd frontend
npm install
```

Configure the frontend API base URL if the project uses an environment variable for it. If the API URL is hardcoded, update it to match the backend address.

Start the frontend using the script defined in its `package.json`. For a typical Vite project:

```bash
npm run dev
```

Open the local URL displayed in the terminal, commonly:

```text
http://localhost:5173
```

The exact URL may differ depending on the Vite configuration.

### 6.4 Run Both Applications

Keep the backend and frontend running in separate terminals.

1. Start MongoDB or confirm that the configured MongoDB instance is accessible.
2. Start the backend API.
3. Start the frontend application.
4. Open the frontend URL in a browser.
5. Register or log in if authentication is configured.
6. Create a feedback request and enter the assignment and student answer details.
7. Review the generated feedback.
8. Edit and approve the final result where required.
9. View the saved record in Feedback History.

## 7. API and Configuration Information

### 7.1 Backend API

The frontend communicates with the backend through HTTP requests.

The following endpoints represent the feedback routes used or expected by the current application. Confirm them against the backend router before deployment.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/feedback` | Retrieve feedback history |
| POST | `/api/feedback` | Create a feedback record and generate AI feedback |
| GET | `/api/feedback/:id` | Retrieve an individual feedback record |
| PUT | `/api/feedback/:id/approve` | Save lecturer-approved feedback |
| DELETE | `/api/feedback/:id` | Delete a feedback record |

The exact request body and response format depend on the backend controller implementation.

### 7.2 Configuration Requirements

The following configuration items may be required:

- Backend port
- MongoDB connection string
- AI service API key or credentials, if applicable
- Frontend API base URL
- CORS configuration allowing the frontend origin to communicate with the backend

Keep environment-specific configuration in appropriate environment files rather than hardcoding credentials in source code.

### 7.3 Database

MongoDB is used to persist feedback records through Mongoose.

The database must be available and the connection string must be configured correctly before the application can save or retrieve records.

## 8. Sample Login Details

No default sample account is specified in this README.

If the application provides a registration function, register an academic staff account through the application and use those credentials to log in.

<<<<<<< HEAD
If a demonstration account is provided separately for assessment, enter the approved demonstration credentials here:

- **Email:** `<DEMO_EMAIL>`
- **Password:** `<DEMO_PASSWORD>`

=======
>>>>>>> f0c2305e0a1201eea0914dc1a4e7a8f0a623c1e5
Replace these placeholders only with valid demonstration credentials. Do not publish personal passwords or production account credentials in a public repository.

## 9. Known Limitations

- AI-generated feedback and marks may contain inaccuracies and require lecturer review.
- Suggested marks depend on the quality and completeness of the assignment questions, marking rubric, and student answer supplied.
- The system does not replace the professional judgement of academic staff.
- AI feedback generation depends on the availability and correct configuration of the integrated AI service.
- Database operations depend on a valid MongoDB connection.
- Local development URLs and configuration may need to be changed for deployment.
- Authentication security, role-based authorization, and production access controls must be verified before public deployment.
- The application has not been established as a substitute for formal academic assessment procedures.

Additional limitations may apply depending on the current implementation and deployment environment.

## 10. Security and Data Protection

- Never commit `.env` files containing real credentials.
- Do not expose AI service API keys in frontend source code.
- Use appropriate authentication and authorization to restrict access to student information and feedback records.
- Use secure configuration and HTTPS when deploying outside a local development environment.
- Ensure that student data is handled according to applicable institutional policies and data protection requirements.

## 11. Project Status

The project is intended to support the generation, review, editing, approval, and management of academic feedback.

The available features depend on the current implementation and configuration. Verify registration, login, AI generation, database persistence, lecturer approval, and deletion before using the system in a production environment.

<<<<<<< HEAD
## 12. License

Add the applicable project license here if one has been selected. If this is an academic project without a published license, specify the intended usage and distribution terms as required by the institution.
=======
## 12. Application Screenshots

The following screenshots demonstrate the user interface of the AI Academic Feedback System.

### Dashboard

Displays the main dashboard and available feedback management functions.

<img width="1898" height="842" alt="image" src="https://github.com/user-attachments/assets/c7f990f5-6f9f-452a-9c51-a4204757ae9e" />
<img width="1918" height="861" alt="image" src="https://github.com/user-attachments/assets/0a0ec402-1674-45ad-ad74-92b9ca35dbc9" />

### Create Feedback

Allows academic staff to enter assignment questions, marking criteria, and student answers for AI-assisted feedback generation.

<img width="1918" height="837" alt="image" src="https://github.com/user-attachments/assets/d289a1d2-dc5b-4c8d-9665-0842761e5aa8" />

### Feedback Review

Displays the generated feedback for academic review and approval.

<img width="1632" height="835" alt="image" src="https://github.com/user-attachments/assets/7590a91a-b8ee-41da-8a2a-cbffcb282763" />

### Feedback History

Displays previously created feedback records and available management actions.

<img width="1901" height="868" alt="image" src="https://github.com/user-attachments/assets/19ec1095-385c-423d-a9cf-4bb007d83bd7" />


>>>>>>> f0c2305e0a1201eea0914dc1a4e7a8f0a623c1e5
