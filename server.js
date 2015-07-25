// server.js

// BASE SETUP
// ==========================================

// Load packages
var cfg        = require('./config');
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

if (cfg.server_mode.toUpperCase() === "DEV") {
    var morgan = require('morgan');
    app.use(morgan('dev'));   
}

// configure app to use bodyParser()
// this will let us get the data from a POST request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || cfg.server_port || 80; // setup a port

// Database connection setup
var mongoose = require('mongoose');
    mongoose.connect(cfg.mongodb);

var kidsRouter = require('./app/routes/kids');

app.use("/api", kidsRouter);


// ROUTES FOR THE API
// ==========================================

// START UP THE server
// ===========================================
app.listen(port);
console.log("Server Started on port", port);