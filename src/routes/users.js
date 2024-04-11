const req = require("express/lib/request");

const router = require("express").Router();

const User = require("../models/User");

const passport = require("passport");

const Division = require("../models/Division");

const Departamento = require("../models/Departamento");

const Director = require("../models/Director");

router.get("/users/signin", (req, res) => {
  if (req.user) {
    console.log("loggeado");
  } else {
    console.error("No loggeado");
  }
  res.render("users/signin");
});

router.post(
  "/users/signin/profesor",
  passport.authenticate("local", {
    successRedirect: "/profesores",
    failureRedirect: "/",
    failureFlash: true,
    badRequestMessage: "Credenciales faltantes",
  })
);

router.post(
  "/users/signin/departamento",
  passport.authenticate("departamento", {
    successRedirect: "/dashboard",
    failureRedirect: "/",
    failureFlash: true,
    badRequestMessage: 'Credenciales faltantes',
  })
);

router.post(
  "/users/signin/director",
  passport.authenticate("director", {
    successRedirect: "/dashboard",
    failureRedirect: "/",
    failureFlash: true,
    badRequestMessage: 'Credenciales faltantes',
  })
);

router.get("/users/signup", async (req, res) => {
  const divisiones = await Division.find().lean();
  const departamento = await Departamento.find().lean();
  const director = await Director.find().lean();
  res.render("users/signup", { divisiones, departamento });
});

router.post("/users/signup", async (req, res) => {
  const {
    name,
    email,
    password,
    num_economic,
    confirm_password,
    telefono,
    horario_inicio,
    horario_fin,
    departamento,
    division,
  } = req.body;
  var horario = horario_inicio + "-" + horario_fin;
  const errors = [];
  if (name.length <= 0) {
    errors.push({ text: "Nombre no puede estar vacio." });
  }
  if (division.length <= 0) {
    errors.push({ text: "Division no puede estar vacio." });
  }
  if (email.length <= 0) {
    errors.push({ text: "Es necesario insertar un correo." });
  }
  if (password != confirm_password) {
    errors.push({ text: "Las contraseñas no coinciden." });
  }
  if (password.length < 4) {
    errors.push({ text: "La contraseña debe tener almenos 4 caracteres." });
  }
  if (num_economic.length <= 0) {
    errors.push({ text: "Debes ingresar el número ecónomico" });
  }
  if (telefono.length <= 0) {
    errors.push({ text: "Debes ingresar el número teléfonico" });
  }
  if (errors.length > 0) {
    res.render("users/signup", { errors });
  } else {
    const emailUser = await User.findOne({ email: email }).lean();
    if (emailUser) {
      console.error("EMAIL YA EXISTENTE");
      errors.push({ text: "Este email ya ha sido registrado." });
      req.flash("error_msg", "Este email ya ha sido registrado.");
      res.render("users/signup", { errors });
    } else {
      try {
        const newUser = new User({
          name,
          email,
          password,
          num_economic,
          telefono,
          horario,
          departamento,
          division,
        });
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash("success_msg", "Se ha realizado el registro exitosamente.");
        res.redirect("/dashboard/all-profesor");
      } catch (e) {
        console.error(e);
        req.flash("error_msg", "Hubo un problema al registrar");
        res.redirect("/users/signup");
      }
    }
  }
});

router.post("/users/signup/division", async (req, res) => {
  const { name } = req.body;
  const errors = [];
  if (name.length <= 0) {
    errors.push({ text: "Nombre no puede estar vacio." });
  }
  if (errors.length > 0) {
    res.render("users/signup", { errors });
  } else {
    const newDivision = new Division({ name });
    try {
      await newDivision.save();
    } catch (e) {
      console.error(e);
      req.flash("error_msg", "Hubo un problema al registrar");
      res.redirect("/users/signup");
    }
    req.flash("success_msg", "División registrada");
    res.redirect("/");
  }
});

router.post("/users/signup/departamento", async (req, res) => {
  const { departamento, password, division, confirm_password } = req.body;
  const errors = [];
  if (departamento.length <= 0) {
    errors.push({ text: "El nombre del departamento no puede estar vacio." });
  }
  if (password != confirm_password) {
    errors.push({ text: "Las contraseñas no coinciden." });
  }
  if (password.length < 4) {
    errors.push({ text: "La contraseña debe tener almenos 4 caracteres." });
  }
  if (errors.length > 0) {
    res.render("users/signup", { errors });
  } else {
    console.error(errors);
    const newDepartamento = new Departamento({
      departamento,
      password,
      division,
    });
    newDepartamento.password = await newDepartamento.encryptPassword(password);
    try {
      await newDepartamento.save();
    } catch (e) {
      console.error(e);
      req.flash("error_msg", "Hubo un problema al registrar");
      res.redirect("/users/signup");
    }
    req.flash("success_msg", "Departamento registrado");
    res.redirect("/");
  }
});

router.post("/users/signup/director", async (req, res) => {
  console.log(await Director.find().lean());
  const {
    director,
    departamento,
    password,
    division,
    confirm_password,
    correo,
  } = req.body;
  console.log(req.body);
  const errors = [];
  if (director.length <= 0) {
    errors.push({ text: "El nombre debe tener al menos un caracter." });
  }
  if (!departamento) {
    errors.push({ text: "El nombre del departamento no puede estar vacio." });
  }
  if (password != confirm_password) {
    errors.push({ text: "Las contraseñas no coinciden." });
  }
  if (password.length < 4) {
    errors.push({ text: "La contraseña debe tener almenos 4 caracteres." });
  }
  if (correo <= 0) {
    errors.push({ text: "Es necesario ingresar un correo." });
  }
  if (errors.length > 0) {
    res.render("users/signup", { errors });
  } else {
    const correoDirector = await Director.findOne({ correo: correo }).lean();
    console.log(correoDirector);
    if (correoDirector) {
      console.error("EMAIL YA EXISTENTE");
      errors.push({ text: "Este email ya ha sido registrado." });
      req.flash("error_msg", "Este email ya ha sido registrado.");
      res.render("users/signup", { errors });
    } else {
      try {
        const newDirector = new Director({
          correo,
          password,
          departamento,
          division,
          director,
        });
        newDirector.password = await newDirector.encryptPassword(password);
        await newDirector.save();
        req.flash("success_msg", "Se ha realizado el registro exitosamente.");
        res.redirect("/dashboard/nuevo-director");
      } catch (e) {
        console.error(e);
        req.flash("error_msg", "Hubo un problema al registrar");
        res.redirect("/");
      }
    }
  }
});

router.get("/users/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/dashboard");
  });
});

module.exports = router;
