const express = require("express");
const http = require("http");
const path = require("path");

const app = express();

const port = process.env.PORT || 3001;

app.use(express.static(__dirname + "/dist/game-of-the-week"));

app.get("*", (req, res) => res.sendFile(__dirname + "/src/index.html"));

const server = http.createServer(app);

server.listen(port, () =>
  console.log(`App running on: http://localhost:${port}`)
);
