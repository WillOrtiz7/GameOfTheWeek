require("dotenv").config();
const express = require('express');
const app = express();
const port = 3000;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@game-of-the-week.xa6jr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
app.post("/login", function(req, res){
  console.log(req.body);
  client.connect(err => {
  const collection = client.db("gameOfTheWeek").collection("users");
  // perform actions on the collection object
  collection.findOne({userName:"Giants"}).then((data)=>{
    res.send(data);
    console.log(data);
    client.close();
  });
});
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
