const Punch = require("../models/punch.model.js");
const axios = require("axios");

const AMAZON_API_URL = 'http://ec2-18-217-1-165.us-east-2.compute.amazonaws.com/punch/bulk ';

// Create and Save a new Punch
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Punch
  const punch = new Punch({
	bag_id     : req.body.bag_id,
	score      : req.body.score,
	count      : req.body.count,
	workout_id : sessionData.currentWorkout.id
  });

  // Save punch in the database
  Punch.create(punch, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Punch."
      });
    else res.send(data);
  });
};


exports.findByBagId = (req, res) => {  
	Punch.findByBagId(req.params.bagId, (err, data) => {
		if (err) {
		  if (err.kind === "not_found") {
		    res.status(404).send({
		      message: `Not found Punch with bagId ${req.params.bagId}.`
		    });
		  } else {
		    res.status(500).send({
		      message: "Error retrieving Punch with bagId " + req.params.bagId
		    });
		  }
		} else res.send(data);
	});
};

exports.getExportReadyData = (req, res) => {  
	Punch.getExportReadyData(req.params.bagId, (err, data) => {
		if (err) {
		  if (err.kind === "not_found") {
		    res.status(404).send({
		      message: `Not found Punch with bagId ${req.params.bagId}.`
		    });
		  } else {
		    res.status(500).send({
		      message: "Error retrieving Punch data with bagId " + req.params.bagId
		    });
		  }
		} else res.send(data);
	});
};

exports.deleteAll = (req, res) => {
	Punch.removeAll((err, data) => {
		if (err)
		  res.status(500).send({
		    message:
		      err.message || "Some error occurred while removing all punches."
		  });
		else res.send({ message: `All punches were deleted successfully!` });
	});
};

exports.pushToAmazon = (req, res) => {
	axios
		.post(AMAZON_API_URL, {
			todo: 'Buy the milk'
		})
		.then(res => {
			console.log(`statusCode: ${res.statusCode}`)
			console.log(res)
		})
		.catch(error => {
			console.error(error)
		})	
};
