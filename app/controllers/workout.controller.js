const axios = require("axios");
const HrModel = require("../models/hr.model.js");
const PunchModel = require("../models/punch.model.js");

const AMAZON_API_URL = 'http://ec2-18-217-1-165.us-east-2.compute.amazonaws.com/workout/upcoming';

exports.getCurrentWorkout = (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");

    axios
        .get(AMAZON_API_URL)
        .then(result => {
            console.log(result);
            global.currentWorkout = result.data.id;

            res.status(200).json(result.data);

        })
        .catch(error => {
            console.error(error)
            res.status(200).json(error);
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
