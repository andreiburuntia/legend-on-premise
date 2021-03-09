module.exports = app => {
  const hrs = require("../controllers/hr.controller.js");

  // Create a new Hr
  app.post("/hrs", hrs.create);

  // Retrieve all Hrs
  //app.get("/hrs", hrs.findAll);

  // Retrieve a Hr by BagId
  app.get("/hrs/:bagId", hrs.findByBagId);

  // Retrieve a Hr data for pushing to Amazon by BagId
  app.get("/hrs/export/:bagId", hrs.getExportReadyData);

  // Delete all hrs
  app.delete("/hrs", hrs.deleteAll);
};