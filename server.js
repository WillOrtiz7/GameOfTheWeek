require("dotenv").config();
const express = require('express');
const app = express();
const cors = require("cors");
app.use(cors({
  origin: "*",
}));
var bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const port = 3000;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@game-of-the-week.xa6jr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
app.post("/login", function(req, res){
  console.log(req.body);
  client.connect(err => {
    if (err){
      console.log(err);
      return;
    }
    const collection = client.db("gameOfTheWeek").collection("users");
    // perform actions on the collection object
    collection.findOne({username:req.body.userName, password:req.body.password}).then((data)=>{
      res.send(data);
      console.log(data);
      client.close();
    });
  });
});

app.put("/vote", function(req, res){
  client.connect(err => {
    if (err){
      console.log(err);
      return;
    }
    const collection = client.db("gameOfTheWeek").collection("users");
    collection.findOneAndUpdate({username:req.body.userName}, {$set:{votedHome:req.body.votedHome, votedAway:req.body.votedAway}}).then((data)=>{
      res.send(true);
      console.log(data);
      client.close();
    });
  });
});

app.post("/teams", function(req, res){
  client.connect(err => {
    if (err){
      console.log(err);
      return;
    }
    const collection = client.db("gameOfTheWeek").collection("teams");
    collection.findOne({teamName:req.body.homeTeamName}, function(err, teams){
      console.log(teams);
    });
    collection.findOne({teamName:req.body.awayTeamName}, function(err, teams){
      console.log(teams);
    })
  });
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
