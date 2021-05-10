module.exports = app => {
  const workouts = require("../controllers/workout.controller.js");

  // Start a workout
  app.get("/workout/start", workouts.start);

  // Stop a workout
  app.get("/workout/finish", workouts.finish);

  // Get workout projector data
  app.get("/workout/projector", workouts.getProjectorData);

};