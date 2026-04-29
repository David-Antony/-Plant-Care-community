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
const url = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || 'plant_care_db';
let db;

// Connection options for maximum reliability
const client = new MongoClient(url, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
});

async function connectDB(retries = 5) {
    while (retries) {
        try {
            await client.connect();
            db = client.db(dbName);
            console.log('------------------------------------');
            console.log('[🚀 SUCCESS] Database Connected Successfully');
            console.log('[🚀 STATUS] Ready for submissions');
            console.log('------------------------------------');
            break;
        } catch (err) {
            retries -= 1;
            console.error(`[⚠️ WARNING] Connection failed. Retries left: ${retries}`);
            console.error(`[ℹ️ REASON] ${err.message}`);
            if (retries === 0) {
                console.log('------------------------------------');
                console.log('[❌ CRITICAL ERROR] Could not connect to MongoDB Atlas.');
                console.log('[💡 TIP] Check your IP Whitelist and Port 27017 access.');
                console.log('------------------------------------');
            }
            // Wait 5 seconds before retrying
            await new Promise(res => setTimeout(res, 5000));
        }
    }
}
connectDB();

// Handle form submission
app.post('/submit', async (req, res) => {
    const { email, subject, message } = req.body;
    
    if (!db) {
        return res.status(503).json({ 
            success: false, 
            message: 'Database is currently offline. Please check your network or Atlas IP Whitelist and try again in a moment.' 
        });
    }

    try {
        const collection = db.collection(process.env.COLLECTION_NAME || 'submissions');
        const result = await collection.insertOne({ 
            email, 
            subject, 
            message,
            timestamp: new Date()
        });
        res.json({ success: true, message: 'Message sent successfully!' });
    } catch (err) {
        console.error('[❌ ERROR] Submission failed:', err.message);
        res.status(500).json({ success: false, message: 'Could not save message. Please try again later.' });
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
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
