const utilities = require(".");
const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model");
const validate = {};

validate.addClassRules = () => {
  return [
    // valid classification_name is required and cannot already exist in the DB
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("A valid Classification is required.")
      .custom(async (classification_name) => {
        const classExists = await invModel.checkExistingClass(
          classification_name
        );
        if (classExists) {
          throw new Error(
            "Classification already exists. Please enter a different classification"
          );
        }
      }),
  ];
};

validate.addIvnRules = () => {
  return [
    // valid inv_make is required and cannot already exist in the DB
    body("inv_make")
      .trim()
      .isLength({ min: 2 })
      .withMessage("A valid make is required."),
    // valid inv_model is required and cannot already exist in the DB
    body("inv_model")
      .trim()
      .isLength({ min: 2 })
      .withMessage("A valid model is required."),
    // valid inv_year is required and cannot already exist in the DB
    body("inv_year")
      .trim()
      .isLength({ min: 4, max:4 })
      .withMessage("A valid year is required."),
    // valid inv_miles is required and cannot already exist in the DB
    body("inv_miles")
      .trim()
      .isLength({ min: 2 })
      .withMessage("A valid miles is required."),
    // valid inv_color is required and cannot already exist in the DB
    body("inv_color")
      .trim()
      .isLength({ min: 3 })
      .withMessage("A valid color is required."),
    // valid inv_description is required and cannot already exist in the DB
    body("inv_description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("A valid description is required."),
    // valid inv_price is required and cannot already exist in the DB
    body("inv_price")
      .trim()
      .isLength({ min: 3 })
      .withMessage("A valid price is required."),
    // valid inv_image is required and cannot already exist in the DB
    body("inv_image")
      .trim()
      .isLength({ min: 3 })
      .withMessage("A valid image diretory is required."),
    // valid inv_thumbnail is required and cannot already exist in the DB
    body("inv_thumbnail")
      .trim()
      .isLength({ min: 3 })
      .withMessage("A valid thumbnail diretory is required."),
  ];
};

validate.deleteIvnRules = () => {
  return [
    // valid inv_make is required and cannot already exist in the DB
    body("inv_make")
      .trim()
      .isLength({ min: 2 })
      .withMessage("A valid make is required."),
    // valid inv_model is required and cannot already exist in the DB
    body("inv_model")
      .trim()
      .isLength({ min: 2 })
      .withMessage("A valid model is required."),
    // valid inv_year is required and cannot already exist in the DB
    body("inv_year")
      .trim()
      .isLength({ min: 4, max:4 })
      .withMessage("A valid year is required."),
    // valid inv_price is required and cannot already exist in the DB
    body("inv_price")
      .trim()
      .isLength({ min: 3 })
      .withMessage("A valid price is required."),
  ];
};





/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      errors,
      title: "ADD Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};
/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkinvData = async (req, res, next) => {
  const { inv_make,
    inv_model,
    inv_year,
    inv_miles,
    inv_color,
    inv_description,
    inv_price,
    inv_image,
    inv_thumbnail } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let grid = await utilities.getAddInvForm();
    res.render("inventory/add-inventory", {
      errors,
      title: "ADD Inventory",
      nav,
      inv_make,
      inv_model,
      inv_year,
      inv_miles,
      inv_color,
      inv_description,
      inv_price,
      inv_image,
      inv_thumbnail,
      grid
    });
    return;
  }
  next();
};

/* ******************************
 * Check data and return errors or continue to edit
 * ***************************** */
validate.checkinvEditData = async (req, res, next) => {
  const { inv_make,
    inv_model,
    inv_year,
    inv_miles,
    inv_color,
    inv_description,
    inv_price,
    inv_image,
    inv_thumbnail,
    inv_id } = req.body;
  let errors = [];
  errors = validationResult(req);
  const itemName = `${inv_make} ${inv_model}`
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let grid = await utilities.getAddInvForm();
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit " + itemName,
      nav,
      inv_make,
      inv_model,
      inv_year,
      inv_miles,
      inv_color,
      inv_description,
      inv_price,
      inv_image,
      inv_thumbnail,
      inv_id,
      grid
    });
    return;
  }
  next();
};


/* ******************************
 * Check data and return errors or continue to delete
 * ***************************** */
validate.checkinvDeleteData = async (req, res, next) => {
  const { inv_make,
    inv_model,
    inv_year,
    inv_price,
    inv_id } = req.body;
  let errors = [];
  errors = validationResult(req);
  const itemName = `${inv_make} ${inv_model}`
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/delete-confirm", {
      errors,
      title: "Delete " + itemName,
      nav,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
      inv_id,
    });
    return;
  }
  next();
};


module.exports = validate;
