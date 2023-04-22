const express = require("express");
const router = express.Router();
const con = require("../database/db");

router.get("/:slug", (req, res) => {
  const slug = req.params.slug;
  let sql = "select * from about_post where slug= ?";
  con.query(sql, [slug], (err, result) => {
    if (err) {
      res.render("page404");
    } else {
      res.render("aboutpage", {
        title: result[0].title || "KTS. Lê Minh Đức",
        keyword: result[0].keyword || "KTS. Lê Minh Đức",
        description: result[0].description || "KTS. Lê Minh Đức",
        content: result[0].content || "",
      });
    }
  });
});

router.post("/:id", (req, res) => {
  console.log(req.params.id);
  let sql =
    "UPDATE about_post SET title=?,content=?,keyword=?,description=? WHERE id = ?";
  con.query(
    sql,
    [
      req.body.title,
      req.body.content,
      req.body.keyword,
      req.body.description,
      req.params.id,
    ],
    (err, result) => {
      if (!err) {
        res.redirect("/admin");
      }
    }
  );
});

router.get("/", (req, res) => {
  const slug = req.params.slug;
  let sql = "select * from about_post where slug= 'cong-ty'";
  con.query(sql, [slug], (err, result) => {
    if (err) {
      res.render("page404");
    } else {
      res.render("aboutpage", {
        title: result[0].title || "KTS. Lê Minh Đức",
        keyword: result[0].keyword || "KTS. Lê Minh Đức",
        description: result[0].description || "KTS. Lê Minh Đức",
        content: result[0].content || "",
      });
    }
  });
});
module.exports = router;
