const express = require('express')
const app = express();
require('dotenv').config()
const cors = require('cors');
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion } = require('mongodb');


/* configaration 
  DB_USER = doctorDB
  DB_PASS = 7oi7WHzOrg78MK4j 
*/


app.use(cors());
app.use(express.json())
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m9khx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        await client.connect();
        const appointmentCollection = client.db('doctors_portal').collection('appointments');
        const usersCollection = client.db('doctors_portal').collection('users');
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

        app.get('/users/:email', async(req, res)=>{
          const email= req.params.email;
          const query ={ email: email};
          const user = await usersCollection.findOne(query);
          let isAdmin = false;
          if(user?.role === 'admin'){
            isAdmin= true;
          }
          res.json({admin: isAdmin});
        })

        app.post('/users', async(req,res)=>{
          const user = req.body;
          const result = await usersCollection.insertOne(user);
          res.json(result);
        })

        app.put('/users', async(req,res)=>{
          const user = req.body;
          const filter = {email: user.email};
          const options = { upsert: true };
          const updateDoc = { $set : user};
          const result = await usersCollection.updateOne(filter, updateDoc, options);
          res.json(result);

        })

        app.put('/users/admin',async(req, res)=>{
          const user = req.body;
          console.log('put', user);
          const filter = {email: user.email};
          const updateDoc = {$set : {role: 'admin'}};
          const result = await usersCollection.updateOne(filter, updateDoc);
          res.json(result)
        })
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