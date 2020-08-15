var express = require('express');
var cors = require('cors')

var app = express()
app.use(cors());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'accept, authorization, content-type, x-requested-with');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.setHeader('Access-Control-Allow-Origin','*');
    next();
});
app.options('*', cors());
app.use(express.static(__dirname + '/webapp')); //__dir and not _dir
var port = 8900; // you can use any port
app.listen(port);
console.log('server on' + port);