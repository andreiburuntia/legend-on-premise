const axios = require("axios");
const session = require('express-session');

const AMAZON_API_URL = 'http://ec2-18-217-1-165.us-east-2.compute.amazonaws.com/workout/upcoming';


exports.getCurrentWorkout = (req, res) => {
	axios
		.get(AMAZON_API_URL)
		.then(res => {
			console.log(res)
			sessionData = req.session;
			sessionData.currentWorkout = res.data
		})
		.catch(error => {
			console.error(error)
		})	
};

exports.finish = (req, res) => {
	axios
		.get(AMAZON_API_URL)
		.then(res => {
			console.log(`statusCode: ${res.statusCode}`)
			console.log(res)
		})
		.catch(error => {
			console.error(error)
		})	
};
