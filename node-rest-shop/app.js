const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const productsRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

mongoose.connect('mongodb://Wilmer:' +
 process.env.MONGO_ATLAS_PW + 
 '@node-rest-api-shard-00-00-b7ava.mongodb.net:27017,node-rest-api-shard-00-01-b7ava.mongodb.net:27017,node-rest-api-shard-00-02-b7ava.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-api-shard-0&authSource=admin&retryWrites=true'
);
 
/*mongoose.connect('mongodb://Wilmer:' +
process.env.MONGO_ATLAS_PW +
'@node-rest-api-b7ava.mongodb.net/test?retryWrites=true'*/
/*,
{
    useMongoClient: true
}*/
//);

/*app.use((req, res, next)=> {
    res.status(200).json({
        message: 'It works!'
    });
});*/

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//protege el contenido web de fallas
app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
);
if(req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
}
next();
});



app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);
app.use("/user", userRoutes);

app.use((req, res, next) =>{
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{    
        message: error.message
    }
    });
});

module.exports = app;