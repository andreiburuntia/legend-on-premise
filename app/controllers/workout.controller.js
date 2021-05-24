const axios = require("axios");
const HrModel = require("../models/hr.model.js");
const PunchModel = require("../models/punch.model.js");

const AMAZON_HR_BULK_API_URL = 'http://ec2-18-217-1-165.us-east-2.compute.amazonaws.com/hr/bulk';
const AMAZON_PUNCH_BULK_API_URL = 'http://ec2-18-217-1-165.us-east-2.compute.amazonaws.com/punch/bulk';

const AMAZON_WORKOUT_DETAILS_API_URL = 'http://ec2-18-217-1-165.us-east-2.compute.amazonaws.com/workout/details/';
const AMAZON_WORKOUT_DAILY_API_URL = 'http://ec2-18-217-1-165.us-east-2.compute.amazonaws.com/workout/day/';
const AMAZON_END_WORKOUT_API_URL = 'http://ec2-18-217-1-165.us-east-2.compute.amazonaws.com/end_workout'; 

const chalk = require('chalk');
const log = console.log;
const error = chalk.bold.red;
const warning = chalk.keyword('orange');
const info = chalk.bold.white;
const ginfo = chalk.bold.green;

exports.start = (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.status(200).json(global.currentWorkout);
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
    
    res.header("Access-Control-Allow-Origin", "*");
    
    //clear connected users global array
    global.connectedUsers.clear();

    Promise.all([
        HrModel.getExportReadyData(),
        PunchModel.getExportReadyData()
    ])
        .then(([hrData, punchData]) => {
                
          console.log(hrData);
          console.log(punchData);

          Promise.all([
            sendHrsToAmazon(hrData), 
            sendPunchesToAmazon(punchData)
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

                  // disconnect all users
                  axios.get(AMAZON_END_WORKOUT_API_URL)
                    .then(function (response) {
                      console.log('Finishing Workout..clearing users');
                      console.log(response);
                    })
                    .catch(function (error) {
                      console.log(error);
                    });         

                  res.status(200).json('Workout finished successfully');
                })
                .catch(err => console.log(err));        
              
            })
            .catch(err => console.log(err));
          
        })
        .catch(err => console.log(err));
};

exports.setCurrentWorkout = (req, res) => {
    res.header("Access-Control-Allow-Origin", "*"); 
    global.currentWorkout = global.dailyWorkoutList.get(parseInt(req.body.workout_id));
    res.status(200).json(global.currentWorkout);

};


exports.getDailyWorkouts = (req, res) => {
    
    res.header("Access-Control-Allow-Origin", "*");
    let today = new Date();
    // adjust 0 before single digit date
    let day = ("0" + today.getDate()).slice(-2);
    // current month
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    // current year
    let year = today.getFullYear();

    axios
        .get(AMAZON_WORKOUT_DAILY_API_URL + year + '-' + month + '-' + day)
        .then(result => {
            result.data.forEach((element => {
              global.dailyWorkoutList.set(element.id, element);
            }));  
            res.status(200).json(result.data);
        })
        .catch(error => {
            console.log('Error fetching curent workout  . . .\n'+error);
            res.status(500).json('Error fetching curent workout  . . .\n'+error);
        });    

};
