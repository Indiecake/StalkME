const express = require("express");
const bodyParser = require("body-parser");

const app = express();

//cargar rutas
const userRoutes = require('./routes/userRoutes');
const followerRoutes = require('./routes/followerRoutes');
const postRoutes = require('./routes/postRoutes');
const messageRoutes = require('./routes/messageRoutes');
//middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
});
//rutas
app.use('/api', userRoutes);
app.use('/api', followerRoutes);
app.use('/api', postRoutes);
app.use('/api', messageRoutes);
//Exportar

module.exports = app;