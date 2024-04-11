const req = require('express/lib/request');

const router = require('express').Router();

const Departamento = require('../models/Departamento');
const Director = require("../models/Director");

router.get('/',async (req,res)=>{
    try{
    const departamento = await Departamento.find({
        departamento: req.user.departamento
      });
      const director = await Director.find({director: req.user.director});
      res.render('index',{departamento,director});
    }catch(err){
        const departamentos = await Departamento.find().lean();
        const directores = await Director.find().lean();
        res.render('index',{departamentos,directores});
    }
});

router.get('/about',(req,res)=>{
    res.render('about');
});
module.exports = router;
