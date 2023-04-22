const express = require("express");
const router = express.Router();
const con = require("../database/db");

function removeAccent(str) {
  str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  str = str.toLowerCase();
  str = str.trim();
  return str.replace(/[^a-z0-9]+/g, "-");
}

router.post("/:id", (req, res) => {
  let sql =
    "UPDATE service SET title=?,content=?,slug=?,keyword=?,description=? WHERE id=?";
  con.query(
    sql,
    [
      req.body.title,
      req.body.content,
      removeAccent(req.body.title),
      req.body.keyword,
      req.body.description,
      req.params.id,
    ],
    (err, rs) => {
      if (!err) {
        res.redirect("/admin/dich-vu");
      }
    }
  );
});

router.get("/delete/:id", (req, res) => {
  let sql = "delete from service where id = ?";
  con.query(sql, [req.params.id], (err, rs) => {
    if (!err) {
      res.redirect("/admin/dich-vu");
    }
  });
});

router.get("/", (req, res) => {
  let sql = "select * from service";
  con.query(sql, (err, rs) => {
    if (!err) {
      res.render("servicepage", {
        title: rs[0].title || "Service",
        description: rs[0].description || "description",
        content: rs[0].content || "content",
        listService: rs,
      });
    }
  });
});

router.post("/", (req, res) => {
  let sql =
    "INSERT INTO service( title, content, slug, keyword, description) VALUES (?,?,?,?,?)";
  con.query(
    sql,
    [
      req.body.title,
      req.body.content,
      removeAccent(req.body.title),
      req.body.keyword,
      req.body.description,
    ],
    (err, rs) => {
      if (!err) {
        res.redirect("/admin/dich-vu");
      }
    }
  );
});

router.get("/:slug", (req, res) => {
  let sql = "select * from service where slug = ?";
  con.query(sql, [req.params.slug], (err, rs) => {
    if (!err) {
      con.query("select * from service", (e, r) => {
        if (!e) {
          res.render("servicepage", {
            title: rs[0].title,
            description: rs[0].description,
            content: rs[0].content,
            listService: r,
          });
        }
      });
    }
  });
});
module.exports = router;
