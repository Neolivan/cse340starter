// Needed Resources
const express = require("express");
const utilities = require("../utilities");
const managementValidate = require("../utilities/management-validation");
const router = new express.Router();
const invController = require("../controllers/invController");
// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to build inventory by classification detail
router.get(
  "/detail/:carId",
  utilities.handleErrors(invController.buildByCarId)
);

//Route to go to management page
router.get(
  "/management",
  utilities.handleErrors(invController.buildManagementView)
);

//Route to go to add-classification page
router.get(
  "/addClassification",
  utilities.handleErrors(invController.buildAddClassView)
);

//Proccess the add-classification attempt
router.post(
  "/addClassification",
  managementValidate.addClassRules(),
  managementValidate.checkClassData,
  utilities.handleErrors(invController.registerClass)
);



module.exports = router;
