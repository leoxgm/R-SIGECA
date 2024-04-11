const req = require("express/lib/request");
const router = require("express").Router();
const { isAuthenticated } = require("../helpers/auth");
const Salones = require("../models/Salones");
const Division = require("../models/Division");

router.get("/salones", isAuthenticated, async (req, res) => {
  const salones = await Salones.find().lean();
  res.render("administrar/all-salones", { salones });
});

router.get("/salones/nuevo-salon", isAuthenticated, async (req, res) => {
  const divisiones = await Division.find().lean();
  res.render("administrar/new-salon", { divisiones });
});

router.post("/salones/new-salon", isAuthenticated, async (req, res) => {
  const { salon, cupo, responsable } = req.body;
  const errors = [];
  if (!salon) {
    errors.push({ text: "Escribe el nombre del salón" });
  }
  if (!cupo) {
    errors.push({ text: "Ingresa el cupo" });
  }
  if (errors.length > 0) {
    res.render("administrar/new-salon", {
      errors,
    });
  } else {
    try {
      const nuevoSalon = new Salones({
        salon,
        cupo,
        responsable,
      });
      await nuevoSalon.save();
      req.flash("success_msg", "Salón agregado");
      res.redirect("/salones");
    } catch (error) {
      console.error(err);
      req.flash("error_msg", "Hubo un error en la solicitud");
      res.redirect("/dashboard");
    }
  }
});

router.get("/salones/salon-edit/:id", isAuthenticated, async (req, res) => {
  const edit = await Salones.findById(req.params.id).lean();
  res.render("administrar/edit-salon", { edit });
});

router.put("/salones/salonedit/:id", isAuthenticated, async (req, res) => {
  const { salon, cupo, responsable } = req.body;
  try {
    await Salones.findByIdAndUpdate(req.params.id, {
      salon,
      cupo,
      responsable,
    });
    req.flash("success_msg", "Salón editado");
    res.redirect("/salones");
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Hubo un error en la solicitud");
    res.redirect("/dashboard");
  }
});

router.delete("/salones/delete-salon/:id", async (req, res) => {
  try {
    await Salones.findByIdAndDelete(req.params.id);
    req.flash("success_msg", "Salón borrado");
    res.redirect("/salones");
  } catch (error) {
    console.error(err);
    req.flash("error_msg", "No se pudo borrar el salón");
    res.redirect("/salones");
  }
});

module.exports = router;
