/* Importan Module require/declared here */
var express = require('express');
var app = express(); // Make Express Instance here
var path    = require("path");

//this both dependancy is use for pass message into router.
var session      = require('express-session');
var flash        = require('req-flash');

/* Node.js body parsing middleware.
 * Parse incoming request bodies in a middleware before your handlers, 
 * available under the req.body property. 
 */
var bodyParser = require('body-parser');


/*
 * All Middleware configuration here
 * App.use();
 */
// Add headers 
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, x-access-token, x-origin');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Expose-Headers', 'totalRecords');
    next();
});
// Parse requests of content-type : application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse requests of content-type - application/json
app.use(bodyParser.json())

//set default ejs engine 
app.set('view engine', 'ejs');


//configuration sessions
app.use(session({ secret: 'Nirav2515' ,
    cookie  : { maxAge  : new Date(Date.now() + (60 * 1000 * 30)) }
  }));

// pass message into routers.
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

/*
 *  Mongodb Database related Configuration here.
 *  Mongo Import,Connection,Promises.
 */
//Configure to the database
const dbConfig = require('./app/config/config.js');     //include database file.
const mongoose = require('mongoose');

//mongoose default promises use here.
mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.mongodbUrl, {
    useNewUrlParser: true,
}).then(() => {
    console.log("Successfully connected to the database");   
    console.log("Mongodb Connection Established : "+mongoose.connection.host + ":"+mongoose.connection.port)
 
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});


/*
 *  Default Route define here...
 *  return simple text here.
*/
app.get('/', (req,res) => {
    console.log("session Expired ::",(req.session.cookie.maxAge /1000));
    res.redirect('login');
    // direct html load below method
    // res.sendFile(path.join(__dirname+'/app/views/login.html')); 
});

// Require routes
require('./app/routes/routes.js')(app); //here pass express instance in routes file.


/* Application Listen for Request. */
app.listen(3000,function(){
    //console clear while function is called.
    console.clear();
    console.log("Your Application is Started on 3000 Port : \n URL : http://localhost:3000");
});
