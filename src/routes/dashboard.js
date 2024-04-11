const req = require("express/lib/request");
const router = require("express").Router();
const Departamento = require("../models/Departamento");
const User = require("../models/User");
const UEA = require("../models/UEA");
const Division = require("../models/Division");
const Preferencias = require("../models/Preferencias");
const { isAuthenticated } = require("../helpers/auth");
const Horario = require("../models/Horarios");
const Director = require('../models/Director');

router.get("/dashboard", isAuthenticated, async (req, res) => {
  try {
    const departamento = await Departamento.find({
      departamento: req.user.departamento,
    });
    const director = await Director.find({director:req.user.director}).lean();
    const horario = Horario.find().lean();
    //console.log(director);
    //console.log(req.user);
    if(departamento.length<1){
      console.log("no departamento");
      res.render("administrar/dashboard",{director,horario});
    }else{
      console.log("departamento");
      res.render("administrar/dashboard", { departamento,horario });
    }
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Hubo un error en la solicitud");
    res.redirect("/");
  }
});

router.get("/dashboard/all-director",isAuthenticated,async(req,res)=>{
  try{
    const directores = await Director.find().lean();
    res.render("administrar/all-director",{directores});
  }catch(err){
    console.error(err);
    req.flash("error_msg", "Hubo un error en la solicitud");
    res.redirect("/");
  }
});

router.get("/dashboard/nuevo-director",isAuthenticated,async(req,res)=>{
  const divisiones = await Division.find().lean();
  res.render("administrar/new-director",{divisiones});
});

router.post("/dashboard/new-director", async (req, res) => {
  const { director,password, division, confirm_password } = req.body;
  const divisiones = await Division.find().lean();
  const errors = [];
  if (director.length <= 0) {
    errors.push({ text: "El nombre del director no puede estar vacio." });
  }
  if (password != confirm_password) {
    errors.push({ text: "Las contraseñas no coinciden." });
  }
  if (password.length < 4) {
    errors.push({ text: "La contraseña debe tener almenos 4 caracteres." });
  }
  if (errors.length > 0) {
    res.render("administrar/new-director", { errors, divisiones});
  } else {
    console.error(errors);
    const newDirector = new Director({
      director,
      password,
      division,
    });
    newDirector.password = await newDirector.encryptPassword(password);
    try {
      await newDirector.save();
    } catch (e) {
      console.error(e);
      req.flash("error_msg", "Hubo un problema al registrar");
      res.redirect("/dashboard");
    }
    req.flash("success_msg", "Director registrado");
    res.redirect("/");
  }
});

router.get(
  "/dashboard/director-edit/:id",
  isAuthenticated,
  async (req, res) => {
    const edit = await Director.findById(req.params.id).lean();
    const divisiones = await Division.find().lean();
    res.render("administrar/edit-director", {
      edit,
      divisiones,
    });
  }
);

router.put(
  "/dashboard/directoredit/:id",
  isAuthenticated,
  async (req, res) => {
    const { director, password, division } = req.body;
    try {
      await Director.findByIdAndUpdate(req.params.id, {
        director,
        password,
        division,
      });
      req.flash("success_msg", "Director editado");
      res.redirect("/dashboard/all-director");
    } catch (err) {
      console.error(err);
      req.flash("error_msg", "No se pudo actualizar director");
      res.redirect("/dashboard/all-director");
    }
  }
);

router.delete("/dashboard/delete-director/:id", async (req, res) => {
  try {
    await Director.findByIdAndDelete(req.params.id);
    req.flash("success_msg", "Director borrado");
    res.redirect("/dashboard/all-director");
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "No se pudo borrar el director");
    res.redirect("/dashboard/all-director");
  }
});

router.get("/dashboard/nuevo-profesor", isAuthenticated, async (req, res) => {
  const departamentos = await Departamento.find({departamento:{$ne:"ADMIN"}}).lean();
  res.render("administrar/nuevo-profesor", { departamentos });
});

router.get("/dashboard/all-profesor", isAuthenticated, async (req, res) => {
  const departamento = await Departamento.find({
    departamento: req.user.departamento,
  });
  const usuario = await User.find().lean();
  res.render("administrar/all-profesor", { usuario, departamento });
});

router.get(
  "/dashboard/profesor-edit/:id",
  isAuthenticated,
  async (req, res) => {
    const departamentos = await Departamento.find({departamento:{$ne:"ADMIN"}}).lean();
    const edit = await User.findById(req.params.id).lean();
    res.render("administrar/edit-profesor", { edit, departamentos });
  }
);

router.get("/dashboard/profesor-preferencia/:id",isAuthenticated,async(req,res)=>{
  const {num_economic} = await User.findById(req.params.id).lean();
  const preferencias = await Preferencias.find({num_economic:num_economic});
  let ueas = [];
    let listaPreferencias = [];
    for (let uea of preferencias) {
      ueas.push(uea.preferencias);
    }
    for (let pref of ueas) {
      for (let casi of pref) {
        for (let fin of casi) {
          listaPreferencias.push(fin);
        }
      }
    }
  res.render("administrar/profesor-preferencias",{listaPreferencias,num_economic});
});

router.put("/dashboard/profesoredit/:id", isAuthenticated, async (req, res) => {
  const { name, email, password, num_economic, telefono, horario, departamento } = req.body;
  try {
    await User.findByIdAndUpdate(req.params.id, {
      name,
      email,
      password,
      num_economic,
      telefono,
      horario,
      departamento,
    });
  } catch (err) {
    req.flash("error_msg", "Hubo un error al editar.");
    res.redirect("/dashboard/all-profesor");
  }
  req.flash("success_msg", "Profesor editado");
  res.redirect("/dashboard/all-profesor");
});

router.delete("/dashboard/delete-profesor/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "No se pudo borrar el profesor.");
    res.redirect("/dashboard/all-profesor");
  }
  req.flash("success_msg", "Profesor borrado");
  res.redirect("/dashboard/all-profesor");
});

router.get(
  "/dashboard/all-departamentos",
  isAuthenticated,
  async (req, res) => {
    try {
      const departamento = await Departamento.find({
        departamento: req.user.departamento,
      });
      const departamentos = await Departamento.find({departamento:{$ne:"ADMIN"}}).lean();
      res.render("administrar/all-departamentos", {
        departamento,
        departamentos,
      });
    } catch (err) {
      console.error(err);
      res.redirect("/dashboard");
    }
  }
);

router.get(
  "/dashboard/nuevo-departamento",
  isAuthenticated,
  async (req, res) => {
    const departamento = await Departamento.find({
      departamento: req.user.departamento,
    });
    const divisiones = await Division.find().lean();
    res.render("administrar/nuevo-departamento", { departamento, divisiones });
  }
);

router.get(
  "/dashboard/departamento-edit/:id",
  isAuthenticated,
  async (req, res) => {
    const edit = await Departamento.findById(req.params.id).lean();
    const divisiones = await Division.find().lean();
    console.log(edit);
    res.render("administrar/edit-departamento", {
      edit,
      divisiones,
    });
  }
);

router.put(
  "/dashboard/departamentoedit/:id",
  isAuthenticated,
  async (req, res) => {
    const { departamento, password, division } = req.body;
    try {
      await Departamento.findByIdAndUpdate(req.params.id, {
        departamento,
        password,
        division,
      });
      req.flash("success_msg", "Departamento editado");
      res.redirect("/dashboard/all-departamentos");
    } catch (err) {
      console.error(err);
      req.flash("error_msg", "No se pudo actualizar departamento");
      res.redirect("/dashboard/all-departamentos");
    }
  }
);

router.delete("/dashboard/delete-departamento/:id", async (req, res) => {
  try {
    await Departamento.findByIdAndDelete(req.params.id);
    req.flash("success_msg", "Departamento borrado");
    res.redirect("/dashboard/all-departamentos");
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "No se pudo borrar el departamento");
    res.redirect("/dashboard/all-departamentos");
  }
});

module.exports = router;
