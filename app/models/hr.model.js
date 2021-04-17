const sql = require("./db.js");

const Hr = function(hr) {
  this.bag_id     = hr.bag_id;
  this.hr         = hr.hr;
  this.workout_id = hr.workout_id;
};

Hr.create = (newhr, result) => {
  sql.query("INSERT INTO hrs SET ?", newhr, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created hr: ", { id: res.insertId, newhr });
    result(null, { id: res.insertId, newhr });
  });
};

Hr.findByBagId = (bagId, result) => {
  sql.query(`SELECT * FROM hrs WHERE bag_id = ${bagId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found hr for bag: ", res[0]);
      result(null, res);
      return;
    }

    // not found Hrs with the id
    result({ kind: "not_found" }, null);
  });
};

Hr.getExportReadyData = (bagId, result) => {
  sql.query(`SELECT bag_id, min(hr) as "min", max(hr) as "max", ROUND(avg(hr)) as "avg" FROM hrs WHERE bag_id = ${bagId} GROUP BY bag_id`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found hr for bag: ", res[0]);
      result(null, res[0]);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

Hr.removeAll = result => {
  sql.query("DELETE FROM hrs", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} hrs`);
    result(null, res);
  });
};

module.exports = Hr;
