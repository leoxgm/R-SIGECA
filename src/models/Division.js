const mongoose = require('mongoose');
const {Schema} = mongoose;

const DivisionSchema = new Schema({
    name:{type:String,required:true}
});

module.exports = mongoose.model('Division',DivisionSchema);