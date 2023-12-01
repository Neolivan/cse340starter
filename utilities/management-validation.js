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


module.exports = validate;
