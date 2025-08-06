# RBAC Blog System

This project implements a Role-Based Access Control (RBAC) blog system where users with different roles (admin and user) have distinct permissions. Admins can create and delete blog posts, while verified users can view them. The project includes email verification for user signup, JWT-based authentication, and secure access control.

## Project Overview

The goal of this project is to create a secure blog platform with the following features:

- Authentication using JSON Web Tokens (JWT).
- Role-based authorization (admin and user roles).
- Email verification for user signup (mandatory).
- Secure access to different functionalities based on user roles.
- Backend API built with Express.js and MongoDB.

## Folder Structure

The project follows a modular structure for better organization and scalability:

project/
├── src/
│   ├── controllers/              
│   │   ├── authController.ts     
│   │   └── postController.ts     
│   ├── middlewares/               
│   │   └── authMiddleware.ts      
│   ├── database/               
│   │   └── db.ts               
│   ├── models/                   
│   │   ├── user.model.ts        
│   │   └── post.model.ts       
│   ├── services/                
│   │   └── emailService.ts      
│   ├── routes.ts                
│   └── server.ts               
├── .env                         
├── tsconfig.json                 
├── package.json                  
└── README.md                    


## Technologies Used

This project is built using the following technologies and libraries, with their respective versions as of the project setup:

- **Node.js**: v20.11.1 (JavaScript runtime)
- **TypeScript**: v5.2.2 (Typed JavaScript for better type safety)
- **Express.js**: v4.18.2 (Web framework for building the API)
- **MongoDB**: v6.0.0 (NoSQL database driver for Node.js)
- **MongoDB Atlas**: Cloud-hosted MongoDB cluster for data storage
- **jsonwebtoken**: v9.0.2 (For JWT-based authentication)
- **bcryptjs**: v2.4.3 (For password hashing)
- **nodemailer**: v6.9.5 (For sending email verification)
- **ts-node**: v10.9.1 (For running TypeScript files directly)
- **@types/express**: v4.17.17 (TypeScript type definitions for Express)
- **@types/node**: v20.5.0 (TypeScript type definitions for Node.js)
- **@types/mongodb**: v4.0.7 (TypeScript type definitions for MongoDB)
- **@types/bcryptjs**: v2.4.2 (TypeScript type definitions for bcryptjs)
- **@types/jsonwebtoken**: v9.0.2 (TypeScript type definitions for jsonwebtoken)
- **@types/nodemailer**: v6.4.8 (TypeScript type definitions for nodemailer)

## Summary of Endpoints Tested

| Endpoint         | Method | Description        | Authorization | Role Restriction |
|------------------|--------|--------------------|---------------|------------------|
| `/auth/signup`   | POST   | Register user      | No            | No               |
| `/auth/verify`   | GET    | Verify email       | No            | No               |
| `/auth/login`    | POST   | Get ***JWT***      | No            | No               |
| `/posts`         | GET    | View posts         | Yes           | No               |
| `/posts`         | POST   | Create post        | Yes           | Admin only       |
| `/posts/:id`     | PATCH  | Update post        | Yes           | Admin only       |
| `/posts/:id`     | DELETE | Delete post        | Yes           | Admin only       |


## Live Deployment

The project is live at: [https://liaplusai-backend-3.onrender.com](https://liaplusai-backend-3.onrender.com). You can test the API endpoints using Postman or the Swagger documentation linked below.

## API Documentation

### Swagger Documentation

The API documentation is available through Swagger UI:

- **Local Development**: [http://localhost:3005/api-docs](http://localhost:3005/api-docs)
- **Live Deployment**: [https://liaplusai-backend-3.onrender.com/api-docs](https://liaplusai-backend-3.onrender.com/api-docs)

The Swagger documentation provides:
- Interactive API testing interface
- Complete endpoint documentation
- Request/response schemas
- Authentication requirements
- Example requests and responses



## Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js** (v20.11.1 or higher): Download from [https://nodejs.org/](https://nodejs.org/)
- **MongoDB Atlas Account**: Sign up at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) to get a MongoDB connection string.
- **Postman**: For testing API endpoints. Download from [https://www.postman.com/downloads/](https://www.postman.com/downloads/)
- **Gmail Account**: For sending email verification (you’ll need an App Password if 2FA is enabled).

## Setup Instructions

Follow these steps to set up and run the project locally:

1. **Clone or Create the Project**

   If you don’t already have the project files, create the folder structure as shown above and copy the provided code into the respective files.

 Alternatively, if the project is in a repository, clone it:
  git clone <repository-url>
cd project


2. **Install Dependencies**

Navigate to the project directory and install the required dependencies:
cd C:\Users\gsaur\OneDrive\Desktop\code\LiaplusAI\Backend
npm install


This will install all the dependencies listed in `package.json`.

3. **Set Up Environment Variables**

Create a `.env` file in the project root directory and add the following environment variables:
DATABASE_URL=mongodb+srv://liaplusAI:liaplus123@cluster7.m52j8r9.mongodb.net/blog_system?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
PORT=3000


- **DATABASE_URL**: Your MongoDB Atlas connection string. Replace `blog_system` with your database name if different.
- **JWT_SECRET**: A secure secret for JWT signing (e.g., `mysecretkey123`).
- **EMAIL_USER**: Your Gmail address for sending email verification.
- **EMAIL_PASS**: Your Gmail App Password (generate one from your Google Account settings if 2FA is enabled).
- **PORT**: The port on which the server will run (default is 3000).

4. **Verify MongoDB Connection**

Ensure your MongoDB Atlas cluster is running:

- Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- Check that your IP is whitelisted and the cluster is accessible.
- Test the connection string in `DATABASE_URL` if you encounter issues.

5. **Run the Project**

Start the server using the following command:

npm start


This will execute the `start` script defined in `package.json`:
"scripts": {
"start": "ts-node src/server.ts",
"build": "tsc"
}


## API Endpoints

### Sign Up:

- **Method**: POST
- **URL**: `http://localhost:3000/auth/signup`
- **Body (raw JSON)**:

{
"name": "Saurav Gupta",
"email": "sauravg@example.com",
"password": "password123",
"role": "user"
}


- **Response**: 201 with `{"message": "User created, please verify your email", "user": {...}}`

### Verify Email:

- **Method**: GET
- **URL**: `http://localhost:3000/auth/verify?token=<token>` (token from email)
- **Response**: 200 with `{"message": "Email verified successfully"}`

### Log In:

- **Method**: POST
- **URL**: `http://localhost:3000/auth/login`
- **Body (raw JSON)**:
{
"email": "sauravg@example.com",
"password": "password123"

}


- **Response**: 200 with `{"token": "<jwt_token>", "user": {...}}`

### Get Posts:

- **Method**: GET
- **URL**: `http://localhost:3000/posts`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Response**: 200 with an array of posts (e.g., `[]` if no posts exist)

### Create a Post (Admin Only):

- Sign up and log in as an admin user (`"role": "admin"`).
- **Method**: POST
- **URL**: `http://localhost:3000/posts`
- **Headers**: `Authorization: Bearer <admin_jwt_token>`
- **Body (raw JSON)**:
{
"title": "First Post",
"content": "This is the content of the first post."

}

- **Response**: 201 with `{"title": "First Post", "content": "...", ...}`

### Delete a Post (Admin Only):

- **Method**: DELETE
- **URL**: `http://localhost:3000/posts/<post_id>`
- **Headers**: `Authorization: Bearer <admin_jwt_token>`
- **Response**: 200 with `{"message": "Post deleted"}`

## Scripts

The `package.json` includes the following scripts:

- **`npm start`**: Runs the server using `ts-node src/server.ts`.

npm start


- **`npm run build`**: Compiles TypeScript files to JavaScript in the `dist` directory.

npm run build


## Troubleshooting

- **"Access denied" (401)**: Ensure the `Authorization` header is set to `Bearer <token>` in Postman.
- **"Email not verified" (403)**: Verify the user’s email using the verification link.
- **"Admin access required" (403)**: Use a token from an admin user for restricted actions.
- **MongoDB Connection Error**: Check your `DATABASE_URL` in `.env` and ensure your IP is whitelisted in MongoDB Atlas.
- **No Email Received**:
- Verify `EMAIL_USER` and `EMAIL_PASS` in `.env`.
- Use an App Password for Gmail if 2FA is enabled.
- Check your spam/junk folder.
- **TypeScript Errors**:
- Run `npm install` to ensure all dependencies are installed.
- Check `tsconfig.json` for correct configuration.


## Contact Information

For any questions or support, please contact:

- **Name**: Saurav Gupta
- **Email**: [gsaurav641@gmail.com](mailto:gsaurav641@gmail.com)

