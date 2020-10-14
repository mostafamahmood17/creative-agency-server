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

app.post('/addReviews', (req, res) => {
  const reviews = req.body;
  reviewCollection.insertOne(reviews)
  .then(result => {
    console.log(result);
    res.send(result)
  
})
})

app.get('/reviews', (req, res) => {
  reviewCollection.find({})
  .toArray((err, document)=>{
    res.send(document)
  })
});



app.post('/addServices', (req, res) => {
  
  const file = req.files.file;
  const name = req.body.name;
  const description=req.body.description;
  console.log(name,description,file);
  file.mv(`${__dirname}/services/${file.name}`, err =>{
    
    if(err){
      console.log(err);
      return res.status(500).send({msg: 'Failed to upload Image'});
    }
     res.send({name: file.name, path: `/${file.name}` });
          

  })
  // const newImg = file.data;
  // const encImg = newImg.toString('base64');
  // console.log(file)

  // var image = {
  //     contentType: file.mimetype,
  //     size: file.size,
  //     img: Buffer.from(encImg, 'base64')
  // };

  // serviceCollection.insertOne({ name, email, description, image })
  //     .then(result => {
  //         res.send(result.insertedCount > 0);
  //     })
})

app.get('/services', (req, res) => {
  serviceCollection.find({})
  .toArray((err, document)=>{
    res.send(document)
    console.log(document)
  })
});

});



app.get('/', (req, res) => {
    res.send('welcome to server of creative agency')
  })


app.listen(process.env.PORT || port)