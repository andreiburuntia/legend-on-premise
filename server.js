const express = require("express");
const bodyParser = require("body-parser");
const session = require('express-session');
const random = require("random");

const app = express();

app.use(session({resave: true, saveUninitialized: true, secret: 'qJ0KfGtlJm^$cCH', cookie: { maxAge: 60000 }}));

// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Legend GYM application." });
});

require("./app/routes/punch.routes.js")(app);
require("./app/routes/hr.routes.js")(app);
require("./app/routes/workout.routes.js")(app);

// set port, listen for requests
app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});