const express = require('express');
const path = require('path');//module de nodejs para abrir una ruta de html
const app = express();
const cors = require('cors');
//const indexRoutes = require('./routes/index');
const tasksRoutes = require('./routes/tasks');

//settings configuracion del servidor
app.set('views', path.join(__dirname,'views'));//abe el html
app.set('port', process.env.PORT || 3000);
app.engine('html', require('ejs').renderFile);//poder renderizar html del lado del servidor
app.set('view engine', 'ejs');//para configurar el motor de plantillas


//middlewares funciones que se ejecutan antes de recibir la informacion que le esta enviando el navegador o los clientes
app.use(cors());
app.use(express.json());//ya trae por defecto el body parser depediendo la version
app.use(express.urlencoded({extended: false}));//para poder recibir datos por la url

// routes
//app.use('/', indexRoutes);
app.use('/api', tasksRoutes);

// static files
app.use(express.static(path.join(__dirname, 'dist')));//todo el codigo de navegador html/css generado desde angular

// start the server
app.listen(app.get('port'), () => {
    console.log('server on port ', app.get('port'));
}); 