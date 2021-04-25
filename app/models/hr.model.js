const sql = require("./db.js");

const Hr = function(hr) {
  this.bag_id     = hr.bag_id;
  this.hr         = hr.hr;
  this.user_id    = hr.user_id;
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

Hr.getExportReadyData = result => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT user_id, workout_id, bag_id, min(hr) as "min", max(hr) as "max", ROUND(avg(hr)) as "avg" FROM hrs GROUP BY bag_id;`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err);
      }

      resolve(res);

    });
  });
};

Hr.moveDataToBackup = result => {
  return new Promise((resolve, reject) => {
    sql.query(`INSERT INTO hrs_storage (bag_id, workout_id, hr, created_at, user_id) SELECT bag_id, workout_id, hr, created_at, user_id FROM hrs`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err);
      }

      resolve(res);

    });
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


Hr.getProjectorReadyData = result => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT hr.id, hr.bag_id, hr.hr, hr.created_at FROM hrs hr INNER JOIN (SELECT MAX(id) AS id FROM hrs GROUP BY bag_id) AS grouper ON hr.id=grouper.id;`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err);
      }

      resolve(res);

    });
  });
};

module.exports = Hr;
