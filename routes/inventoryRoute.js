// Needed Resources 
const express = require("express")
const utilities = require("../utilities")
const router = new express.Router() 
const invController = require("../controllers/invController")
// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by classification detail
router.get("/detail/:carId", utilities.handleErrors(invController.buildByCarId))


module.exports = router;