const express = require("express");
const router = express.Router();
const con = require("../database/db");

router.post("/:id", (req, res) => {
  let sql =
    "update project set title=?,keyword=?,description=?,category_id=? where id=?";
  con.query(
    sql,
    [
      req.body.title,
      req.body.keyword,
      req.body.description,
      req.body.category_id,
      req.params.id,
    ],
    (err, rs) => {
      if (!err) {
        res.redirect(req.headers.referer);
      }
    }
  );
});

router.get("/:slug", (req, res) => {
  let slug = req.params.slug;
  let getProject = "select * from project where slug = ?";
  con.query(getProject, [slug], (err, rs) => {
    if (!err) {
      if (rs.length > 0) {
        let getProjectDetails =
          "SELECT project_detail.id,project_detail.image from project_detail join project on project.id=project_detail.project_id where project.id= ?";
        con.query(getProjectDetails, [rs[0].id], (err, result) => {
          res.render("projectDetail", {
            projectDetails: result,
            title: rs[0].title,
            description: rs[0].description,
            keyword: rs[0].keyword,
            slug: rs[0].slug,
          });
        });
      } else {
        res.status(404).render("page404");
      }
    }
  });
});

router.get("/", (req, res) => {
  let getCategories = "select * from project_category";
  con.query(getCategories, (err, rs) => {
    if (!err) {
      let getProjects = "select * from project";
      con.query(getProjects, (err, result) => {
        if (!err) {
          res.render("projects", {
            listCategory: rs,
            listProjects: result,
          });
        }
      });
    }
  });
});

router.get("/delete/:id", (req, res) => {
  let deleteDetail = "delete from project_detail where project_id = ?";
  con.query(deleteDetail, [req.params.id], (e, r) => {
    if (!e) {
      let sql = "delete from project where id=?";
      con.query(sql, [req.params.id], (err, rs) => {
        if (!err) {
          res.redirect(req.headers.referer);
        } else {
          console.log(err);
        }
      });
    }
  });
});

module.exports = router;
