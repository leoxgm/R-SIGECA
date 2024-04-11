const req = require("express/lib/request");
const router = require("express").Router();
const { isAuthenticated } = require("../helpers/auth");
const Salones = require("../models/Salones");
const Division = require("../models/Division");
const UEA = require("../models/UEA");
const Departamento = require("../models/Departamento");
const Grupos = require("../models/Grupos");

router.get("/grupos", isAuthenticated, async (req, res) => {
  const grupos = await Grupos.find().lean();
  res.render("administrar/all-grupos", { grupos });
});

router.get("/grupos/nuevo-grupo", isAuthenticated, async (req, res) => {
  const division = await Division.find().lean();
  const uea = await UEA.find().lean();
  const departamento = await Departamento.find().lean();
  const salon = await Salones.find().lean();
  res.render("administrar/nuevo-grupo", { division,uea,departamento,salon });
});

router.post("/grupos/nuevo-grupo", isAuthenticated, async (req, res) => {
  const { grupo, descripcion, division, licenciatura, uea, salon, departamento, modalidad } = req.body;
  const errors = [];
  if (!salon) {
    errors.push({ text: "Selecciona el salón" });
  }
  if (!grupo) {
    errors.push({ text: "Ingresa el grupo" });
  }
  if (!division) {
    errors.push({ text: "Selecciona la división" });
  }
  if (!uea) {
    errors.push({ text: "Selecciona la UEA" });
  }
  if (!departamento) {
    errors.push({ text: "Selecciona el departamento" });
  }
  if (!modalidad) {
    errors.push({ text: "Selecciona la modalidad" });
  }

  if (errors.length > 0) {
    res.render("administrar/nuevo-grupo", {
      errors,
    });
  } else {
    try {
      const nuevoGrupo = new Grupos({
        grupo,
        descripcion,
        division,
        licenciatura,
        uea,
        departamento,
        salon,
        modalidad
      });
      await nuevoGrupo.save();
      req.flash("success_msg", "Grupo agregado");
      res.redirect("/grupos");
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Hubo un error en la solicitud");
      res.redirect("/grupos");
    }
  }
});

router.get("/grupos/edit-grupo/:id", isAuthenticated, async (req, res) => {
  const edit = await Grupos.findById(req.params.id).lean();
  const uea = await UEA.find().lean();
  const departamento = await Departamento.find().lean();
  const salon = await Salones.find().lean();
  const division = await Division.find().lean();
  res.render("administrar/edit-grupo", { edit,uea,departamento,salon,division});
});

router.put("/grupos/edit-grupo/:id", isAuthenticated, async (req, res) => {
  const { grupo, division, uea, departamento, descripcion, salon,modalidad } = req.body;
  try {
    await Grupos.findByIdAndUpdate(req.params.id, {
      grupo,
      division,
      uea,
      departamento,
      descripcion,
      salon,
      modalidad
    });
    req.flash("success_msg", "Grupo editado");
    res.redirect("/grupos");
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Hubo un error en la solicitud");
    res.redirect("/grupos");
  }
});

router.delete("/grupos/delete-grupo/:id", async (req, res) => {
  try {
    await Grupos.findByIdAndDelete(req.params.id);
    req.flash("success_msg", "Grupo eliminado");
    res.redirect("/grupos");
  } catch (error) {
    console.error(err);
    req.flash("error_msg", "No se pudo borrar el grupo");
    res.redirect("/grupos");
  }
});

module.exports = router;