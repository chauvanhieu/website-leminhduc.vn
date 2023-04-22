const express = require("express");
const router = express.Router();
const con = require("../database/db");

function removeAccent(str) {
  str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  str = str.toLowerCase();
  str = str.trim();
  return str.replace(/[^a-z0-9]+/g, "-");
}

let listCategory = [];
let getCategories = "select * from project_category";
con.query(getCategories, (err, rs) => {
  if (!err) {
    listCategory = rs;
  }
});

router.post("/", (req, res) => {
  let sql =
    "INSERT INTO project_category( title, slug, keyword, description) VALUES (?,?,?,?)";
  con.query(
    sql,
    [
      req.body.title,
      removeAccent(req.body.title),
      req.body.keyword,
      req.body.description,
    ],
    (err, rs) => {
      if (!err) {
        res.redirect("admin/danh-muc");
      }
    }
  );
});

router.post("/:id", (req, res) => {
  let sql =
    "UPDATE project_category SET title=?,slug=?,keyword=?,description=? WHERE id=?";
  con.query(
    sql,
    [
      req.body.title,
      removeAccent(req.body.title),
      req.body.keyword,
      req.body.description,
      req.params.id,
    ],
    (err, rs) => {
      if (!err) {
        res.redirect("/admin/danh-muc");
      }
    }
  );
});

router.get("/delete/:id", (req, res) => {
  let sql = "DELETE FROM project_category WHERE id=?";
  con.query(sql, [req.params.id], (err, rs) => {
    if (!err) {
      res.redirect("/admin/danh-muc");
    }
  });
});

router.get("/:slug", (req, res) => {
  let category = null;
  for (let i = 0; i < listCategory.length; i++) {
    if (listCategory[i].slug === req.params.slug) {
      category = listCategory[i];
      break;
    }
  }
  if (category === null) {
    res.status(404).render("page404");
  } else {
    let getProjects = "select * from project where category_id=?";
    con.query(getProjects, [category.id], (err, rs) => {
      if (!err) {
        res.render("projects", {
          listCategory: listCategory || [],
          listProjects: rs || [],
        });
      }
    });
  }
});

module.exports = router;
