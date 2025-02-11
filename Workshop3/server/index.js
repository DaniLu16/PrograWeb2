const express = require('express');
const app = express();
// database connection
const mongoose = require("mongoose");
const db = mongoose.connect("mongodb+srv://danielalucia2716:Dani123@cluster1.6uc6n.mongodb.net/teachers");

// parser for the request body (required for the POST and PUT methods)
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// check for cors
const cors = require("cors");
const { teacherCreate, teacherGet } = require('./controllers/teacherController');
app.use(cors({
  domains: '*',
  methods: "*"
}));


app.post('/api/teachers', teacherCreate);
app.get("/api/teachers", teacherGet);

app.listen(3001, () => console.log(`Example app listening on port 3001!`))