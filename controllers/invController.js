const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}
/* ***************************
 *  Build inventory by details view
 * ************************** */
invCont.buildByCarId = async function (req, res ,next) {
  const car_id = req.params.carId;
  const data = await invModel.getInventoryByCarId(car_id);
  console.log("DATA",data )
  const grid = await utilities.buildDetailGrid(data)
  let nav = await utilities.getNav()
  res.render("./inventory/detail", {
    title: "Vehicles",
    nav,
    grid,
  })
}
/* ***************************
 *  Build Management view
 * ************************** */
invCont.buildManagementView = async function (req, res ,next) {

  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Management",
    nav,
  })
}
/* ***************************
 *  Build add-classification view
 * ************************** */
invCont.buildAddClassView = async function (req, res ,next) {

  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "ADD Classification",
    nav,
    errors : null
  })
}
/* ***************************
 *  Build add-inventory item view
 * ************************** */
invCont.buildAddInvView = async function (req, res ,next) {

  let grid = await utilities.getAddInvForm()
  let nav = await utilities.getNav()
  res.render("./inventory/add-inventory", {
    title: "ADD Inventory Item",
    nav,
    errors : null,
    grid
  })
}

/* ***************************
 *  Proccess to add-inventory 
 * ************************** */
invCont.registerInv = async function (req, res) {
  let nav = await utilities.getNav();
  let grid = await utilities.getAddInvForm()
  const basedirectory = "/images/vehicles/"
  const { inv_make,
    inv_model,
    inv_year,
    inv_miles,
    inv_color,
    inv_description,
    inv_price,
    inv_image,
    inv_thumbnail,
    classification_id } = req.body;
  const image = basedirectory + inv_image 
  const thumbnail = basedirectory + inv_thumbnail 
  

  const regResult = await invModel.registerInv(
    inv_make,
    inv_model,
    inv_year,
    inv_miles,
    inv_color,
    inv_description,
    inv_price,
    image,
    thumbnail,
    classification_id
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve registered a new item to inventory  ${inv_make} ${inv_model} - ${inv_year}!`
    );
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      errors: null
    });
  } else {
    req.flash("notice", "Sorry, the registration of new class has failed.");
    res.status(501).render("inventory/add-inventory", {
      title: "ADD Classification",
      nav,
      errors: null,
      grid
    });
  }
}

/* ***************************
 *  Proccess to add-classification 
 * ************************** */
invCont.registerClass = async function (req, res) {
  let nav = await utilities.getNav();
  const {
    classification_name
  } = req.body;
  

  const regResult = await invModel.registerClass(
    classification_name
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve registered a new class ${classification_name}!`
    );
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      errors: null
    });
  } else {
    req.flash("notice", "Sorry, the registration of new class has failed.");
    res.status(501).render("inventory/add-classification", {
      title: "ADD Classification",
      nav,
      errors: null
    });
  }
}


module.exports = invCont