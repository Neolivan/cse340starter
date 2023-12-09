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

//Route to go to add-inventory item page
router.get(
  "/addInventory",
  utilities.handleErrors(invController.buildAddInvView)
);

//Proccess the add-Inventory attempt
router.post(
  "/addInventory",
  managementValidate.addIvnRules(),
  managementValidate.checkinvData,
  utilities.handleErrors(invController.registerInv)
);

router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

//Edit inventory view
router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.editInventoryView)
);

//Proccess the edit-Inventory attempt
router.post(
  "/update",
  managementValidate.addIvnRules(),
  managementValidate.checkinvEditData,
  utilities.handleErrors(invController.updateInventory)
);

//Delete inventory view
router.get(
  "/delete/:inv_id",
  utilities.handleErrors(invController.deleteInventoryView)
);

//Process to delete inventory item attempt
router.post(
  "/delete",
  managementValidate.deleteIvnRules(),
  managementValidate.checkinvDeleteData,
  utilities.handleErrors(invController.deleteInventory)
);


module.exports = router;
