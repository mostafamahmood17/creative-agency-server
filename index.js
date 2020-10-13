const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;

require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9na52.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
const port = 5000




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db(`${process.env.DB_NAME}`).collection("services");
  console.log("server connected")

  app.post('/addServices', (req, res) => {
    const service = req.body;
    console.log(service)
    serviceCollection.insertOne(service)
    .then(result => {
      console.log(result);
      res.send(result)
    console.log(service)
  })
})
});



app.get('/', (req, res) => {
    res.send('welcome to server of creative agency')
  })


app.listen(process.env.PORT || port)