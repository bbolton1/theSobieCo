const express = require("express");
const router = express.Router();
const mongoClient = require("../services/MongoClientService");
const APIResponse = require("../DTOs/APIResponse");


router.use(function(req, res, next) { next() });

// 🐝@SkySaunders 4.29.2025 iss #15 
router.get('/index_skyler', function(req, res, next) {
    res.render('index_skyler', { pageTitle: 'SOBIE'});
}); 

// 🐝@candice 4.29.2025 iss #10 
router.get('/hotel', function(req, res, next) {
  res.render('hotel', { pageTitle: 'SOBIE'});
}); 

router.use(function (req, res, next) {
  next();
});

router.get('/', function(req, res, next) {
    res.render('index', { pageTitle: 'SOBIE'});
});

//🪣@lukehester 4.25.2025 iss #4
//We added this endpoint to access our homepage
router.get('/', function(req, res, next) {
    res.render('garrett-index', { pageTitle: 'SOBIE'});
});

//🪣@lukehester 4.25.2025 iss #4
//We added this endpoint to access our registration page
router.get('/register', (req, res) => {
    res.render('lukeh-registration');
});

//🪣@lukehester 4.25.2025 iss #4
//We added this endpoint to access our homepage by clicking the SOBIE Logo
router.get('/homepage', (req, res) => {
    res.render('garrett-index');
});

//🪣@lukehester 4.25.2025 iss #4
//We added this endpoint to access our login page
router.get('/login', (req, res) => {
    res.render('login-lukeh');
});

//🪣@lukehester 4.25.2025 iss #4
//We added this endpoint to access our "create new account" page
router.get('/createaccount', (req, res) => {
    res.render('create-account-lukeh');
    //res.render('index', { pageTitle: 'Home Page'});
    res.redirect('/'); 
});

router.get('/allison_home', function(req, res, next) {
    res.render('allisonl_home', { pageTitle: 'Home Page'});
});

// 🎓 brittneydaniel 4.26.2025 iss #24 LAYOUT#5
router.get('/brittany-about', function(req, res, next) {
    res.render('bdaniel', {pageTitle: 'About Page'});

});

router.get("/home/latestConferenceInfo", async function (req, res, next) {
  try {
    const conferenceCollection = mongoClient
      .db("sobie-db")
      .collection("conferences");

    const latestConferenceData = await conferenceCollection
      .find({})
      .sort({ year: -1 })
      .limit(1)
      .toArray();

    if (latestConferenceData.length === 0) {
      const notFoundRes = new APIResponse();
      return res
        .status(404)
        .json(notFoundRes.error("Failure! No conference record found."));
    }

    const successRes = new APIResponse();
    return res.json(
      successRes.success(
        "Success! This is the target conference record.",
        latestConferenceData[0]
      )
    );
  } catch (error) {
    console.error("Error fetching conference data:", error);
    const errorRes = new APIResponse();
    return res.status(500).json(errorRes.error("Internal server error."));
  }
});

module.exports = router;
