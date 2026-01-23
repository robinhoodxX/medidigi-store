
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://superhaiderkhan_db_user:R6Caxj9GYSmyMjX2@cluster0.8k30hmg.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: true,
  }
});

let connected = false;

async function connectDB() {
  if (connected) return client;

  await client.connect();
  await client.db("admin").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
  connected = true;
  return client;
}

module.exports = connectDB;
