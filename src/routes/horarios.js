const req = require("express/lib/request");
const router = require("express").Router();
const mongoose = require("mongoose");
const Division = require("../models/Division");
const Horarios = require("../models/Horarios");
const { isAuthenticated } = require("../helpers/auth");
const Custom = require("../helpers/custom");
const Salones = require("../models/Salones");
const UEA = require("../models/UEA");
const Profesores = require("../models/User");
const Grupos = require ("../models/Grupos");

router.get("/horario", isAuthenticated, async (req, res) => {
  //Cuando findOne NO tiene documentos en la coleccion Horarios te devulve un nulo. 
  //Cuando findOne SI tiene documentos en la colección Horarios te devuelve el primero que encuentre.
  //sort ordena depende del parámetro
  //Cuando find No tiene documentos de la colección Horarios NO te devuelve NADA
  //Cuando find SI tiene documenotos de la colección Horarios TE devuelve TODOS
  //En find y findOne también busca lo que le metas en los parametros (filtro), es decir, dentro de los parentesis
  const horario = await Horarios.findOne().sort({ _id: -1 }).limit(1).lean();
  const horarios = await Horarios.find().lean();
  const salones = await Salones.find().lean();
  const uea = await UEA.find().lean();
  const profesores = await Profesores.find().lean();
  const grupos = await Grupos.find().lean();

  const errors = [];
  const dias = [];
  console.log(horario);
  if (horario) {
    for (var i = 0; i < horario.clase.length; i++) {
      if (horario.clase[i].lunes && dias[i] != "lunes") {
        dias.push("lunes");
      }
      if (horario.clase[i].martes) {
        dias.push("martes");
      }
      if (horario.clase[i].miercoles) {
        dias.push("miercoles");
      }
      if (horario.clase[i].jueves) {
        dias.push("jueves");
      }
      if (horario.clase[i].viernes) {
        dias.push("viernes");
      }
    }
    diasFiltrado = [...new Set(dias)];
    for (var i = 0; i < horario.clase.length; i++) {
      for (var j = 1; j < horario.clase.length; j++) {
        if (i === j) {
          continue;
        }
        if (horario.clase[i] && horario.clase[j]) {
          diasFiltrado.forEach((dia) => {
            if (
              horario.clase[i].profesor === horario.clase[j].profesor &&
              (Object(horario.clase[i][dia]).salon !=
                Object(horario.clase[j][dia]).salon ||
                (Object(horario.clase[i][dia]).horario_inicio ==
                  Object(horario.clase[j][dia]).horario_inicio &&
                  Object(horario.clase[i][dia]).horario_fin ==
                    Object(horario.clase[j][dia]).horario_fin))
            ) {
              if (horario.clase[i].id != horario.clase[j].id) {
                errors.push({
                  text:
                    dia +
                    ": El profesor " +
                    horario.clase[i].profesor +
                    " fue asignado en dos salones diferentes a la misma hora, folios afectados " +
                    horario.clase[j].id +
                    " ," +
                    horario.clase[i].id,
                });
              }
            }
          });
        }
      }
    }
  }else{
    req.flash("error_msg", "No hay información");
  }
  const uniqueArray = errors.filter((value, index) => {
    const _value = JSON.stringify(value);
    return (
      index ===
      errors.findIndex((obj) => {
        return JSON.stringify(obj) === _value;
      })
    );
  });

  console.log(uniqueArray);

  if(horario){
    if (horario.length < 1) {
      sinClases = 1;
      res.render("administrar/horario", {
        horario,
        sinClases,
        horarios,
        salones,
        uea,
        grupos,
        profesores,
      });
    } else {
      res.render("administrar/horario", {
        horario,
        horarios,
        salones,
        uea,
        profesores,
        grupos,
        errors,
      });
    }
  }else{
    errors.push({text: "No hay información "});
    res.render("administrar/horario", {
      horario,
      horarios,
      salones,
      uea,
      profesores,
      grupos,
      errors,
    });
  }
}); 

router.post("/horario/buscar-horario", isAuthenticated, async (req, res) => {
  const { trimestre } = req.body;
  try {
    const horario = await Horarios.findOne({ trimestre: trimestre }).lean();
    const horarios = await Horarios.find().lean();
    const salones = await Salones.find().lean();
    const uea = await UEA.find().lean();
    const profesores = await Profesores.find().lean();
    const grupos = await Grupos.find().lean();

    const errors = [];

    for (var i = 1; i < horario.clase.length; i++) {
      if (horario.clase[i - 1].lunes && horario.clase[i].lunes) {
        if (
          horario.clase[i - 1].profesor === horario.clase[i].profesor &&
          (horario.clase[i - 1].lunes.salon != horario.clase[i].lunes.salon ||
            (horario.clase[i - 1].lunes.horario_inicio &&
              horario.clase[i - 1].lunes.horario_fin ===
                horario.clase[i].lunes.horario_inicio &&
              horario.clase[i].lunes.horario_fin))
        ) {
          if (horario.clase[i].id != horario.clase[j].id) {
            console.error("incidencia en lunes");
            console.error(
              "incidencia en:" +
                horario.clase[i].id +
                " ," +
                horario.clase[i - 1].id
            );
            errors.push({
              text:
                "LUNES: El profesor " +
                horario.clase[i].profesor +
                " fue asignado en dos salones diferentes a la misma hora, folios afectados " +
                horario.clase[i - 1].id +
                " ," +
                horario.clase[i].id,
            });
          }
        }
      }

      if (horario.clase[i - 1].martes && horario.clase[i].martes) {
        if (lunes) {
          console.error("incidencia en martes");
          console.error(
            "incidencia en:" +
              horario.clase[i].id +
              " ," +
              horario.clase[i - 1].id
          );
          errors.push({
            text:
              "MARTES: El profesor " +
              horario.clase[i].profesor +
              " fue asignado en dos salones diferentes a la misma hora, folios afectados " +
              horario.clase[i - 1].id +
              " ," +
              horario.clase[i].id,
          });
        }
      }
      if (horario.clase[i - 1].miercoles && horario.clase[i].miercoles) {
        if (
          horario.clase[i - 1].profesor === horario.clase[i].profesor &&
          (horario.clase[i - 1].miercoles.salon !=
            horario.clase[i].miercoles.salon ||
            (horario.clase[i - 1].miercoles.horario_inicio &&
              horario.clase[i - 1].miercoles.horario_fin ===
                horario.clase[i].miercoles.horario_inicio &&
              horario.clase[i].miercoles.horario_fin))
        ) {
          console.error("incidencia en miercoles");
          console.error(
            "incidencia en:" +
              horario.clase[i].id +
              " ," +
              horario.clase[i - 1].id
          );
          errors.push({
            text:
              "MIERCOLES: El profesor " +
              horario.clase[i].profesor +
              " fue asignado en dos salones diferentes a la misma hora, folios afectados " +
              horario.clase[i - 1].id +
              " ," +
              horario.clase[i].id,
          });
        }
      }
      if (horario.clase[i - 1].jueves && horario.clase[i].jueves) {
        if (
          horario.clase[i - 1].profesor === horario.clase[i].profesor &&
          (horario.clase[i - 1].jueves.salon != horario.clase[i].jueves.salon ||
            (horario.clase[i - 1].jueves.horario_inicio &&
              horario.clase[i - 1].jueves.horario_fin ===
                horario.clase[i].jueves.horario_inicio &&
              horario.clase[i].jueves.horario_fin))
        ) {
          console.error("incidencia en jueves");
          console.error(
            "incidencia en:" +
              horario.clase[i].id +
              " ," +
              horario.clase[i - 1].id
          );
          errors.push({
            text:
              "JUEVES: El profesor " +
              horario.clase[i].profesor +
              " fue asignado en dos salones diferentes a la misma hora, folios afectados " +
              horario.clase[i - 1].id +
              " ," +
              horario.clase[i].id,
          });
        }
      }
      if (horario.clase[i - 1].viernes && horario.clase[i].viernes) {
        if (
          horario.clase[i - 1].profesor === horario.clase[i].profesor &&
          (horario.clase[i - 1].viernes.salon !=
            horario.clase[i].viernes.salon ||
            (horario.clase[i - 1].viernes.horario_inicio &&
              horario.clase[i - 1].viernes.horario_fin ===
                horario.clase[i].viernes.horario_inicio &&
              horario.clase[i].viernes.horario_fin))
        ) {
          console.error("incidencia en viernes");
          console.error(
            "incidencia en:" +
              horario.clase[i].id +
              " ," +
              horario.clase[i - 1].id
          );
          errors.push({
            text:
              "VIERNES: El profesor " +
              horario.clase[i].profesor +
              " fue asignado en dos salones diferentes a la misma hora, folios afectados " +
              horario.clase[i - 1].id +
              " ," +
              horario.clase[i].id,
          });
        }
      }
    }
    res.render("administrar/horario", {
      horario,
      horarios,
      salones,
      uea,
      profesores,
      errors,
      grupos
    });
  } catch (err) {
    console.error(err);
    res.redirect("/horario");
  }
});

router.get("/nuevo-horario", isAuthenticated, async (req, res) => {
  trimestres = Custom.obtenerProximosTrimestres(4);
  division = await Division.find().lean();
  horario = await Horarios.find().lean();
  for (i in trimestres) {
    if (trimestres[i] == horario.trimestre) {
      trimestres.drop(trimestres[i]);
    }
  }
  res.render("administrar/nuevo-horario", { trimestres, division });
});

router.post("/new-horario", isAuthenticated, async (req, res) => {
  const { trimestre, division } = req.body;
  const errors = [];
  if (!trimestre) {
    errors.push({ text: "Selecciona un trimestre" });
  }
  if (!division) {
    errors.push({ text: "Selecciona una división" });
  }
  if (errors.length > 0) {
    res.render("administrar/nuevo-horario", { errors });
  } else {
    try {
      const nuevoHorario = new Horarios({
        trimestre,
        division,
      });
      await nuevoHorario.save();
      req.flash("success_msg", "Horario guardado");
      res.redirect("/horario");
    } catch (error) {
      console.error(error);
      req.flash("error_msg", "Hubo un error en la solicitud");
      res.redirect("/dashboard");
    }
  }
});

router.get("/horario/clase-edit/:id", isAuthenticated, async (req, res) => {
  const edit = await Horarios.findOne(
    { "clase.id": mongoose.Types.ObjectId(req.params.id) },
    { "clase.$": 1 }
  ).lean();
  const horarios = await Horarios.find().lean();
  const salones = await Salones.find().lean();
  const uea = await UEA.find().lean();
  const profesores = await Profesores.find().lean();
  const grupos = await Grupos.find().lean();
  res.render("administrar/edit-clase", {
    edit,
    salones,
    horarios,
    uea,
    profesores,
    grupos
  });
});

router.put("/horario/edit-clase/:id", isAuthenticated, async (req, res) => {
  const {
    trimestre,
    uea,
    grupo,
    profesor,
    salon_lunes,
    salon_martes,
    salon_miercoles,
    salon_jueves,
    salon_viernes,
    lunes,
    martes,
    miercoles,
    jueves,
    viernes,
    horario_inicio_lunes,
    horario_fin_lunes,
    horario_inicio_martes,
    horario_fin_martes,
    horario_inicio_miercoles,
    horario_fin_miercoles,
    horario_inicio_jueves,
    horario_fin_jueves,
    horario_inicio_viernes,
    horario_fin_viernes,
  } = req.body;
  const query = await UEA.find({ uea: uea }).lean();
  const clave = query[0].clave;
  const id = req.params.id;
  const errors = [];
  let dias = [];
  let clase = {};
  if (lunes || martes || miercoles || jueves || viernes) {
    dias.push(lunes, martes, miercoles, jueves, viernes);
    dias = dias.filter((item) => item);
  } else {
    errors.push({ text: "Seleccione al menos un día" });
  }
  if (!trimestre) {
    errors.push({ text: "Selecciona un trimestre" });
  }
  if (!uea) {
    errors.push({ text: "Selecciona una UEA" });
  }
  if (!grupo) {
    errors.push({ text: "Selecciona un grupo" });
  } 
  if (!profesor) {
    errors.push({ text: "Selecciona un profesor" });
  }
  if (dias.length < 1) {
    errors.push({ text: "Seleccione al menos un día" });
  }
  if (
    (lunes && horario_inicio_lunes.length < 1) ||
    (lunes && horario_fin_lunes.length < 1)
  ) {
    errors.push({ text: "Ingrese los datos completos para el día lunes" });
  }
  if (
    (martes && horario_inicio_martes.length < 1) ||
    (martes && horario_fin_martes.length < 1)
  ) {
    errors.push({ text: "Ingrese los datos completos para el día martes" });
  }
  if (
    (miercoles && horario_inicio_miercoles.length < 1) ||
    (miercoles && horario_fin_miercoles.length < 1)
  ) {
    errors.push({ text: "Ingrese los datos completos para el día miercoles" });
  }
  if (
    (jueves && horario_inicio_jueves.length < 1) ||
    (jueves && horario_fin_jueves.length < 1)
  ) {
    errors.push({ text: "Ingrese los datos completos para el día jueves" });
  }
  if (
    (viernes && horario_inicio_viernes.length < 1) ||
    (viernes && horario_fin_viernes.length < 1)
  ) {
    errors.push({ text: "Ingrese los datos completos para el día viernes" });
  }
  if (viernes && salon_viernes.length < 1) {
    errors.push({ text: "Ingrese el salón para el viernes" });
  }
  if (jueves && salon_jueves.length < 1) {
    errors.push({ text: "Ingrese el salón para el jueves" });
  }
  if (miercoles && salon_miercoles.length < 1) {
    errors.push({ text: "Ingrese el salón para el miercoles" });
  }
  if (martes && salon_martes.length < 1) {
    errors.push({ text: "Ingrese el salón para el martes" });
  }
  if (lunes && salon_lunes.length < 1) {
    errors.push({ text: "Ingrese el salón para el lunes" });
  }
  if (horario_fin_lunes < horario_inicio_lunes) {
    errors.push({ text: "Ingrese el horario correctamente" });
  }
  if (horario_fin_martes < horario_inicio_martes) {
    errors.push({ text: "Ingrese el horario correctamente" });
  }
  if (horario_fin_miercoles < horario_inicio_miercoles) {
    errors.push({ text: "Ingrese el horario correctamente" });
  }
  if (horario_fin_jueves < horario_inicio_jueves) {
    errors.push({ text: "Ingrese el horario correctamente" });
  }
  if (horario_fin_viernes < horario_inicio_viernes) {
    errors.push({ text: "Ingrese el horario correctamente" });
  }
  if (lunes && horario_fin_lunes === horario_inicio_lunes) {
    errors.push({ text: "La clase no tiene duración" });
  }
  if (martes && horario_fin_martes === horario_inicio_martes) {
    errors.push({ text: "La clase no tiene duración" });
  }
  if (miercoles && horario_fin_miercoles === horario_inicio_miercoles) {
    errors.push({ text: "La clase no tiene duración" });
  }
  if (jueves && horario_fin_jueves === horario_inicio_jueves) {
    errors.push({ text: "La clase no tiene duración" });
  }
  if (viernes && horario_fin_viernes === horario_inicio_viernes) {
    errors.push({ text: "La clase no tiene duración" });
  }
  if (errors.length > 0) {
    console.error("error");
    const horario = await Horarios.findOne().sort({ _id: -1 }).limit(1).lean();
    const horarios = await Horarios.find().lean();
    const salones = await Salones.find().lean();
    const uea = await UEA.find().lean();
    const profesores = await Profesores.find().lean();
    const grupos = await Grupos.find().lean();
    res.render("administrar/horario", {
      errors,
      horario,
      horarios,
      salones,
      uea,
      profesores,
      grupos
    });
  } else {
    clase = {
      id: id,
      trimestre: trimestre,
      clave: clave,
      uea: uea,
      profesor: profesor,
      grupo: grupo,
      lunes: {
        salon: salon_lunes,
        horario_inicio: horario_inicio_lunes,
        horario_fin: horario_fin_lunes,
      },
      martes: {
        salon: salon_martes,
        horario_inicio: horario_inicio_martes,
        horario_fin: horario_fin_martes,
      },
      miercoles: {
        salon: salon_miercoles,
        horario_inicio: horario_inicio_miercoles,
        horario_fin: horario_fin_miercoles,
      },
      jueves: {
        salon: salon_jueves,
        horario_inicio: horario_inicio_jueves,
        horario_fin: horario_fin_jueves,
      },
      viernes: {
        salon: salon_viernes,
        horario_inicio: horario_inicio_viernes,
        horario_fin: horario_fin_viernes,
      },
    };
    if (
      clase.lunes.salon === undefined ||
      clase.lunes.horario_inicio.length < 1 ||
      clase.lunes.horario_fin.length < 1
    ) {
      delete clase.lunes;
    }
    if (
      clase.martes.salon === undefined ||
      clase.martes.horario_inicio.length < 1 ||
      clase.martes.horario_fin.length < 1
    ) {
      delete clase.martes;
    }
    if (
      clase.miercoles.salon === undefined ||
      clase.miercoles.horario_inicio.length < 1 ||
      clase.miercoles.horario_fin.length < 1
    ) {
      delete clase.miercoles;
    }
    if (
      clase.jueves.salon === undefined ||
      clase.jueves.horario_inicio.length < 1 ||
      clase.jueves.horario_fin.length < 1
    ) {
      delete clase.jueves;
    }
    if (
      clase.viernes.salon === undefined ||
      clase.viernes.horario_inicio.length < 1 ||
      clase.viernes.horario_fin.length < 1
    ) {
      delete clase.viernes;
    }
    try {
      status = await Horarios.findOneAndUpdate(
        { "clase.id": mongoose.Types.ObjectId(req.params.id) },
        { $set: { "clase.$": clase } }
      );
      console.log(status);
      req.flash("success_msg", "Clase editada");
      res.redirect("/horario");
    } catch (err) {
      console.error(err);
      req.flash("error_msg", "No se pudo editar la clase");
      res.redirect("/horario");
    }
  }
});

router.delete("/horario/delete-clase/:id", async (req, res) => {
  try {
    status = await Horarios.findOneAndUpdate(
      { "clase.id": mongoose.Types.ObjectId(req.params.id) },
      { $pull: { clase: { id: mongoose.Types.ObjectId(req.params.id) } } }
    );
    req.flash("success_msg", "Clase borrada");
    res.redirect("/horario");
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "No se pudo borrar la clase");
    res.redirect("/horario");
  }
});

router.post("/horario/nueva-clase", isAuthenticated, async (req, res) => {
  const {
    trimestre,
    uea,
    profesor,
    grupo,
    salon_lunes,
    salon_martes,
    salon_miercoles,
    salon_jueves,
    salon_viernes,
    lunes,
    martes,
    miercoles,
    jueves,
    viernes,
    horario_inicio_lunes,
    horario_fin_lunes,
    horario_inicio_martes,
    horario_fin_martes,
    horario_inicio_miercoles,
    horario_fin_miercoles,
    horario_inicio_jueves,
    horario_fin_jueves,
    horario_inicio_viernes,
    horario_fin_viernes,
  } = req.body;

  const errors = [];
  let dias = [];

  if (lunes || martes || miercoles || jueves || viernes) {
    dias.push(lunes, martes, miercoles, jueves, viernes);
    dias = dias.filter((item) => item);
  } else {
    errors.push({ text: "Seleccione al menos un día" });
  }
  if (!trimestre) {
    errors.push({ text: "Selecciona un trimestre" });
  }
  if (!uea) {
    errors.push({ text: "Selecciona una UEA" });
  }

  if (!profesor) {
    errors.push({ text: "Selecciona un profesor" });
  }
  if (dias.length < 1) {
    errors.push({ text: "Seleccione al menos un día" });
  }
  if (
    (lunes && horario_inicio_lunes.length < 1) ||
    (lunes && horario_fin_lunes.length < 1)
  ) {
    errors.push({ text: "Ingrese los datos completos para el día lunes" });
  }
  if (
    (martes && horario_inicio_martes.length < 1) ||
    (martes && horario_fin_martes.length < 1)
  ) {
    errors.push({ text: "Ingrese los datos completos para el día martes" });
  }
  if (
    (miercoles && horario_inicio_miercoles.length < 1) ||
    (miercoles && horario_fin_miercoles.length < 1)
  ) {
    errors.push({ text: "Ingrese los datos completos para el día miercoles" });
  }
  if (
    (jueves && horario_inicio_jueves.length < 1) ||
    (jueves && horario_fin_jueves.length < 1)
  ) {
    errors.push({ text: "Ingrese los datos completos para el día jueves" });
  }
  if (
    (viernes && horario_inicio_viernes.length < 1) ||
    (viernes && horario_fin_viernes.length < 1)
  ) {
    errors.push({ text: "Ingrese los datos completos para el día viernes" });
  }
  if (viernes && salon_viernes.length < 1) {
    errors.push({ text: "Ingrese el salón para el viernes" });
  }
  if (jueves && salon_jueves.length < 1) {
    errors.push({ text: "Ingrese el salón para el jueves" });
  }
  if (miercoles && salon_miercoles.length < 1) {
    errors.push({ text: "Ingrese el salón para el miercoles" });
  }
  if (martes && salon_martes.length < 1) {
    errors.push({ text: "Ingrese el salón para el martes" });
  }
  if (lunes && salon_lunes.length < 1) {
    errors.push({ text: "Ingrese el salón para el lunes" });
  }
  if (horario_fin_lunes < horario_inicio_lunes) {
    errors.push({ text: "Ingrese el horario correctamente" });
  }
  if (horario_fin_martes < horario_inicio_martes) {
    errors.push({ text: "Ingrese el horario correctamente" });
  }
  if (horario_fin_miercoles < horario_inicio_miercoles) {
    errors.push({ text: "Ingrese el horario correctamente" });
  }
  if (horario_fin_jueves < horario_inicio_jueves) {
    errors.push({ text: "Ingrese el horario correctamente" });
  }
  if (horario_fin_viernes < horario_inicio_viernes) {
    errors.push({ text: "Ingrese el horario correctamente" });
  }
  if (lunes && horario_fin_lunes === horario_inicio_lunes) {
    errors.push({ text: "La clase no tiene duración" });
  }
  if (martes && horario_fin_martes === horario_inicio_martes) {
    errors.push({ text: "La clase no tiene duración" });
  }
  if (miercoles && horario_fin_miercoles === horario_inicio_miercoles) {
    errors.push({ text: "La clase no tiene duración" });
  }
  if (jueves && horario_fin_jueves === horario_inicio_jueves) {
    errors.push({ text: "La clase no tiene duración" });
  }
  if (viernes && horario_fin_viernes === horario_inicio_viernes) {
    errors.push({ text: "La clase no tiene duración" });
  }
  if (errors.length > 0) {
    console.error("error");
    const horario = await Horarios.findOne().sort({ _id: -1 }).limit(1).lean();
    const horarios = await Horarios.find().lean();
    const salones = await Salones.find().lean();
    const uea = await UEA.find().lean();
    const profesores = await Profesores.find().lean();
    const grupos = await Grupos.find().lean();
    res.render("administrar/horario", {
      errors,
      horario,
      horarios,
      salones,
      uea,
      profesores,
      grupos,
    });
  } else {
    const query = await UEA.find({ uea: uea }).lean();
    const clave = query[0].clave;
    const id = new mongoose.Types.ObjectId();
    let clase = {};
    clase = {
      id: id,
      trimestre: trimestre,
      clave: clave,
      uea: uea,
      profesor: profesor,
      grupo: grupo,
      lunes: {
        salon: salon_lunes,
        horario_inicio: horario_inicio_lunes,
        horario_fin: horario_fin_lunes,
      },
      martes: {
        salon: salon_martes,
        horario_inicio: horario_inicio_martes,
        horario_fin: horario_fin_martes,
      },
      miercoles: {
        salon: salon_miercoles,
        horario_inicio: horario_inicio_miercoles,
        horario_fin: horario_fin_miercoles,
      },
      jueves: {
        salon: salon_jueves,
        horario_inicio: horario_inicio_jueves,
        horario_fin: horario_fin_jueves,
      },
      viernes: {
        salon: salon_viernes,
        horario_inicio: horario_inicio_viernes,
        horario_fin: horario_fin_viernes,
      },
    };
    if (
      clase.lunes.salon === undefined ||
      clase.lunes.horario_inicio.length < 1 ||
      clase.lunes.horario_fin.length < 1
    ) {
      delete clase.lunes;
    }
    if (
      clase.martes.salon === undefined ||
      clase.martes.horario_inicio.length < 1 ||
      clase.martes.horario_fin.length < 1
    ) {
      delete clase.martes;
    }
    if (
      clase.miercoles.salon === undefined ||
      clase.miercoles.horario_inicio.length < 1 ||
      clase.miercoles.horario_fin.length < 1
    ) {
      delete clase.miercoles;
    }
    if (
      clase.jueves.salon === undefined ||
      clase.jueves.horario_inicio.length < 1 ||
      clase.jueves.horario_fin.length < 1
    ) {
      delete clase.jueves;
    }
    if (
      clase.viernes.salon === undefined ||
      clase.viernes.horario_inicio.length < 1 ||
      clase.viernes.horario_fin.length < 1
    ) {
      delete clase.viernes;
    }
    try {
      await Horarios.findOneAndUpdate(
        { trimestre: trimestre },
        { $push: { clase: clase } }
      );
      req.flash("success_msg", "Clase agregada");
      res.redirect("/horario");
    } catch (err) {
      console.error(err);
      req.flash("error_msg", "No se pudo agregar la clase");
      res.redirect("/horario");
    }
  }
});

module.exports = router;
