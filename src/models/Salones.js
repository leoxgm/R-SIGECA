const mongoose = require('mongoose');
const {Schema} = mongoose;

const SalonSchema = new Schema({
    salon:{type:String,required:true},
    cupo:{type:String,required:true},
    responsable:{type:String}
});

module.exports = mongoose.model('Salon',SalonSchema);