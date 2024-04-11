const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    departamento:{type:String,required:true},
    num_economic:{type:String,required:true},
    telefono:{type:String,required:true},
    horario:{type:String, required:true},
    division:{type:String, required:true}
});

UserSchema.methods.encryptPassword = async (password)=>{
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password,salt);
    return hash;
};

UserSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password,this.password);
};

module.exports = mongoose.model('User',UserSchema);
