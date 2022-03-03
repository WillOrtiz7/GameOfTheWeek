const express = require("express");
const http = require("http");
const path = require("path");
const fs = require('fs');

const app = express();

const port = process.env.PORT || 3001;

const root = path.join(__dirname, 'dist', 'game-of-the-week');
app.set('view engine', 'pug');

app.get('*' ,function(req, res) {
  fs.stat(root + req.path, function(err){
    if(err){
        res.sendFile("index.html", { root });
    }else{
        res.sendFile(req.path, { root });
    }
  })
});


app.listen(port, () => {
    console.log("Server is listening on port "+port);
});
