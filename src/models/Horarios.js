const mongoose = require('mongoose');
const {Schema} = mongoose;

const HorarioSchema = new Schema({
    trimestre:{type:String,required:true},
    clase:{type:Array},
    division:{type:String,required:true}
});

module.exports = mongoose.model('Horario',HorarioSchema);