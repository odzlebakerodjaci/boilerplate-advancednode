https://fork-quick-parcel.glitch.me

require('dotenv').config();
const { MongoClient } = require('mongodb');

async function main(callback) {
    const URI = process.env.MONGO_URI; // Declare MONGO_URI in your .env file
    const client = new MongoClient(URI);

    async function checkDBConnection() {
        try {
            await client.connect(); // Povezivanje na MongoDB
            console.log('Uspesna konekcija sa bazom!');
            await client.close(); // Zatvori konekciju nakon provere
        } catch (err) {
            console.error('Greška prilikom povezivanja sa bazom:', err);
        }
    }

    // Pozivanje funkcije za proveru konekcije
    await checkDBConnection();

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Make the appropriate DB calls
        await callback(client);

    } catch (e) {
        // Catch any errors
        console.error(e);
        throw new Error('Unable to Connect to Database');
    }
}

module.exports = main;
