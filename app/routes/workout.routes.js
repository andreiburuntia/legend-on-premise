module.exports = app => {
  const workouts = require("../controllers/workout.controller.js");

  // Start a workout
  app.get("/workout/start", workouts.getCurrentWorkout);

  // Stop a workout
  app.get("/workout/finish", workouts.finish);

};