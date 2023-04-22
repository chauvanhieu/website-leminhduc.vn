const express = require("express");
const router = express.Router();
const con = require("../database/db");

router.get("/", (req, res) => {
  let sql = "select * from award ";
  con.query(sql, (err, rs) => {
    if (!err) {
      res.render("awardpage", {
        listAward: rs,
      });
    }
  });
});

router.get("/delete/:id", (req, res) => {
  let sql = "delete from award where id =?";
  con.query(sql, [req.params.id], (err, rs) => {
    if (!err) {
      res.redirect("/admin/giai-thuong");
    }
  });
});
module.exports = router;
