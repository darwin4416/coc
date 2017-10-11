var express = require('express');

var bodyParser = require('body-parser');
var port = process.env.PORT || 4416;
const fs = require('fs');
const Guid = require('guid');
const Mustache = require('mustache');
var bcrypt = require('bcrypt');
const Request = require('request');
const Querystring = require('querystring');
var exphbs = require('express-handlebars');
var path = require('path');
const mongo = require('mongodb');
const mongoose = require('mongoose');
var csrf_guid = Guid.raw();
var User = require('./models/usersModel');
var app = express();
var phyCount = 0;
var mathCount = 0;
var engCount = 0;
var bioCount = 0;


mongoose.connect('mongodb://localhost/coach', function (conn) {
  console.log("DB is connected");
});
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({ defaultLayout: 'layouts' }));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/user/register', function (req, res) {           //user register
  res.render('register');
});
app.get('/user/login', function (req, res) {              //user login
  res.render('login');
});
app.get('/user/assignment', function (req, res) {              //upload assignment
  res.render('uploadassignment');
});
app.get('/admin/dashboard', function (req, res) {
  res.render('admin-dashboard');                              //admin dashbord
});
/*all data handling urls*/
app.get('/get-userdata',function(req,res){
  
  User.find({},function(err,userdata){
    if(err)
    {
      console.log(err);
    }
    else
    {
      res.send(userdata);
    }
   
  })
});
app.post('/user/register', function (req, res) {                    //user post request 
  console.log(req.body);
  var name = req.body.name;
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var confPassword = req.body.conf_password;
  if(password !== confPassword)
  {
    res.send('password does not match');
    return false;
  }

  var newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,

  });
  newUser.save(function (err, User) {
    if (err)
      res.send(err);
    else
      res.send('done');

  });
});
app.post('/user/login', function (req, res) {               //user login 
  var username = req.body.username;
  var password = req.body.password;
  User.findOne({ "username": username, "password": password }, function (err, user) {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
    if (!user) {
      res.status(404).send();
    }
    else {
      res.render('uploadassignment');

    }
  });
});
app.post('/handle-assignments', function (req, res) {       //handle assignment submission
  console.log(req.body);
  var username = req.body.username;
  var subjectName = req.body.subjects;
  var username = req.body.username;
  var serviceType = req.body.typeofService;
  var assignmentFile = req.body.assignment;
  
  if (subjectName == "Physics") {
    phyCount++;
    var orderId = "CoC_" + "A_" + "PHY"+"_"+ phyCount;
  }
  if (subjectName == "Math") {
    mathCount++;
    var orderId = "CoC_" + "A_" + "MATH" +"_"+ mathCount;
  }
  if (subjectName == "Bio") {
    bioCount++;
    var orderId = "CoC_" + "A_" + "BIO" +"_"+ bioCount;
  }
  if (subjectName == "English") {
    engCount++;
    var orderId = "CoC_" + "A_" + "ENG" +"_"+ engCount;
  }
  User.findOne({ "username": username }, function (err, user) {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
    else {
      User.findByIdAndUpdate(user._id, { $push: { orderId: orderId } }, {safe: true, upsert: true, new: true },
        function (err, data) {
          console.log(data);
        }
      );
      res.send(orderId);
    }
  });
});
app.listen(port, function () {
  console.log("Its running on port 4416");
});
