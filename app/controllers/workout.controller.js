const axios = require("axios");
const HrModel = require("../models/hr.model.js");
const PunchModel = require("../models/punch.model.js");

const AMAZON_WORKOUT_API_URL = 'http://ec2-18-217-1-165.us-east-2.compute.amazonaws.com/workout/upcoming';
const AMAZON_CONNECTED_USERS_API_URL = 'http://ec2-18-217-1-165.us-east-2.compute.amazonaws.com/connected-users';

const AMAZON_HR_BULK_API_URL = 'http://ec2-18-217-1-165.us-east-2.compute.amazonaws.com/hr/bulk';
const AMAZON_PUNCH_BULK_API_URL = 'http://ec2-18-217-1-165.us-east-2.compute.amazonaws.com/punch/bulk';
 
exports.getCurrentWorkout = (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");

    axios
        .get(AMAZON_CONNECTED_USERS_API_URL)
        .then(result => {
            global.connectedUsers = new Map();
            result.data.forEach((element => {
              global.connectedUsers.set(element[0], element[1].id);
              console.log("Element 0: " + element[0]);
              console.log("Element 1: " + element[1].id);
            }));
            console.log('Map');
            console.log(global.connectedUsers);
        })
        .catch(error => {
            console.error(error)            
        });

    axios
        .get(AMAZON_WORKOUT_API_URL)
        .then(result => {
            global.currentWorkout = result.data.id;
            res.status(200).json(result.data);

        })
        .catch(error => {
            console.error(error)
            res.status(200).json(error);
        });    
};



exports.getProjectorData = (req, res) => {
    
    res.header("Access-Control-Allow-Origin", "*");

    Promise.all([
        HrModel.getProjectorReadyData(),
        PunchModel.getProjectorReadyData(),
    ])
        .then(([hrData, punchData]) => {
            const merged = [].concat(hrData, punchData);
            
            const result = merged.reduce((acc, value) => {
              if (!acc.find(a => a.bag_id === value.bag_id)) {
                acc = [
                  ...acc,
                  merged.filter(m => m.bag_id === value.bag_id).reduce((acc, value) => 
                    acc = {...acc, ...value}
                  , {})
                ];
              }
              return acc;
            }, []).map(r => ({
              'bag_id': r.bag_id,
              'hr': r.hr ?? null,
              'score': r.score ?? null,
              'count': r.count ?? null
            })).sort((a, b) => (a.bag_id > b.bag_id) ? 1 : -1);


            res.status(200).json(result);
        })
        .catch(err => console.log(err));
};

function sendHrsToAmazon(hrData) {
  // send Data to main API
  axios.post(AMAZON_HR_BULK_API_URL, {
      hrData
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });         

}

function sendPunchesToAmazon(punchData) {
  // send Data to main API  
  axios.post(AMAZON_PUNCH_BULK_API_URL, {
      punchData
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });         

}

exports.finish = (req, res) => {
    
    //clear connected users global array
    global.connectedUsers.clear();

    Promise.all([
        HrModel.getExportReadyData(),
        PunchModel.getExportReadyData()
    ])
        .then(([hrData, punchData]) => {
              
          Promise.all([
            sendHrsToAmazon(), 
            sendPunchesToAmazon()
          ])
          .then(function (results) {

                Promise.all([
                    HrModel.moveDataToBackup(),
                    PunchModel.moveDataToBackup(),
                ])
                .then(function (results) {

                  HrModel.removeAll((err, data) => {
                      if (err) console.log("Some error occurred while removing all customers.")
                      else console.log({ message: `All hrs were deleted successfully!` });
                    });

                  PunchModel.removeAll((err, data) => {
                      if (err) console.log("Some error occurred while removing all customers.");
                      else console.log({ message: `All punches were deleted successfully!` });
                    });

                  res.status(200).json('Workout finished successfully');
                })
                .catch(err => console.log(err));        
              
            })
            .catch(err => console.log(err));
          
        })
        .catch(err => console.log(err));
};


