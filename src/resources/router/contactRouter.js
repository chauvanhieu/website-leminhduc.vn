const express = require("express");
const router = express.Router();
const con = require("../database/db");

router.get("/", (req, res) => {
  let sql = "select * from user";
  con.query(sql, (err, rs) => {
    if (!err) {
      res.render("contactpage", {
        title: rs[0].fullname || "Lê Minh Đức",
        fullName: rs[0].fullname || "Lê Minh Đức",
        description: rs[0].description || "Lê Minh Đức",
        keyword: rs[0].keyword || "Lê Minh Đức",
        map: rs[0].map || "<p>Lê Minh Đức</p>",
        phoneNumber: rs[0].phoneNumber || "Lê Minh Đức",
        address: rs[0].address || "Lê Minh Đức",
        email: rs[0].email || "Lê Minh Đức",
      });
    }
  });
});

module.exports = router;
