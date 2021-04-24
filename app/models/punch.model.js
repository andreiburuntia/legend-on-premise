const sql = require("./db.js");

const Punch = function(punch) {
  this.bag_id     = punch.bag_id;
  this.score      = punch.score;
  this.count      = punch.count;
  this.workout_id = punch.workout_id;
  this.user_id    = punch.user_id;
};


Punch.create = (newpunch, result) => {
  sql.query("INSERT INTO punches SET ?", newpunch, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created punch: ", { id: res.insertId, newpunch });
    result(null, { id: res.insertId, newpunch });
  });
};


Punch.findByBagId = (bagId, result) => {
  sql.query(`SELECT * FROM punches WHERE bag_id = ${bagId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found punch for bag: ", res[0]);
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

Punch.getExportReadyData = result => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT user_id, workout_id, bag_id, score, count FROM punches WHERE id IN (SELECT MAX(id) FROM punches GROUP BY bag_id)`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      reject(err);
    }

    resolve(res);
  });
  });
};

Punch.moveDataToBackup = result => {
  return new Promise((resolve, reject) => {
    sql.query(`INSERT INTO punches_storage (bag_id, workout_id, score, count, created_at, user_id) SELECT bag_id, workout_id, score, count, created_at, user_id FROM punches`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err);
      }

      resolve(res);

    });
  });
};

Punch.removeAll = result => {
  sql.query("DELETE FROM punches", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} punches`);
    result(null, res);
  });
};

Punch.getProjectorReadyData = result => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT bag_id, score, count, created_at FROM punches GROUP BY bag_id ORDER BY created_at DESC;`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      reject(err);
    }

    resolve(res);
  });
  });
};


module.exports = Punch;
