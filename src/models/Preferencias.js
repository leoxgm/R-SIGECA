const mongoose = require('mongoose');
const {Schema} = mongoose;

const PreferenciaSchema = new Schema({
    num_economic:{type:String,required:true},
    preferencias:{type:Array,required:true,default:[]},
});

module.exports = mongoose.model('preferencia',PreferenciaSchema);