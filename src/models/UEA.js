const mongoose = require('mongoose');
const {Schema} = mongoose;

const UEASchema = new Schema({
    uea:{type:String,required:true},
    descripcion:{type:String,required:false},
    division:{type:String,required:false},
    clave:{type:String,required:true},
    tronco: {
                type:String,
                enum: [
                        "Tronco Basico de Carrera", "Tronco General Divisional", "Tronco Específico de Carrera",
                        "Tronco Interdivisional de Formación Interdisciplanaria", "Tronco de Integración",
                        "Optativa Divisional"], 
                required:true
            }
});

module.exports = mongoose.model('UEA',UEASchema);