const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcryptjs');

const DirectorSchema = new Schema({
    director:{type:String,required:true},
    password:{type:String,required:true},
    division:{type:String,required:true},
    departamento:{type:String,required:true},
    correo:{type:String,required:true}
});

DirectorSchema.methods.encryptPassword = async (password)=>{
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password,salt);
    return hash;
};

DirectorSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password,this.password);
};

module.exports = mongoose.model('Director', DirectorSchema);