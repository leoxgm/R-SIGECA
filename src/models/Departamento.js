const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcryptjs');

const DepartamentoSchema = new Schema({
    departamento:{type:String,required:true},
    password:{type:String,required:true},
    division:{type:String,required:true}
});

DepartamentoSchema.methods.encryptPassword = async (password)=>{
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password,salt);
    return hash;
};

DepartamentoSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password,this.password);
};

module.exports = mongoose.model('Departamento',DepartamentoSchema);