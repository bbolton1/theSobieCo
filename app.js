// 🪣@OmarVCRZ 4.25.2025 iss#1
require('dotenv').config(); // .env loading


const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const session = require('express-session');
const csurf = require('csurf');
const path = require('path');

// 🪣@OmarVCRZ 4.25.2025 iss#1
const { MongoClient } = require('mongodb')

// 🪣@OmarVCRZ 4.25.2025 iss#1
const HomeController = require('./controllers/HomeController');
const RegisterController = require('./controllers/RegisterController');
const AuthController = require('./controllers/AuthController');

const app = express();

app.use('/documents', express.static(__dirname + '/public/documents'));
app.use('/scripts', express.static(__dirname + '/public/scripts'));
app.use('/styles', express.static(__dirname + '/public/styles'));
// 🪣@OmarVCRZ 4.25.2025 iss#1
app.use(express.static(path.join(__dirname, 'public')));

// Body Parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// 🪣@OmarVCRZ 4.25.2025 iss#1 (View Engine Setup)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// CORS Headers
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

// 🪣@OmarVCRZ 4.25.2025 iss#1 (Session Setup)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// 🪣@OmarVCRZ 4.25.2025 iss#1 (CSRF Protection)
app.use(csurf());
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// 🪣@OmarVCRZ 4.25.2025 iss#1 (MongoDB Connection)
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Connection Failure:", err);
  }
}

connectDB();

// 🪣@OmarVCRZ 4.25.2025 iss#1 (Load Routes AFTER session + csrf middleware) 
app.use('/', require('./controllers/HomeController'));
app.use('/register', require('./controllers/RegisterController'));
// 🪣@OmarVCRZ 4.25.2025 iss#1 (attaches the routes to the server)
app.use('/', require('./controllers/AuthController'));

// 🎓 brittneydaniel 4.26.2025 iss #24 LAYOUT#5
//Adding functionality to run in render
const server = app.listen(process.env.PORT || 3000, function() {
  const host = server.address().address;
  const port = server.address().port;

  console.log("Server is running on http://%s:%s", host, port);
});
