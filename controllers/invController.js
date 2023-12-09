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
  const classificationSelect = await utilities.getAddInvForm()
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Management",
    nav,
    options : classificationSelect
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByCarId(inv_id)
  const data = itemData[0]
  data.inv_thumbnail = `${data.inv_thumbnail}`.replace("/images/vehicles/", "")
  data.inv_image = `${data.inv_image}`.replace("/images/vehicles/", "")
  const itemName = `${data.inv_make} ${data.inv_model}`
  const classificationSelect = await utilities.getAddInvForm(data.classification_id)


  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    grid: classificationSelect,
    errors: null,
    inv_id: data.inv_id,
    inv_make: data.inv_make,
    inv_model: data.inv_model,
    inv_year: data.inv_year,
    inv_description: data.inv_description,
    inv_image: data.inv_image,
    inv_thumbnail: data.inv_thumbnail,
    inv_price: data.inv_price,
    inv_miles: data.inv_miles,
    inv_color: data.inv_color,
    classification_id: data.classification_id
  })
}
/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByCarId(inv_id)
  const data = itemData[0]
  const itemName = `${data.inv_make} ${data.inv_model}`


  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: data.inv_id,
    inv_make: data.inv_make,
    inv_model: data.inv_model,
    inv_year: data.inv_year,
    inv_price: data.inv_price,
  })
}


/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const defaultDir = "/images/vehicles/"
  const cor_image = `${defaultDir}${inv_image}`
  const cor_thumb = `${defaultDir}${inv_thumbnail}`
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    cor_image,
    cor_thumb,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/management")
  } else {
    const classificationSelect = await utilities.getAddInvForm(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    grid: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}


/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_price,
    inv_year,
  } = req.body
  const updateResult = await invModel.deleteInventory(
    inv_id
  )

  if (updateResult) {
    const itemName = inv_make + " " + inv_model
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/management")
  } else {
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    })
  }
}

module.exports = invCont