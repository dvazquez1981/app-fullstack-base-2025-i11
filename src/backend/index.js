//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;

var express = require('express');
var app     = express();



// to parse application/json
app.use(express.json()); 
const rutasDevice = require( './rutas/routesDevice.js')
//ruta
app.use(rutasDevice);
// to serve static files
app.use(express.static('/home/node/app/static/'));

app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================
