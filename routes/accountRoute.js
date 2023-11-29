// Needed Resources 
const express = require("express")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')
const router = new express.Router() 
const {buildLogin, buildRegister,registerAccount} = require("../controllers/acountController")
// Route to build login view
router.get("/login", utilities.handleErrors(buildLogin));
// Route to build registration view
router.get("/register", utilities.handleErrors(buildRegister));
//Route to register a new user
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(registerAccount)
  )


module.exports = router;