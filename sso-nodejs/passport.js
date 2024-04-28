const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const { fromExtractors, fromAuthHeaderAsBearerToken } = ExtractJwt;

function cookieExtractor(req) {
  var token = null;
  if (req && req.cookies) {
    token = req.signedCookies[jwtOptions.jwtCookieName];
  }
  return token;
}

const jwtOptions = {
  jwtFromRequest: fromExtractors([
    cookieExtractor,
    fromAuthHeaderAsBearerToken(),
  ]),
  secretOrKey: "secret",
  issuer: "mydomain.com",
  audience: "api.mydomain.com",
  jwtCookieName: "jwt",
};

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

// Định nghĩa chiến lược xác thực cục bộ
passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        if (email !== "user@gmail.com" || password !== "123") {
          return done(null, false, {
            message: "Sai tên đăng nhập hoặc mật khẩu",
          });
        }

        return done(null, { id: 1, email });
      } catch (error) {
        return done(error);
      }
    }
  )
);

const strategy = new JwtStrategy(jwtOptions, async (jwt_payload, next) => {
  console.log("payload received", jwt_payload);
  // usually this would be a database call:
  if (true) {
    next(null, { id: 1, email: "user@gmail.com" });
  } else {
    next(null, false);
  }
});

passport.use(strategy);

module.exports = { passport, jwtOptions };
