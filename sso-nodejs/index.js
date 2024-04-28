const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bodyParser = require("body-parser");
const { jwtOptions, passport } = require("./passport");

const app = express();

app.set("views", path.join(__dirname, "views")); // Specify the views directory
app.set("view engine", "ejs");

// Sử dụng middleware cookie-parser để xử lý cookie
app.use(cookieParser(jwtOptions.secretOrKey));
app.use(
  session({
    secret: "123",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Khởi tạo Passport
app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/sign_in",
  passport.authenticate("jwt", {
    // đăng nhập rồi thì chuyển về lại protected_page
    successRedirect: "http://localhost:5000/protected_page",
  }),
  (req, res) => {
    res.render("login"); // Pass data to the template
  }
);

// Định nghĩa tuyến đường đăng nhập
app.post("/sign_in", passport.authenticate("local"), (req, res) => {
  const payload = {
    sub: req.body.email,
    aud: jwtOptions.audience,
    iss: jwtOptions.issuer,
  };

  const token = jwt.sign(payload, jwtOptions.secretOrKey);

  res
    .cookie(jwtOptions.jwtCookieName, token, {
      httpOnly: true,
      secure: true,
      signed: true,
    })
    // Thay bằng domain React App cần tích hợp trên hệ thống xác thực này ví dụ: localhost:3000/user
    .redirect("http://localhost:5000/protected_page");
});

app.get(
  "/protected_page",
  passport.authenticate("jwt", {
    // Chưa đăng nhập thì chuyển về lại sign_in
    failureRedirect: "http://localhost:5000/sign_in",
  }),
  (req, res) => {
    res.status(200).json("da dang nhap");
  }
);

// Khởi động server
app.listen(5000, () => {
  console.log(`Server listening on port 5000`);
});
