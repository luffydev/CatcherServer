var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var lFS = require('fs');
var http = require('http');
var https = require('https');
require('./config');
var privateKey  = lFS.readFileSync('sslcert/server.key', 'utf8');
var certificate = lFS.readFileSync('sslcert/server.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};

global.app = express();
global.database = require('./SDK/PgHelper/PgHelper');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

database.connect(config.Postgres.host, config.Postgres.user, config.Postgres.password, config.Postgres.database, config.Postgres.port);

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use('route/*', function(pRequest, pRes, pNext)
{

});

app.get('/route/test', function(pRequest, pRes)
{
  pRes.end(JSON.stringify({message : 'Welcome'}));
});


lFS.readdir(__dirname + '/routes', (err, files) => {
    files.forEach(pFile => {
        console.log(pFile);
        require(__dirname + '/routes/' + pFile);
    });
});

/*app.listen(4433, function()
{
  console.log("Server started on port : 4433");

});*/

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(4433);
httpsServer.listen(4434);
/*
pool.query('SELECT NOW()', [], (err, res) => {
    console.log(res.rows);
    pool.end()
});

*/

module.exports = app;
