const express = require("express");
const router = express.Router();
const { db, query } = require("../database");

//! Get all belum di join
router.get("/", (req, res) => {
  let sql = `select 
  m.name ,
  m.release_date,
  m.release_month, 
  m.release_year, 
  m.duration_min,
  m.genre,
  m.description,
  ms.status as "status",
  l.location,
  st.time
  from movies m
  join movie_status ms on m.status = ms.id 
  join schedules sc on m.id = sc.movie_id
  join locations l on l.id = sc.location_id
  join show_times st on sc.time_id = st.id `;
  const { status, location, time } = req.query;
  if (status && location && time) {
    sql += ` where ms.status ='${status}' && l.location = '${location}' && st.time = '${time}'`;
  } else if (status) {
    sql += `where ms.status ='${status}'`;
  } else if (location) {
    sql += ` where l.location = '${location}' `;
  } else if (time) {
    sql += ` where st.time = '${time}'`;
  }
  console.log(sql);
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    return res.status(200).send(data);
  });
});
// http://localhost:2000/movies?status=on show

router.post("/", async (req, res) => {
  try {
    const {
      name,
      release_date,
      release_month,
      release_year,
      duration_min,
      genre,
      description,
    } = req.body;
    await query(`insert into movies (
      name,
      release_date,
      release_month, 
      release_year, 
      duration_min,
      genre,
      description) values (
      "${name}",
      ${release_date},
      ${release_month},
      ${release_year},
      ${duration_min},
      "${genre}",
      "${description}"
      )`);
    return res.status(200).send("OK");
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await query(`select * from movies where store_id = ${id}`);
    const {
      name,
      release_date,
      release_month,
      release_year,
      duration_min,
      genre,
      description,
    } = req.body;
    const response = await query(
      `update movies set name = "${name}",
      release_date = ${release_date},
      release_month = ${release_month},
      release_year = ${release_year},
      duration_min =${duration_min},
      genre = ""${genre}"",
      description = "${description}"
      where store_id = ${id}`
    );
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

module.exports = router;
