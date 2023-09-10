const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//Middlewire

app.use(cors());
app.use(express.json());

// console.log(process.env.DB_USER);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ba6swbi.mongodb.net/?retryWrites=true&w=majority`

app.get('/', (req, res) => {
    res.send('Data base sending check')
})

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const serviceCollections = client.db("Server-CarDR").collection("services");
        const bookingsCollections = client.db("Server-CarDR").collection("bookings");

        app.get('/services', async (req, res) => {
            const cursor = serviceCollections.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }

            const options = {
                projection: { title: 1, price: 1, service_id: 1, img: 1 }
            }

            const result = await serviceCollections.findOne(query, options);
            res.send(result);
        })

        //Booking DataBase

        app.get('/checkout', async (req, res) => {
            console.log(req.query);
            const result = await bookingsCollections.find().toArray();
            res.send(result);
        })

        app.post('/checkout', async (req, res) => {
            const bookings = req.body;
            console.log(bookings);
            const result = await bookingsCollections.insertOne(bookings);
            res.send(result);
        })

        app.delete('/checkout/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await bookingsCollections.deleteOne(query);
            res.send(result);
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Server is running: ${port}`);
})


