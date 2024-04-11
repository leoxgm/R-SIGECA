const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/User");
const Departamento = require("../models/Departamento");
const Director = require("../models/Director");

passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      const user = await User.findOne({ email: email });
      console.log(user);
      if (!user) {
        return done(null, false, { message: "Usuario no encontrado" });
      } else {
        /*if (!dep) {
        return done(null, false, { message: "Departamento no encontrado" });
      } 
      */
        const match = await user.matchPassword(password);
        console.log(match);
        if (match) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Contraseña incorrecta." });
        }
      }
    }
  )
);

passport.use(
  "departamento",
  new LocalStrategy(
    { usernameField: "departamento" },
    async (departamento, password, done) => {
      //console.log("llegue al passport");
      const dep = await Departamento.findOne({ departamento: departamento });
      if (!dep) {
        return done(null, false, { message: "Departamento no encontrado" });
      } else {
        const match = await dep.matchPassword(password);
        if (match) {
          return done(null, dep);
        } else {
          return done(null, false, { message: "Contraseña incorrecta." });
        }
      }
    }
  )
);

passport.use(
  "director",
  new LocalStrategy(
    { usernameField: "director" },
    async (director, password, done) => {
      //console.log("llegue al passport");
      const dir = await Director.findOne({ director: director });
      //console.log(dir);
      if (!dir) {
        return done(null, false, { message: "Director no encontrado" });
      } else {
        const match = await dir.matchPassword(password);
        if (match) {
          console.log("ok");
          return done(null, dir);
        } else {
          console.log("cuidao");
          return done(null, false, { message: "Contraseña incorrecta." });
        }
      }
    }
  )
);


passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  try {
    if(user!=null){
      done(null,user);
    }
  } catch (error) {
    console.error(error);
  }
});
