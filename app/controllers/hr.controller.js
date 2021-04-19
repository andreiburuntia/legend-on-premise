const HrModel = require("../models/hr.model.js");
const axios = require("axios");
const session = require('express-session');

const AMAZON_API_URL = 'http://ec2-18-217-1-165.us-east-2.compute.amazonaws.com/hr/bulk';

// Create and Save a new HrModel
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  sessonData = req.session;
  // Create a HrModel
  const hr = new HrModel({
	bag_id     : req.body.bag_id,
	hr         : req.body.hr,
	workout_id : sessionData.currentWorkout.id
  });

  // Save hr in the database
  HrModel.create(hr, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the HrModel."
      });
    else res.send(data);
  });
};


exports.findByBagId = (req, res) => {  
	HrModel.findByBagId(req.params.bagId, (err, data) => {
		if (err) {
		  if (err.kind === "not_found") {
		    res.status(404).send({
		      message: `Not found HrModel with bagId ${req.params.bagId}.`
		    });
		  } else {
		    res.status(500).send({
		      message: "Error retrieving HrModel with bagId " + req.params.bagId
		    });
		  }
		} else res.send(data);
	});
};

exports.getExportReadyData = (req, res) => {  
	HrModel.getExportReadyData(req.params.bagId, (err, data) => {
		if (err) {
		  if (err.kind === "not_found") {
		    res.status(404).send({
		      message: `Not found HrModel with bagId ${req.params.bagId}.`
		    });
		  } else {
		    res.status(500).send({
		      message: "Error retrieving HrModel data with bagId " + req.params.bagId
		    });
		  }
		} else res.send(data);
	});
};

exports.deleteAll = (req, res) => {
	HrModel.removeAll((err, data) => {
		if (err)
		  res.status(500).send({
		    message:
		      err.message || "Some error occurred while removing all hr."
		  });
		else res.send({ message: `All hr were deleted successfully!` });
	});
};

exports.pushToAmazon = (req, res) => {
	axios
		.post(AMAZON_API_URL, {
			todo: 'Buy the BMW'
		})
		.then(res => {
			console.log(`statusCode: ${res.statusCode}`)
			console.log(res)
		})
		.catch(error => {
			console.error(error)
		})	
};
