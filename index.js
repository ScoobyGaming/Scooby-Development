"use strict";

//set The GLOBALS;
var bootstrap = require('./bootstrap.js');
bootstrap.init();

var express = require('express');
var app = express();

var routesApi = require('./app/routes-api');
var routesWeb = require('./app/routes-web');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('./lib/cors');
var sessionFactory = require('./lib/sessionFactory');
var expressLayouts = require('express-ejs-layouts');

var launchApp = function() {
    //Starts the server;
    app.use(express.static(__dirname));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(sessionFactory());
    app.use(cors);

    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.set('layout', 'layouts/html_app');
    app.set('port', config.server.port);
    app.use(expressLayouts);

    routesWeb.setup(app);
    routesApi.setup(app);

    app.listen(app.get('port'), function() {
        logger.info('Loaded configuration: \n' + getUtil.inspect(config));
        logger.info('Server started in ' + config.environment + ' mode.');
        logger.info('Listening on port: ' + app.get('port'));
    });
}

if (config.environment === 'production') {
    logger.warn('Creating the build, please wait...');
    var grunt = require("grunt");
    grunt.cli({
        gruntfile: __dirname + "/Gruntfile.js",
        extra: {
            key: "run"
        }
    }, function() {
        //callback;
        launchApp();
    });
} else {
    logger.info('Bypassing build we are in ' + config.environment + ' please wait...');
    launchApp();
}
