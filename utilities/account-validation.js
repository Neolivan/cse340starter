const utilities = require(".");
const { body, validationResult } = require("express-validator");
const accountModel = require("../models/account-model");
const validate = {};

/*  **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};
/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkLogData = async (req, res, next) => {
  const { account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const account = await utilities.getHeader(req, res);
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
      account,
    });
    return;
  }
  next();
};
/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (emailExists) {
          throw new Error("Email exists. Please log in or use different email");
        }
      }),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const account = await utilities.getHeader(req, res);

    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      account,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Update Info Data Validation Rules
 * ********************************* */
validate.updateInfoRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),
  ];
};

/*  **********************************
 *  Update Info Data Validation Rules
 * ********************************* */
validate.adminUpdateInfoRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),
    // valid type is required and need already exist in the DB
    body("account_type")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a valid type Client, Employee or Admin."),
  ];
};


/*  **********************************
 *  Update Password Data Validation Rules
 * ********************************* */
validate.updatePassRules = () => {
  return [
     // password is required and must be strong password
     body("account_password")
     .trim()
     .isStrongPassword({
       minLength: 12,
       minLowercase: 1,
       minUppercase: 1,
       minNumbers: 1,
       minSymbols: 1,
     })
     .withMessage("Password does not meet requirements."),
  ];
};

/* ******************************
 * Check data and return errors or continue to update infos
 * ***************************** */
validate.checkUpInfoData = async (req, res, next) => {
  const { account_email, account_firstname, account_lastname, account_id } =
    req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const account = await utilities.getHeader(req, res);
    res.render("account/update", {
      errors,
      title: "Account Update",
      nav,
      account_email,
      account,
      account_firstname,
      account_lastname,
      account_id,
    });
    return;
  }
  next();
};
/* ******************************
 * Check data and return errors or continue to update infos
 * ***************************** */
validate.checkUpAdmInfoData = async (req, res, next) => {
  const { account_email, account_firstname, account_lastname, account_id, account_type } =
    req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const account = await utilities.getHeader(req, res);
    res.render("account/adminUpdate", {
      errors,
      title: "Account Update",
      nav,
      account_email,
      account,
      account_firstname,
      account_lastname,
      account_id,
      account_type
    });
    return;
  }
  next();
};
/* ******************************
 * Check data and return errors or continue to update password
 * ***************************** */
validate.checkUpPassData = async (req, res, next) => {
  const { account_password, account_id } =
    req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const account = await utilities.getHeader(req, res);
    res.render("account/update", {
      errors,
      title: "Account Update",
      nav,
      account,
      account_id,
    });
    return;
  }
  next();
};

/* ******************************
 * Check data and return errors or continue to update password
 * ***************************** */
validate.checkUpAdminPassData = async (req, res, next) => {
  const { account_password, account_id } =
    req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const account = await utilities.getHeader(req, res);
    res.render("account/adminUpdate", {
      errors,
      title: "Account Update",
      nav,
      account,
      account_id,
    });
    return;
  }
  next();
};

/* ******************************
 * Check data and return errors or continue to delete account
 * ***************************** */
validate.checkUpAdminDeleteData = async (req, res, next) => {
  const { account_email,
    account_firstname,
    account_lastname,
    account_id,
    account_type } =
    req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const account = await utilities.getHeader(req, res);
    res.render("account/adminDelete", {
      errors,
      title: "Account Delete Confirmation",
      nav,
      account,
      account_email,
      account,
      account_firstname,
      account_lastname,
      account_id,
      account_type
    });
    return;
  }
  next();
};

module.exports = validate;
