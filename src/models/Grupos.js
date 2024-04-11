const mongoose = require('mongoose');
const {Schema} = mongoose;

const GrupoSchema = new Schema({
    grupo:{type:String,required:true},
    descripcion:{type:String},
    division:{type:String,required:true},
    licenciatura:{type:String},
    uea:{type:String,required:true},
    departamento:{type:String,required:true},
    salon:{type:String,required:true},
    modalidad: {
        type: String,
        enum: ["Presencial", "Semi-Presencial", "Virtual", "Movilidad"],
        required: true
      }
});

module.exports = mongoose.model('Grupos',GrupoSchema);