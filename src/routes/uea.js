const req = require("express/lib/request");
const router = require("express").Router();
const { isAuthenticated } = require("../helpers/auth");
const UEA = require("../models/UEA");
const Division = require("../models/Division");
const User = require("../models/User");
const Director = require("../models/Director");
const Departamento = require("../models/Departamento");

router.get("/uea", isAuthenticated, async (req, res) => {
    const uea = await UEA.find().lean();
    const division = await Division.find().lean();
    const director = await Director.find().lean();
    res.render("administrar/all-uea", { uea,division,director});
  });

router.get("/uea/nueva-uea", isAuthenticated, async (req, res) => {
    //const division = await Division.find().lean();
    console.log(req.user);
    const director = await Director.find().lean();
    res.render("administrar/nueva-uea", { director });
});

router.post("/uea/nueva-uea", isAuthenticated, async (req, res) => {
    const { uea, descripcion, clave, tronco } = req.body;
    const division = req.user.division;
    const errors = [];
    if (!uea) {
      errors.push({ text: "Escribe el nombre de la uea" });
    }
    if (!clave) {
      errors.push({ text: "Ingresa la clave" });
    }
    if (!tronco) {
        errors.push({ text: "Selecciona un tronco"})
    }
    if (errors.length > 0) {
      res.render("administrar/nueva-uea", {
        errors,
      });
    } else {
      try {
        const nuevaUEA = new UEA({
          uea,
          descripcion,
          division,
          clave,
          tronco,
        });
        await nuevaUEA.save();
        req.flash("success_msg", "UEA agregada");
        res.redirect("/uea");
      } catch (err) {
        console.error(err);
        req.flash("error_msg", "Hubo un error en la solicitud");
        res.redirect("/dashboard");
      }
    }
  });

  router.get("/uea-edit/:id", isAuthenticated, async (req, res) => {
    const division = await Division.find().lean();
    const departamento = await Departamento.find({
      departamento: req.user.departamento,
    });
    const edit = await UEA.findById(req.params.id).lean();
    res.render("administrar/edit-uea", { edit, division, departamento });
  });
  
  router.put("/ueaedit/:id", isAuthenticated, async (req, res) => {
    const { uea, descripcion, clave, division } = req.body;
    await UEA.findByIdAndUpdate(req.params.id, {
      uea,
      descripcion,
      clave,
      division,
    });
    req.flash("success_msg", "UEA editada");
    res.redirect("/uea");
  });
  
  router.delete("/delete-uea/:id", async (req, res) => {
    await UEA.findByIdAndDelete(req.params.id);
    req.flash("success_msg", "UEA borrada");
    res.redirect("/uea");
  });

module.exports = router;