const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const path = require("path");
require("express-async-errors");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const con = require("./src/resources/database/db");
const app = express();
const port = 8080;
// config handlebars templates
app.engine(".hbs", exphbs.engine({ extname: ".hbs", defaultLayout: "main" }));
app.set("views", path.join(__dirname, "./src/resources/views"));
app.set("view engine", "hbs");

// body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// config public folder
app.use(express.static(path.join(__dirname, "./src/public")));

// Thiết lập thư mục lưu trữ tệp tin
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Kiểm tra loại tệp tin
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error("Wrong file type");
    error.code = "LIMIT_FILE_TYPES";
    return cb(error, false);
  }
  cb(null, true);
};

// Thiết lập tải lên
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 100, // giới hạn kích thước tệp tin lên đến 5 MB
  },
  fileFilter: fileFilter,
}).single("image");

app.post("/create-project", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_TYPES") {
        return res.status(422).json({ error: "Only images are allowed" });
      }
      return res.status(422).json({ error: err.message });
    }

    let sql =
      "INSERT INTO project(title, image, category_id, slug, keyword, description) VALUES (?,?,?,?,?,?)";
    con.query(
      sql,
      [
        req.body.title,
        req.file.filename,
        req.body.category_id,
        req.body.slug,
        req.body.keyword,
        req.body.description,
      ],
      (e, r) => {
        if (!e) {
          res.redirect(req.headers.origin + `/admin/du-an/${req.body.slug}`);
        }
      }
    );
  });
});

app.post("/add-image-detail/:id", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_TYPES") {
        return res.status(422).json({ error: "Only images are allowed" });
      }
      return res.status(422).json({ error: err.message });
    }

    let sql = "INSERT INTO project_detail(  image,project_id) VALUES (?,?)";
    con.query(sql, [req.file.filename, req.params.id], (e, r) => {
      if (!e) {
        res.redirect(req.headers.referer);
      }
    });
  });
});

app.post("/add-thumnail/:id", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_TYPES") {
        return res.status(422).json({ error: "Only images are allowed" });
      }
      return res.status(422).json({ error: err.message });
    }

    let updateAward = "UPDATE project SET image=? WHERE id=?";
    let filename = "";
    if (req.file != undefined) {
      filename = req.file.filename;
    } else {
      filename = req.body.imageDefault;
    }
    con.query(updateAward, [filename, req.params.id], (e, r) => {
      if (!e) {
        res.redirect(req.headers.referer);
      }
    });
  });
});

app.post("/giai-thuong/:id", function (req, res) {
  upload(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_TYPES") {
        return res.status(422).json({ error: "Only images are allowed" });
      }
      return res.status(422).json({ error: err.message });
    }

    let updateAward = "UPDATE award SET image=?,description=? WHERE id=?";
    let filename = "";
    if (req.file != undefined) {
      filename = req.file.filename;
    } else {
      filename = req.body.imageDefault;
    }
    con.query(
      updateAward,
      [filename, req.body.description, req.params.id],
      (e, r) => {
        if (!e) {
          res.redirect("/admin/giai-thuong");
        }
      }
    );
  });
});

app.post("/giai-thuong", function (req, res) {
  upload(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_TYPES") {
        return res.status(422).json({ error: "Only images are allowed" });
      }
      return res.status(422).json({ error: err.message });
    }

    let addAward = "insert into award(image,description) values(?,?)";
    con.query(addAward, [req.file.filename, req.body.description], (e, r) => {
      if (!e) {
        res.redirect("/admin/giai-thuong");
      } else {
        res.redirect("/admin/giai-thuong");
      }
    });
  });
});
app.post("/admin/slide", function (req, res) {
  upload(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_TYPES") {
        return res.status(422).json({ error: "Only images are allowed" });
      }
      return res.status(422).json({ error: err.message });
    }
    let addSlide = "insert into slide(image) values(?)";
    con.query(addSlide, [req.file.filename], (e, r) => {
      if (!e) {
        let sql = " select * from slide";
        con.query(sql, (err, rs) => {
          if (!err) {
            res.render("adminSlidePage", {
              listSlides: rs,
            });
          }
        });
      }
    });
  });
});

// homepage router
app.get("/", function (req, res) {
  let sql = "select * from slide";
  con.query(sql, (err, rs) => {
    if (!err) {
      let getUser = "select * from user";
      con.query(getUser, (error, result) => {
        res.render("homepage", {
          title: result[0].title,
          description: result[0].description,
          keyword: result[0].keyword,
          fullname: result[0].fullname,
          email: result[0].email,
          address: result[0].address,
          phoneNumber: result[0].phoneNumber,
          map: result[0].map,
          username: result[0].username,
          password: result[0].password,
          headContent: result[0].headcontent,
          listSlides: rs,
        });
      });
    }
  });
});

app.get("/project-detail", (req, res) => {
  switch (req.query.action) {
    case "delete":
      let sql = "delete from project_detail where id = ?";
      con.query(sql, [req.query.id], (err, rs) => {
        if (!err) {
          res.redirect(req.headers.referer);
        }
      });
      break;
    default:
      break;
  }
});

// Router slide
const slideRouter = require("./src/resources/router/slideRouter");
app.use("/slide", slideRouter);

// Router Admin
const adminRouter = require("./src/resources/router/adminRouter");
app.use("/admin", adminRouter);
app.get("/logout", (req, res) => {
  res.clearCookie("user");
  res.redirect("/admin");
});
// Router Giới thiệu
const aboutRouter = require("./src/resources/router/aboutRouter");
app.use("/gioi-thieu", aboutRouter);

// Router Dự án
const projectRouter = require("./src/resources/router/projectRouter");
app.use("/du-an", projectRouter);

// Router danh mục
const categoryRouter = require("./src/resources/router/categoryRouter");
app.use("/danh-muc", categoryRouter);

// Router liên hệ
const contactRouter = require("./src/resources/router/contactRouter");
app.use("/lien-he", contactRouter);

// Router giải thưởng
const awardRouter = require("./src/resources/router/awardRouter");
app.use("/giai-thuong", awardRouter);

// Router dịch vụ
const serviceRouter = require("./src/resources/router/serviceRouter");
const router = require("./src/resources/router/serviceRouter");
app.use("/dich-vu", serviceRouter);

app.listen(port, () => {
  console.log("server is running port:  " + port);
});
