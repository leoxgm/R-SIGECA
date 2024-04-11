const helpers = {};
/*request (req): Es la peticion. respuesta (res). Acceso (next) */
helpers.isAuthenticated = (req,res,next) => {
    if(req.isAuthenticated()){
        return next();
    }
    //Tarjeta 
    req.flash('error_msg',"No autorizado");
    res.redirect('/');
};

module.exports = helpers;