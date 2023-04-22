const express = require("express");
const router = express.Router();
const con = require("../database/db");

router.get("/", (req, res) => {
  let action = req.query.action || null;
  let id = req.query.id || null;
  let sql = "";
  switch (action) {
    case "delete":
      sql = "DELETE FROM slide where id = " + id + "";
      con.query(sql, (err, rs) => {
        if (!err) {
          res.redirect("/admin/slide");
        }
      });
      break;
    case "create":
      sql = "insert into slide(image) values(?)";
      con.query(sql, [req.query.image], (err, rs) => {
        if (!err) {
          res.redirect("/admin/slide");
        }
      });
      break;
    default:
      break;
  }
});

module.exports = router;
