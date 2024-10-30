# Project Structure and Features Documentation

## Overview

The **AI-Powered Learning and Information System (APLIS)** is a comprehensive platform designed to enhance the educational experience through advanced technology. It integrates full-stack engineering with the MERN stack, cloud services, and AI/ML capabilities. The platform features separate access points for students and staff, alongside an integrated ticket system for issue reporting.

## Project Structure

### Frontend

- **Framework**: Next.js
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Icons**: React Icons
- **Notifications**: React Hot Toast

#### Key Components

- **Dashboard**: The main interface for users, providing access to various features based on user roles.
  - `page.jsx`: Main entry point for the dashboard.
  - `Header` and `SideBar`: UI components for navigation and user information.
  - `CoursesView`, `ModulesView`, `ContentView`, etc.: Components for managing and viewing courses, modules, and content.

- **Course Management**:
  - `ModulesView.jsx`: Handles module creation, updating, and deletion.
  - `ModuleContentView.jsx`: Displays content, quizzes, and assignments within a module.
  - `ContentView.jsx`: Allows students to view and mark content as completed.

- **Assignment and Quiz Management**:
  - `AssignmentCreationView.jsx` and `QuizCreationView.jsx`: Interfaces for creating assignments and quizzes.
  - `AssignmentView.jsx`: Allows students to view and submit assignments.

- **Student Management**:
  - `StudentsView.jsx`: Displays a list of students with pagination.

### Backend

- **Database**: MongoDB with Prisma ORM
- **Authentication**: JSON Web Tokens (JWT)
- **AI/ML Integration**: Utilizes external APIs for generating feedback and recommendations.

#### Key Actions

- **Modules**:
  - `createModule`, `getModules`, `updateModule`, `deleteModule`: CRUD operations for modules.
  - `getModuleContents`, `createModuleContent`: Manage module contents.

- **Assignments**:
  - `createAssignment`, `getAssignmentsByCourseModule`: Manage assignments within courses and modules.

- **Quizzes**:
  - `createQuiz`, `getQuizzesByCourseModule`: Manage quizzes within courses and modules.

- **Submissions**:
  - `createSubmission`, `getPlainSubmissionsByUserId`: Handle student submissions for content, assignments, and quizzes.

### Configuration

- **Tailwind CSS**: Configured in `tailwind.config.js` and `postcss.config.mjs`.
- **ESLint and Prettier**: Configured for code quality and formatting.
- **Environment Variables**: Managed through `.env` files (ignored in version control).

### Deployment

- **Platform**: Vercel
- **Continuous Integration/Deployment**: Configured for seamless updates and scaling.

## Features

- **Personalized Learning**: AI/ML models provide learning recommendations and performance predictions.
- **Automated Grading**: Streamlines the grading process for assignments and quizzes.
- **Real-time Communication**: Facilitates interaction between students and staff.
- **Issue Reporting**: Integrated ticket system for reporting and tracking issues.
- **Data Privacy and Security**: Adheres to guidelines to protect user information.

## Getting Started

1. **Run the Development Server**:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

2. **Open the Application**:
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

3. **Edit and Deploy**:
   Modify `app/page.js` for changes. Deploy using Vercel for production.

## Learn More

- **Next.js Documentation**: [Next.js Docs](https://nextjs.org/docs)
- **Vercel Deployment**: [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)

---