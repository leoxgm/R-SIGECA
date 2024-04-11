const router = require('express').Router();
const Licenciatura = require('../models/Licenciatura'); // Importa el modelo de Licenciatura
const { isAuthenticated } = require('../helpers/auth');

// Ruta para listar todas las licenciaturas
router.get('/licenciaturas', async (req, res) => {
  try {
    const licenciaturas = await Licenciatura.find().lean(); // Busca todas las licenciaturas en la base de datos
    res.render('licenciaturas/all-licenciaturas', { licenciaturas }); // Renderiza la vista con las licenciaturas
  } catch (error) {
    console.error('Hubo un error al obtener las licenciaturas', error);
    res.redirect('/');
  }
});

// Ruta para agregar una nueva licenciatura (formulario)
router.get('/licenciaturas/add', isAuthenticated, (req, res) => {
  res.render('licenciaturas/nueva-licenciatura'); // Renderiza el formulario para agregar una nueva licenciatura
});

// Ruta para procesar el formulario de agregar una nueva licenciatura
router.post('/licenciaturas/add', isAuthenticated, async (req, res) => {
  const { nombre, descripcion, creditos, duracion } = req.body;

  const errors = [];

  if (!nombre) {
    errors.push({ text: 'Ingresa el nombre de la licenciatura.' });
  }
  if (!creditos || isNaN(creditos)) {
    errors.push({ text: 'Ingresa un valor válido para los créditos.' });
  }
  if (!duracion || isNaN(duracion)) {
    errors.push({ text: 'Ingresa una duración válida.' });
  }

  if (errors.length > 0) {
    res.render('licenciaturas/nueva-licenciatura', {
      errors,
      nombre,
      descripcion,
      creditos,
      duracion
    });
  } else {
    const nuevaLicenciatura = new Licenciatura({
      nombre,
      descripcion,
      creditos,
      duracion
    });

    try {
      await nuevaLicenciatura.save(); // Guarda la nueva licenciatura en la base de datos
      req.flash('success_msg', 'Licenciatura registrada correctamente.');
      res.redirect('/licenciaturas');
    } catch (error) {
      console.error('Hubo un error al guardar la licenciatura', error);
      res.redirect('/licenciaturas');
    }
  }
});

// Ruta para editar una licenciatura (formulario)
router.get('/licenciaturas/edit/:id', isAuthenticated, async (req, res) => {
  try {
    const licenciatura = await Licenciatura.findById(req.params.id).lean(); // Busca la licenciatura por su ID
    res.render('licenciaturas/editar-licenciatura', { licenciatura }); // Renderiza el formulario de edición
  } catch (error) {
    console.error('Hubo un error al obtener la licenciatura', error);
    res.redirect('/licenciaturas');
  }
});

// Ruta para procesar el formulario de editar una licenciatura
router.put('/licenciaturas/edit/:id', isAuthenticated, async (req, res) => {
  const { nombre, descripcion, creditos, duracion } = req.body;

  const errors = [];

  if (!nombre) {
    errors.push({ text: 'Ingresa el nombre de la licenciatura.' });
  }
  if (!creditos || isNaN(creditos)) {
    errors.push({ text: 'Ingresa un valor válido para los créditos.' });
  }
  if (!duracion || isNaN(duracion)) {
    errors.push({ text: 'Ingresa una duración válida.' });
  }

  if (errors.length > 0) {
    res.render('licenciaturas/editar-licenciatura', {
      errors,
      nombre,
      descripcion,
      creditos,
      duracion
    });
  } else {
    try {
      await Licenciatura.findByIdAndUpdate(req.params.id, {
        nombre,
        descripcion,
        creditos,
        duracion
      }); // Actualiza la licenciatura en la base de datos
      req.flash('success_msg', 'Licenciatura actualizada correctamente.');
      res.redirect('/licenciaturas');
    } catch (error) {
      console.error('Hubo un error al actualizar la licenciatura', error);
      res.redirect('/licenciaturas');
    }
  }
});

// Ruta para eliminar una licenciatura
router.delete('/licenciaturas/delete/:id', isAuthenticated, async (req, res) => {
  try {
    await Licenciatura.findByIdAndDelete(req.params.id); // Busca y elimina la licenciatura por su ID
    req.flash('success_msg', 'Licenciatura eliminada correctamente.');
    res.redirect('/licenciaturas');
  } catch (error) {
    console.error('Hubo un error al eliminar la licenciatura', error);
    res.redirect('/licenciaturas');
  }
});

module.exports = router;
