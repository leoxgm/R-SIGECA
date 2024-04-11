// Importa la biblioteca Mongoose
const mongoose = require('mongoose');

// Extrae el constructor de esquema (Schema) de Mongoose
const { Schema } = mongoose;

// Define un nuevo esquema llamado LicenciaturaSchema
const LicenciaturaSchema = new Schema({
    // Campo 'nombre' de tipo String, requerido (se debe proporcionar)
   // El nombre de una licenciatura es una cadena de caracteres
    nombre: {
        type: String,
        required: true,
    },
    // Campo 'descripcion' de tipo String, que es opcional (no requerido)
    descripcion: {
        type: String,
        required: false,
    },
    // Campo 'creditos' de tipo Number, es requerido
    // Estos podrian ser una cadena (String) no es necesario que sean number 
    // El número de créditos de una licenciatura es un valor numérico entero
    creditos: {
        type: Number,
        required: true,
    },
    // Campo 'duracion' de tipo Number, requerido
    // Estos podrian ser una cadena (String) no es necesario que sean number 
    // La duración de una licenciatura es un valor numérico entero  
    duracion: {
        type: Number,
        required: true,
    },
    // Campo 'fechaCreacion' de tipo Date, con valor predeterminado (default) de la fecha actual
    // La fecha de creación de una licenciatura es un valor de fecha y hora (timestamp)             
    fechaCreacion: {
        type: Date,
        default: Date.now,
    },
});

// Exporta el modelo 'Licenciatura' basado en el esquema 'LicenciaturaSchema'
module.exports = mongoose.model('Licenciatura', LicenciaturaSchema);
