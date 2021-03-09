module.exports = app => {
  const punches = require("../controllers/punch.controller.js");

  // Create a new Punch
  app.post("/punches", punches.create);

  // Retrieve all punches
  //app.get("/punches", punches.findAll);

  // Retrieve a punch by BagId
  app.get("/punches/:bagId", punches.findByBagId);

  // Retrieve a punch data for pushing to Amazon by BagId
  app.get("/punches/export/:bagId", punches.getExportReadyData);

  // Delete all punches
  app.delete("/punches", punches.deleteAll);
};