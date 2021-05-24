const express = require("express");
const bodyParser = require("body-parser");
const random = require("random");
const axios = require("axios");
const chalk = require('chalk');
const CFonts = require('cfonts');

const app = express();

const AMAZON_CONNECTED_USERS_API_URL = 'http://ec2-18-217-1-165.us-east-2.compute.amazonaws.com/connected-users';

const log = console.log;
const error = chalk.bold.red;
const warning = chalk.keyword('orange');
const info = chalk.bold.white;
const ginfo = chalk.bold.green;

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

global.connectedUsers = new Map();
global.dailyWorkoutList = new Map();
// set port, listen for requests
app.listen(3000, () => {
  CFonts.say('LegendAPI v.0.0.1',{
	font: 'block',              // define the font face
	align: 'left',              // define text alignment
	colors: ['system'],         // define all colors
	background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
	letterSpacing: 1,           // define letter spacing
	lineHeight: 1,              // define the line height
	space: true,                // define if the output text should have empty lines on top and on the bottom
	maxLength: '0',             // define how many character can be on one line
	gradient: ['red','blue'],            // define your two gradient colors
	independentGradient: false, // define if you want to recalculate the gradient for each new line
	transitionGradient: false,  // define if this is a transition between colors directly
	env: 'node'                 // define the environment CFonts is being executed in
   });
  console.log("Server is running on port 3000.");
});

// initiated repeated fetching of connected users
let get_connected_users_timeout = (() => {  
  log('----------------------------------------------------------------------');
  log(info('fetching connected users . . .'));
  axios
    .get(AMAZON_CONNECTED_USERS_API_URL)
    .then(result => {        
        result.data.forEach((element => {
    	  console.log('elemnt is:' + element);
          global.connectedUsers.set(element[0], element[1].id);
        }));
        log(ginfo('connected users . . .\n'));
        console.log(global.connectedUsers);
    })
    .catch(error => {
    	log(error('Error fetching connected users . . .\n'+error));
    });

  setTimeout(() => { 
    get_connected_users_timeout()
  }, 30000);
})

get_connected_users_timeout();
