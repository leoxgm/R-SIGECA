const req = require("express/lib/request");
const router = require("express").Router();
const User = require("../models/User");
const { isAuthenticated } = require("../helpers/auth");
const UEA = require("../models/UEA");
const Preferencia = require("../models/Preferencias");
const Preferencias = require("../models/Preferencias");

router.get("/profesores", isAuthenticated, async (req, res) => {
  try {
    //console.log(req.user);
    const profesor = await User.find({ name: req.user.name });
    const preferencias = await Preferencia.find({
      num_economic: req.user.num_economic,
    }).lean();
    res.render("profesor/main", { profesor, preferencias });
  } catch (error) {
    console.error("Hubo un error al procesar la información");
    res.redirect("/");
  }
});

router.get(
  "/profesores/nueva-preferencia",
  isAuthenticated,
  async (req, res) => {
    try {
      const uea = await UEA.find().lean();
      res.render("profesor/new-preferencia", { uea });
    } catch (error) {
      console.error(err);
      req.flash("error_msg", "Hubo un error en la solicitud");
      res.redirect("/profesores");
    }
  }
);

router.post(
  "/profesores/new-preferencia",
  isAuthenticated,
  async (req, res) => {
    try {
      const { uea } = req.body;
      const { num_economic } = req.user;
      const errors = [];
      let preferencias = [];
      if (!uea) {
        errors.push({ text: "Selecciona al menos una UEA" });
      }
      if (errors.length > 0) {
        res.render("profesor/main", { errors });
      } else {
        try {
          for (let clave of uea) {
            preferencias.push(await UEA.find({ clave: clave }).lean());
          }
          const nuevaPreferencia = new Preferencia({
            num_economic,
            preferencias,
          });
          await nuevaPreferencia.save();
          req.flash("success_msg", "Preferencias Guardadas");
          res.redirect("/profesores");
        } catch (err) {
          console.error(err);
        }
      }
    } catch (error) {
      console.error(err);
      req.flash("error_msg", "No se pudo guardar la preferencia");
      res.redirect("/profesores");
    }
  }
);

router.get("/profesores/preferencias", isAuthenticated, async (req, res) => {
  try {
    const { num_economic } = req.user;
    const preferencias = await Preferencia.find({ num_economic: num_economic });
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
    res.render("profesor/all-preferencia", { listaPreferencias });
  } catch (error) {
    console.error(err);
    req.flash("error_msg", "Hubo un error en la solicitud");
    res.redirect("/profesores");
  }
});

router.delete("/profesores/delete-preferencia/", async (req, res) => {
  try {
    const status = await Preferencia.findOneAndDelete({
      num_economic: req.user.num_economic,
    });
    if (status === null) {
      req.flash("error_msg", "No se pudo borrar la preferencia.");
      console.error("No se pudo borrar el registro`${status}`");
      res.redirect("/profesores/preferencias");
    } else {
      req.flash("success_msg", "Preferencia borrada");
      res.redirect("/profesores/preferencias");
    }
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "No se pudo borrar la preferencia.");
    res.redirect("/profesores");
  }
});

router.get(
  "/profesores/edit-preferencias",
  isAuthenticated,
  async (req, res) => {
    try {
      const ListaUEA = await UEA.find().lean();
      const preferencias = await Preferencia.find({
        num_economic: req.user.num_economic,
      });
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
      res.render("profesor/edit-preferencias", { listaPreferencias,ListaUEA });
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "No se pudo editar las preferencias");
      res.redirect("/profesores");
    }
  }
);

router.post(
  "/profesores/edit-preferencia",
  isAuthenticated,
  async (req, res) => {
    const { uea } = req.body;
    const { num_economic } = req.user;
    const errors = [];
    let preferencias = [];
    if (!uea) {
      errors.push({ text: "Selecciona al menos una UEA" });
    }
    if (errors.length > 0) {
      res.render("profesor/main", { errors });
    } else {
      try {
        for (let clave of uea) {
          preferencias.push(await UEA.find({ clave: clave }).lean());
        }
        await Preferencia.findOneAndUpdate(num_economic, {
          num_economic,
          preferencias,
        });
        req.flash("success_msg", "Preferencias Actualizadas");
        res.redirect("/profesores");
      } catch (error) {
        console.error(error);
        req.flash("error_msg", "No se pudo editar las preferencias");
        res.redirect("/profesores");
      }
    }
  }
);

module.exports = router;
