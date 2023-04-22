const express = require("express");
const router = express.Router();
const con = require("../database/db");

router.post("/login", (req, res) => {
  let sql = "SELECT * FROM user where username = ? AND password = ?";
  con.query(sql, [req.body.username, req.body.password], (err, rs) => {
    if (!err) {
      if (rs.length > 0) {
        res.cookie("user", rs[0]);
        res.render("adminpage", {
          title: rs[0].title,
          description: rs[0].description,
          keyword: rs[0].keyword,
          fullname: rs[0].fullname,
          email: rs[0].email,
          address: rs[0].address,
          phoneNumber: rs[0].phoneNumber,
          map: rs[0].map,
          username: rs[0].username,
          password: rs[0].password,
          headContent: rs[0].headcontent,
        });
      } else {
        res.render("adminLogin", {
          message: "Sai tên đăng nhập hoặc mật khẩu !",
        });
      }
    }
  });
});

router.get("/", (req, res) => {
  if (req.cookies.user) {
    let sql = "select * from user";
    con.query(sql, (err, rs) => {
      res.render("adminpage", {
        title: rs[0].title,
        description: rs[0].description,
        keyword: rs[0].keyword,
        fullname: rs[0].fullname,
        email: rs[0].email,
        address: rs[0].address,
        phoneNumber: rs[0].phoneNumber,
        map: rs[0].map,
        username: rs[0].username,
        password: rs[0].password,
        headContent: rs[0].headcontent,
      });
    });
  } else {
    res.render("adminLogin");
  }
});

// post user
router.post("/", (req, res) => {
  let fullname = req.body.fullname || "KTS. Lê Minh Đức";
  let address = req.body.address || "Thành phố Buôn Mê Thuột, tỉnh Đăk Lăk";
  let email = req.body.email || "leminhduc@gmail.com";
  let password = req.body.password || "123";
  let phoneNumber = req.body.phoneNumber || "0911004376";
  let username = req.body.username || "admin";
  let title = req.body.title || "KTS. Lê Minh Đức";
  let description = req.body.description || "";
  let keyword = req.body.keyword || "KTS. Lê Minh Đức";
  let map = req.body.map || "";
  let headContent = req.body.headContent || "";
  let sql =
    "UPDATE user SET fullname=?,phoneNumber=?,email=?,address=?,map=?,username=?,password=?,headcontent=?,title=?,keyword=?,description=? WHERE id=1 ";
  con.query(
    sql,
    [
      fullname,
      phoneNumber,
      email,
      address,
      map,
      username,
      password,
      headContent,
      title,
      keyword,
      description,
    ],
    (err, rs) => {
      if (!err) {
        res.redirect("/admin");
      } else {
        res.send(err);
      }
    }
  );
});

router.get("/dich-vu/create", (req, res) => {
  if (req.cookies.user) {
    res.render("createServicePage");
  } else {
    res.render("adminLogin");
  }
});

router.get("/danh-muc", (req, res) => {
  if (req.cookies.user) {
    let sql = "SELECT * from project_category";
    con.query(sql, (err, rs) => {
      if (!err) {
        res.render("adminCategoryPage", {
          listCategory: rs,
        });
      }
    });
  } else {
    res.render("adminLogin");
  }
});

router.get("/danh-muc/create", (req, res) => {
  if (req.cookies.user) {
    res.render("createCategoryPage");
  } else {
    res.render("adminLogin");
  }
});
router.get("/giai-thuong/create", (req, res) => {
  if (req.cookies.user) {
    res.render("createAwardPage");
  } else {
    res.render("adminLogin");
  }
});
router.get("/danh-muc/:slug", (req, res) => {
  if (req.cookies.user) {
    let sql = "SELECT * from project_category where slug= ?";
    con.query(sql, [req.params.slug], (err, rs) => {
      if (!err) {
        res.render("adminCategoryDetail", {
          id: rs[0].id,
          slug: rs[0].slug,
          title: rs[0].title,
          description: rs[0].description,
          keyword: rs[0].keyword,
        });
      }
    });
  } else {
    res.render("adminLogin");
  }
});

router.get("/dich-vu/:slug", (req, res) => {
  if (req.cookies.user) {
    let sql = "SELECT * FROM service  WHERE slug = ?";
    con.query(sql, [req.params.slug], (err, rs) => {
      if (!err) {
        if (rs.length > 0) {
          res.render("adminServiceDetail", {
            title: rs[0].title,
            content: rs[0].content,
            slug: rs[0].slug,
            description: rs[0].description,
            id: rs[0].id,
            keyword: rs[0].keyword,
          });
        } else {
          res.render("page404");
        }
      }
    });
  } else {
    res.render("adminLogin");
  }
});

router.get("/giai-thuong", (req, res) => {
  if (req.cookies.user) {
    let sql = "SELECT * FROM award";
    con.query(sql, (err, rs) => {
      if (!err) {
        res.render("adminAwardPage", {
          listAward: rs,
        });
      }
    });
  } else {
    res.render("adminLogin");
  }
});

router.get("/giai-thuong/:id", (req, res) => {
  if (req.cookies.user) {
    let sql = "SELECT * FROM award WHERE id =?";
    con.query(sql, [req.params.id], (err, rs) => {
      res.render("adminAwardDetail", {
        id: rs[0].id,
        image: rs[0].image,
        description: rs[0].description,
      });
    });
  } else {
    res.render("adminLogin");
  }
});

router.get("/dich-vu", (req, res) => {
  if (req.cookies.user) {
    let sql = "SELECT * FROM service";
    con.query(sql, (err, rs) => {
      if (!err) {
        res.render("adminServicePage", {
          listService: rs,
        });
      }
    });
  } else {
    res.render("adminLogin");
  }
});

router.get("/gioi-thieu/:slug", (req, res) => {
  if (req.cookies.user) {
    let slug = req.params.slug;
    let sql = "select * from about_post where slug=? ";
    con.query(sql, [slug], (err, rs) => {
      res.render("adminAboutPage", {
        id: rs[0].id,
        title: rs[0].title,
        content: rs[0].content,
        keyword: rs[0].keyword,
        description: rs[0].description,
      });
    });
  } else {
    res.render("adminLogin");
  }
});

router.get("/du-an/create", (req, res) => {
  let getCategories = "select * from project_category";
  con.query(getCategories, (err, rs) => {
    if (!err) {
      res.render("createProjectPage", {
        listCategory: rs,
      });
    }
  });
});

router.get("/du-an/:slug", (req, res) => {
  if (req.cookies.user) {
    let sql = "select * from project where slug=? ";
    con.query(sql, [req.params.slug], (err, rs) => {
      if (rs.length > 0) {
        let id = rs[0].id;
        if (!err) {
          let getDetail = "select * from project_detail where project_id=? ";
          con.query(getDetail, [id], (er, r) => {
            if (!er) {
              let getCategories = "select * from project_category";
              con.query(getCategories, (e, re) => {
                let htmlCategory = "";
                re.forEach((item) => {
                  if (item.id == rs[0].category_id) {
                    htmlCategory += `<option value="${item.id}" selected>${item.title}</option>`;
                  } else {
                    htmlCategory += `<option value="${item.id}" >${item.title}</option>`;
                  }
                });
                res.render("adminProjectDetail", {
                  listCategory: htmlCategory,
                  title: rs[0].title,
                  description: rs[0].description,
                  keyword: rs[0].keyword,
                  slug: rs[0].slug,
                  id: rs[0].id,
                  image: rs[0].image,
                  category_id: rs[0].category_id,
                  projectDetail: r,
                });
              });
            }
          });
        }
      }
    });
  } else {
    res.render("adminLogin");
  }
});

router.get("/du-an", (req, res) => {
  if (req.cookies.user) {
    let sql = "select * from project";
    con.query(sql, (err, rs) => {
      res.render("adminProjectPage", {
        listProject: rs,
      });
    });
  } else {
    res.render("adminLogin");
  }
});

router.get("/slide", (req, res) => {
  if (req.cookies.user) {
    let getSlide = "select * from slide";
    con.query(getSlide, (error, result) => {
      if (!error) {
        res.render("adminSlidePage", {
          listSlides: result,
        });
      }
    });
  } else {
    res.render("adminLogin");
  }
});

module.exports = router;
