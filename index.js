const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs-extra')
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
// 4 collections


  const serviceCollection = client.db(`${process.env.DB_NAME}`).collection("services");
  const reviewCollection = client.db(`${process.env.DB_NAME}`).collection("reviews");
  const orderCollection = client.db(`${process.env.DB_NAME}`).collection("orders");
  const adminCollection = client.db(`${process.env.DB_NAME}`).collection("createAdmin");
  
  console.log("server connected")

  // review collection

app.post('/addReviews', (req, res) => {
  const reviews = req.body;
  reviewCollection.insertOne(reviews)
  .then(result => {
    console.log(result);
    res.send(result)
  
})
})

// review send to ui
app.get('/reviews', (req, res) => {
  reviewCollection.find({}).limit(6)
  .toArray((err, document)=>{
    res.send(document)
  })
});


// add service
app.post('/addServices', (req, res) => {
  
  const file = req.files.file;
  const name = req.body.name;
  const description=req.body.description;
  const status = req.body.upd;
  const picture = req.body.pict;
  console.log(picture)
  const filePath = `${__dirname}/services/${file.name}`;
  
  file.mv(filePath, err =>{
    
    if(err){
      console.log(err);
      res.status(500).send({msg: 'Failed to upload Image'});
    }
    const newImg = fs.readFileSync(filePath);
    const encImg = newImg.toString('base64');

    var image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, 'base64')
  };
    serviceCollection.insertOne({name, description, status, picture, image})
    .then(result=>{
      fs.remove(filePath, error => {
       
        if(error){
          console.log(error)
          res.status(500).send({msg: 'Failed to upload Image'});
        }
        res.send(result.insertedCount>0)
      })
      
    })
          
  })
  
})


// send services
app.get('/services', (req, res) => {
  serviceCollection.find({})
  .toArray((err, document)=>{
    res.send(document)
  })
});

app.post('/orderInfo', (req, res) => {
  const order = req.body;
  orderCollection.insertOne(order)
  .then(result => {
    res.send(result)
  
})
})

// order list for users
app.get('/order/:email', (req, res) => {
  const email = req.params.email;
  orderCollection.find({email : email})
  .toArray((err, document)=>{
    res.send(document)
    console.log(document)
    
  })
});

// filter email for differentiates admin and user
app.get('/allOrder/:email', (req, res) => {
const email = req.params.email;
adminCollection.find({email : email})
    .toArray((err, admin) => {
        let filter;
        if (admin.length === 0) {
            filter={email : email};
        }
      if (filter) {
        orderCollection.find(filter)
        .toArray((err, documents) => {
            
            res.send(documents);
        })
      } else {
        orderCollection.find()
        .toArray((err, documents) => {
            
            res.send(documents);
        })
        
      }
          
    })
})


// admin create
app.post('/createAdmin', (req, res) => {
  const admin = req.body;
  adminCollection.insertOne(admin)
  .then(result => {
    res.send(result)
  
})
})

// admin email set
app.post('/isAdmin', (req, res) => {
  const email = req.body.email;
  adminCollection.find({ email: email })
      .toArray((err, admin) => {
          res.send(admin.length > 0);
      })
})
// update status by admin
// app.patch('/projectStatus', (req,res) => { 
//   orderCollection.updateOne({_id : ObjectId(req.body.id)},
//       {
//           $set: { status: req.body.updateProject},
//       }
//   )
//   .then(result =>{
//       res.send(result.modifiedCount > 0)
//       console.log(result)
//   })
// })

});



app.get('/', (req, res) => {
    res.send('welcome to server of creative agency')
  })


app.listen(process.env.PORT || port)


