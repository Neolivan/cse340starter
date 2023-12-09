const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  const account = await utilities.getHeader(req,res)
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  const account = await utilities.getHeader(req,res)
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    account
  });
}
/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const account = await utilities.getHeader(req,res)
  const {
    account_email,
    account_firstname,
    account_lastname,
    account_password,
  } = req.body;
  
  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      account
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const account = await utilities.getHeader(req,res)
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
    account
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
   res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
   res.cookie("account_name", accountData.account_firstname, { httpOnly: true, maxAge: 3600 * 1000 })
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

 /* ****************************************
 *  Deliver login success view
 * *************************************** */
async function buildAccountManagementView(req, res, next) {
  let nav = await utilities.getNav();
  const account = await utilities.getHeader(req,res)
  const accountDetails = res.locals.accountData
  let grid =""
  grid += `<h2>Welcome ${accountDetails.account_firstname}</h2>`
  if(accountDetails.account_type == 'Employee' || accountDetails.account_type == 'Admin' ){
    grid += `<h3>Inventory Management</h3><p><a href="/inv/management" class="styled-button">Inventory Management</a></p>`
  }
    grid += `<a href='/account/update/${accountDetails.account_id}' class="styled-button">Update account information</a>`


  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    account,
    grid
  });
}


module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagementView };
