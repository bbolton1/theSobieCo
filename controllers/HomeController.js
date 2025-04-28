const express = require("express");
const router = express.Router();
const mongoClient = require("../services/MongoClientService");
const APIResponse = require("../DTOs/APIResponse");

router.use(function (req, res, next) {
  next();
});

router.get("/", function (req, res, next) {
  res.render("index", { pageTitle: "SOBIE" });
});

router.get("/home", function (req, res, next) {
  res.render("home");
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
