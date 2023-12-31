const invModel = require("../models/inventory-model")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}
/* ************************
 * Constructs the header HTML basead if it logged in r not
 ************************** */
Util.getHeader = async function (req, res, next) {
   let logHeader = ""
   if(req.cookies.account_name){
    const account  = req.cookies.account_name
    logHeader = `<a title="Account Management" href="/account/">Welcome ${account}</a>`
    logHeader += `<a title="Logout" href="/account/logout"> | Logout</a>`
   }else{
    logHeader =`<a title="Click to log in" href="/account/login">My Account</a>`
   }
   return logHeader
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }

  /* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildDetailGrid = async function(data){
  let grid;
  if(data.length > 0){
    grid = `
    <h2>${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}</h2>
    <div class="container-details">
      <img alt="veicle-img" src="${data[0].inv_image}"/>
      <div>
        <div class="flex-inline">
          <h3>Description: </h3>
          <p>${data[0].inv_description}</p>
        </div>
        <div class="flex-inline">
          <h3>Inv. Color:</h3>
          <p>${data[0].inv_color}</p>
        </div>
        <div class="flex-inline">  
          <h3>Miles:</h3>
          <p>${data[0].inv_miles}</p>
        </div>
        <div class="flex-inline">  
          <h3>Price:</h3>
          <p>R$ ${data[0].inv_price}</p>
        </div>
      </div>
    </div>
    `
  }else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* ************************
 * Constructs the add inventory item form
 ************************** */
Util.getAddInvForm = async function (class_id) {
  let data = await invModel.getClassifications();
  let select = "<select id='classificationList' name='classification_id' value='<%= locals.classification_id %>'>"
  select += `<option value=0 >
  Select a option
</option>`
if(class_id){
  data.rows.forEach((row) =>{
    select += `<option value=${row.classification_id} ${row.classification_id == class_id ? "selected" : ''}>
    ${row.classification_name}
</option>`
  })
}else {
  data.rows.forEach((row) =>{
    select += `<option value=${row.classification_id}>
    ${row.classification_name}
</option>`
  })
}
  

  select +=" </select>"
    return select
}

  /* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

  /* ****************************************
 *  Check Login
 * ************************************ */
  Util.checkAccessRigths = (req, res, next) => {
    console.log(res.locals.loggedin)
    if (res.locals.loggedin) {
      const account = res.locals.accountData
      if(account.account_type == 'Employee' || account.account_type == 'Admin' ){
        next()
      } else{
       req.flash("notice", "You don't have the rigths to access this page")
      return res.redirect("/account/")
      }
    } else {
      req.flash("notice", "Please log in.")
      return res.redirect("/account/login")
    }
   }


    /* **************************************
* Build the accounts table for Admins HTML
* ************************************ */
Util.buildAccountsTableGrid = async function(){
  let data = await accountModel.getAllAccounts()
  if(Array.isArray(data)){
    if(data.length > 0){

      // Set up the table labels 
      let dataTable = `<table class='tableStyle'><thead>`; 
      dataTable += '<tr><th>User Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>'; 
      dataTable += '</thead>'; 
      // Set up the table body 
      dataTable += '<tbody>'; 
      // Iterate over all vehicles in the array and put each in a row 
      data.forEach(function (element) { 
        dataTable += `<tr><td>${element.account_firstname} ${element.account_lastname}</td>`; 
        dataTable += `<td><a href='/account/adminUpdate/${element.account_id}' title='Click to update'>Modify</a></td>`; 
        dataTable += `<td><a href='/account/adminDelete/${element.account_id}' title='Click to delete'>Delete</a></td></tr>`; 
      }) 
      dataTable += '</tbody></table>'; 
      return dataTable
    }else {
      return ""
    }
  }else{
    return ""
  }
}

module.exports = Util