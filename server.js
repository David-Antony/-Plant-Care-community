require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');

// Create an Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files (like index.html)
app.use(express.static(path.join(__dirname)));

// MongoDB connection configuration
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'plant_care_db';

// Handle form submission
app.post('/submit', async (req, res) => {
    const { email, subject, message } = req.body;
    const client = new MongoClient(url);
    
    try {
        await client.connect();
        const db = client.db(dbName);
        const collectionName = process.env.COLLECTION_NAME || 'submissions';
        const collection = db.collection(collectionName);

        const result = await collection.insertOne({ 
            email, 
            subject, 
            message,
            timestamp: new Date()
        });
        console.log(`[SUCCESS] New message from ${email}. ID: ${result.insertedId}`);

        res.json({ success: true, message: 'Message sent successfully!' });
    } catch (err) {
        console.error('[ERROR] Database insertion failed:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});


const nodemailer = require('nodemailer');

app.post('/subscribe', async (req, res) => {
    const { email } = req.body;
    
    // Check if credentials are provided
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email credentials missing! Please add EMAIL_USER and EMAIL_PASS to your .env file.' 
        });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to PlantCare Community!',
            text: `Thank you for visiting the website and joining our community!

This is a demo full stack application built by me.

Thank you,
David Antony A`
        };

        await transporter.sendMail(mailOptions);
        console.log('Real email sent successfully to ' + email);
        res.json({ success: true, message: 'Subscribed successfully!' });
    } catch (err) {
        console.error('Error sending real email:', err);
        res.status(500).json({ success: false, message: 'Failed to send email. Check your App Password.' });
    }
});

// Database health check endpoint
app.get('/db-check', async (req, res) => {
    const client = new MongoClient(url);
    try {
        await client.connect();
        await client.db(dbName).command({ ping: 1 });
        res.json({ status: 'connected', message: 'Database is working properly!' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Database connection failed', error: err.message });
    } finally {
        await client.close();
    }
});

// Start the server
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

module.exports = app;
