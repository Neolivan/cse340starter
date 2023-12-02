const invModel = require("../models/inventory-model")
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
Util.getAddInvForm = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let select = "<select id='classification_id' name='classification_id'>"

  data.rows.forEach((row) =>{
    select += `<option value=${row.classification_id}>
    ${row.classification_name}
</option>`
  })

  select +=" </select>"
    return select
}

  /* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util