const mongoose = require('mongoose');
/* conexion a la base de datos*/
mongoose.connect('mongodb://127.0.0.1:27017/salab', {
})
  .then(db => console.log('Conectado a base de datos'))
  .catch(err => console.log(err));