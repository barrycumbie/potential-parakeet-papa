require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000;  
const bodyParser = require('body-parser')
const { ObjectId } = require('mongodb')
const { MongoClient, ServerApiVersion } = require('mongodb');

const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs');

async function cxnDB(){

  try{
    client.connect; 
    const collection = client.db("CIS486").collection("people");
    // const collection = client.db("papa").collection("dev-profiles");
    const result = await collection.find().toArray();
    //const result = await collection.findOne(); 
    console.log("cxnDB result: ", result);
    return result; 
  }
  catch(e){
      console.log(e)
  }
  finally{
    client.close; 
  }
}


/*app.get('/', (req, res) => {
  //res.send('Hello from Group 6 <br/> <a href="mongo">mongo</a>');

  res.render('index'); 

})*/

app.get('/', async (req, res) => {

  let result = await cxnDB().catch(console.error); 

  // console.log("get/: ", result);

  res.render('index', {  peopleData : result })
})

app.get('/mongo', async (req, res) => {

  // res.send("check your node console, bro");

  let result = await cxnDB().catch(console.error); 

  res.render('index', {  peopleData : result })

  res.send(`new thing!!! ${ result[1].name }` ); 

})

app.get('/update', async (req, res) => {

  //get data from the form 

  console.log("in get to slash update:", req.query.ejsFormName); 
  name_input = req.query.ejsFormName; 

  //update in the database. 
  client.connect; 
  const collection = client.db("CIS486").collection("people");
  await collection.insertOne({ 
    name: name_input
})

})


app.post('/deletePerson/:id', async (req, res) => {

  try {
    console.log("req.parms.id: ", req.params.id) 
    
    client.connect; 
    const collection = client.db("CIS486").collection("people");
    let result = await collection.findOneAndDelete( { _id: new ObjectId( req.params.id) })
    .then(result => {
      console.log(result); 
      res.redirect('/');
    })
    .catch(error => console.error(error))
  }
  finally{
    //client.close()
  }

})

console.log('in the node console');

app.listen(PORT, () => {
  console.log(`Example app listening on port ${ PORT }`)
})