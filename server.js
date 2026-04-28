require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');

// Create an Express app
const app = express();
const port = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (like index.html)
app.use(express.static(path.join(__dirname)));

// MongoDB connection URL and database name
// MongoDB connection configuration
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'sample';

// Handle form submission
app.post('/submit', async (req, res) => {
    const { email, subject, message } = req.body;

    // Connect to MongoDB
    const client = new MongoClient(url);
    
    try {
        await client.connect();
        const db = client.db(dbName);
        const collectionName = process.env.COLLECTION_NAME || 'project1';
        const collection = db.collection(collectionName);

        // Insert form data into the 'project1' collection
        const result = await collection.insertOne({ email, subject, message });
        console.log('Form data inserted:', result);

        // Send a success response to the user
        res.send('Form submitted successfully!');
    } catch (err) {
        console.error('Error inserting form data:', err);
        res.status(500).send('Error submitting form');
    } finally {
        await client.close();
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
