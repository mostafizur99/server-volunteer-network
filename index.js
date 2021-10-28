const express = require('express');
const { MongoClient } = require('mongodb');
var cors = require('cors');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

// middleware   
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@test1.trceg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("Volunteer-network");
        const eventCollection = database.collection("Events");
        const volunteerCollection = database.collection("Volenteers");

        // GET API
        app.get('/events', async (req, res) => {
            const cursor = eventCollection.find({});
            const events = await cursor.toArray();
            res.send(events);
        });

        // POST API for events
        app.post('/events', async (req, res) => {
            const newEvent = req.body;
            const result = await eventCollection.insertOne(newEvent);
            console.log('got new event', req.body);
            console.log('added event', result);
            res.json(result);
        });

        // POST API for register volunteer
        app.post('/volunteers', async (req, res) => {
            const newVolunteer = req.body;
            const result = await volunteerCollection.insertOne(newVolunteer);
            console.log('got new event', req.body);
            console.log('added event', result);
            res.json(result);
        });



    } finally {
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Running Volunteer-network Server!')
})

app.listen(port, () => {
    console.log('Running Server on Port', port)
})