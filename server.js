const http = require("http");
const mongoose = require("mongoose");

// connect mongodb
mongoose.connect("mongodb://127.0.0.1:27017/cakeDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const server = http.createServer((req, res) => {
  res.end("Server running with MongoDB");
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
