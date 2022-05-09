const express = require('express')
const app = express();
require('dotenv').config()
const cors = require('cors');
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors());
app.use(express.json())
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m9khx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        await client.connect();
        const appointmentCollection = client.db('doctors_portal').collection('appointments');
        app.get('/appointments', async(req, res)=>{
          const email = req.query.email;
          const date = new Date(req.query.date).toLocaleDateString();
          // console.log(date);
          const query = {email: email, date: date};

          const cursor = appointmentCollection.find(query);
          const appointments = await cursor.toArray();
          res.json(appointments);
        })

        app.post('/appointments', async(req, res)=>{
          const appointment = req.body;
          const result = await appointmentCollection.insertOne(appointment);
          res.json(result);
        });
      }
    finally{
        // await client.close();
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello Doctors portal')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})