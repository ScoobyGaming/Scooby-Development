 "use strict"; //Defines that JavaScript code should be executed in "strict mode".

 var authorization = require('express-authorization');

 // setup permission
 var isAuthorizedAdmin = authorization.ensureRequest.isPermitted('admin:*');
 var isAuthorized = authorization.ensureRequest.isPermitted('session:active');

 var express = require('express');
 var routerWeb = express.Router();

//routers, so we can see them easier;
 var wr = {
     'login':           '/login',
     'dashboard':       '/dashboard',
     'profile':         '/profile',
     'changepassword':  '/password',
     'logout':          '/logout',
     'superadmin':      '/admin'
 }

 routerWeb.use(function timeLog(req, res, next) {
     console.log('Time: ', Date.now());
     next();
 });

 routerWeb.get('/', isAuthorized, function(req, res) {
     //TODO: Call the api for stuff we need for page
     res.render('pages/dashboard', {});
 });
 routerWeb.get(wr['dashboard'], isAuthorized, function(req, res) {
     res.render('pages/dashboard', {});
 });
 routerWeb.get(wr['profile'], isAuthorized, function(req, res) {
     res.render('pages/profile', {});
 });
 routerWeb.get(wr['superadmin'], isAuthorizedAdmin, function(req, res) {
     res.render('pages/superadmin', {});
 });
 routerWeb.get('/*', isAuthorized, function(req, res) {
     res.render('pages/badURL', {});
 });
 routerWeb.get(wr['changepassword'], isAuthorized, function(req, res) {
     res.render('pages/password', {});
 });
 routerWeb.get(wr['login'], function(req, res) {
     // TODO: need to determine if we are authorzed before sending them to login
     if(req.session.user){
          res.redirect('/dashboard');
     }else{
          res.render('pages/login', {});
     }
 });
 routerWeb.get(wr['logout'], function(req, res) {
     req.session.destroy();
     res.redirect('/');
 });


 module.exports = routerWeb;
