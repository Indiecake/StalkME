const app = require('./app');
const port = 3000;

const mongoose = require('mongoose');
const uri = 'mongodb://localhost/stalkMe';


//conexion base de datos
mongoose.Promise - global.Promise;
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(db => {
        console.log('db conected');
        app.listen(port, () => {
            console.log('servidor corriendo');
            
        });
    })
    .catch(err => console.log(err));