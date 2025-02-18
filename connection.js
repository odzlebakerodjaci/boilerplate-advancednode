require('dotenv').config();
const { MongoClient } = require('mongodb');

async function myDB(callback) {
  const client = new MongoClient(process.env.MONGO_URI);

  try {
    // Connect to the MongoDB cluster
    await client.connect();
    console.log('Successfully connected to MongoDB');
    await callback(client); // Call the function with the connected client
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw err; // Re-throw the error to handle it in server.js
  }
}

module.exports = myDB;
