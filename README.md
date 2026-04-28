# 🎍 Plant Care Website

A beautiful, responsive website for plant care enthusiasts. Developed with HTML, CSS, JavaScript, and Node.js (Express) with MongoDB integration.

## 👤 Author Information
- **Name**: David Antony A
- **Email**: davidantony@karunya.edu.in
- **License**: ISC

---

## 🚀 How to Run Locally

Follow these steps to get the project running on your local machine:

1.  **Prerequisites**:
    - [Node.js](https://nodejs.org/) installed.
    - [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally.

2.  **Installation**:
    Open your terminal in the project directory and run:
    ```bash
    npm install
    ```

3.  **Run the Server**:
    Execute the following command:
    ```bash
    npm start
    ```
    The server will start at `http://localhost:3000`.

4.  **Verification**:
    - Open your browser and go to `http://localhost:3000`.
    - You should see the website running.
    - To check if the database is working, fill out the "Contact Us" form and click "Send Message".
    - Check your terminal; you should see `Form data inserted: { ... }`.

---

## ☁️ How to Deploy on Vercel

Since you have already pushed the project to GitHub, follow these steps to deploy:

1.  **Login to Vercel**: Go to [vercel.com](https://vercel.com/) and sign in with your GitHub account.
2.  **Import Project**: Click on **"Add New"** > **"Project"** and import your `Plant-Care-Website-main` repository.
3.  **Environment Variables**:
    - For the database to work on Vercel, you cannot use `localhost`. You must use a remote database like **MongoDB Atlas**.
    - If you set up a remote DB, you can update the `url` in `sample.js` to use an environment variable:
      `const url = process.env.MONGODB_URI || 'mongodb://localhost:27017';`
4.  **Deploy**: Click **"Deploy"**. Vercel will use the `vercel.json` file I created to set up the routes and serverless functions.

---

## 🔍 Checking if the Database is Working Properly

To verify your MongoDB connection:
1.  **Local Check**: Ensure the MongoDB service is running. You can check this by running `mongosh` in your terminal.
2.  **Data Check**: Use [MongoDB Compass](https://www.mongodb.com/products/compass) to view your data.
    - Connection String: `mongodb://localhost:27017`
    - Database: `sample`
    - Collection: `project1`
3.  **Code Check**: When you submit the form, if the connection fails, you will see an error in the terminal: `Error inserting form data: ...`. If it succeeds, you'll see the success message.

---

## ✨ Features
- Fully Responsive (Mobile First)
- Dark and Light Mode
- Smooth Scroll Animations
- Working Contact Form (MongoDB)
