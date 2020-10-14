const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;

require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9na52.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static('services'));
app.use(fileUpload());

const port = 5000




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db(`${process.env.DB_NAME}`).collection("services");
  const reviewCollection = client.db(`${process.env.DB_NAME}`).collection("reviews");
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

app.post('/addReviews', (req, res) => {
  const reviews = req.body;
  console.log(reviews)
  reviewCollection.insertOne(reviews)
  .then(result => {
    console.log(result);
    res.send(result)
  console.log(reviews)
})
})

app.get('/reviews', (req, res) => {
  reviewCollection.find({})
  .toArray((err, document)=>{
    res.send(document)
  })
});

// app.post('/addServices', (req, res) => {
  
//   const file = req.files.file;
//   const name = req.body.name;
//   const email = req.body.email;
//   const newImg = file.data;
//   const encImg = newImg.toString('base64');
//   console.log(file)

//   var image = {
//       contentType: file.mimetype,
//       size: file.size,
//       img: Buffer.from(encImg, 'base64')
//   };

//   serviceCollection.insertOne({ name, email, image })
//       .then(result => {
//           res.send(result.insertedCount > 0);
//       })
// })
});



app.get('/', (req, res) => {
    res.send('welcome to server of creative agency')
  })


app.listen(process.env.PORT || port)