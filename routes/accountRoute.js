// Needed Resources 
const express = require("express")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')
const router = new express.Router() 
const {buildLogin, buildRegister,registerAccount, buildAccountManagementView, accountLogin, buildAccountUpdateView, updateInfo, updatePass, logoutProccess, buildAccountUpdateAdminView, adminUpdateInfo, updateAdminPass, buildAccountDeleteAdminView, deleteAccount} = require("../controllers/acountController")
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
  // Process the login attempt
  router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLogData,
    utilities.handleErrors(accountLogin)
  )
  
  //success login page
  router.get("/", utilities.checkLogin,utilities.handleErrors(buildAccountManagementView));
  
  //update page
  router.get("/update/:account_id", utilities.checkLogin,utilities.handleErrors(buildAccountUpdateView));
  
  // Process the updateInfo attempt
  router.post(
    "/updateInfo",
    regValidate.updateInfoRules(),
    regValidate.checkUpInfoData,
    utilities.handleErrors(updateInfo)
  )
  // Process the updatePass attempt
  router.post(
    "/updatePass",
    regValidate.updatePassRules(),
    regValidate.checkUpPassData,
    utilities.handleErrors(updatePass)
  )


  //success login page
  router.get("/logout", utilities.checkLogin,utilities.handleErrors(logoutProccess));

  //Admin update account page
  router.get("/adminUpdate/:account_id", utilities.checkLogin,utilities.handleErrors(buildAccountUpdateAdminView));
  //Admin delete account page
  router.get("/adminDelete/:account_id", utilities.checkLogin,utilities.handleErrors(buildAccountDeleteAdminView));

    // Process the admin update infos attempt
  router.post(
    "/adminUpdate",
    regValidate.adminUpdateInfoRules(),
    regValidate.checkUpAdmInfoData,
    utilities.handleErrors(adminUpdateInfo)
  )

    // Process the updatePass attempt
    router.post(
      "/adminUpdatePass",
      regValidate.updatePassRules(),
      regValidate.checkUpAdminPassData,
      utilities.handleErrors(updateAdminPass)
    )

    // Process the updatePass attempt
    router.post(
      "/adminDelete",
      regValidate.updateInfoRules(),
      regValidate.checkUpAdminDeleteData,
      utilities.handleErrors(deleteAccount)
    )

module.exports = router;