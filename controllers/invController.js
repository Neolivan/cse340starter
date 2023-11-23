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
    title: " vehicles",
    nav,
    grid,
  })
}


module.exports = invCont