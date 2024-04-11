/*archivo principal de toda la aplicación*/
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
//inicializaciones
const app = express();
require('./database');
require('./config/passport');
/*****************************************
************CONFIGURACIONES***************
******************************************/
//PUERTO
app.set('port',3000);
app.set('views', path.join(__dirname,'views'));
app.engine('.hbs',exphbs.engine({
    defaultLayout: 'main' ,
    helpers: {
        eq: (a, b) => a == b,
    },
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs'
}));
app.set('view engine','.hbs');
//middlewares
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
//variables globales
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});
//routes
app.use(require('./routes/index'));
app.use(require('./routes/users'));
app.use(require('./routes/profesores'));
app.use(require('./routes/misPrestamos'));
app.use(require('./routes/dashboard'));
app.use(require('./routes/horarios'));
app.use(require('./routes/salones'));
app.use(require('./routes/grupos'));
app.use(require('./routes/licenciatura')); 
app.use(require('./routes/uea'));
//se agrega la ruta de licenciatura para que funcione el crud 
//estaticos
app.use(express.static(path.join(__dirname,'public')));
//inicializar servidor
app.listen(app.get('port'), () => {
    console.log('Servidor en Puerto:',app.get('port'))
});
