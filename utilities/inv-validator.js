const utilities = require(".")
  const invModel = require("../models/inventory-model")
  const { body, validationResult } = require("express-validator")
  const validate = {}

  /*  **********************************
  *  Classification Data Validation Rules
  * ********************************* */
validate.classificationRules = () => {
  return [
    body("classification_name")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Please provide a classification name.") // on error this message is sent.
    .custom(async (classification_name) => {
      const emailExists = await invModel.checkExistingClass(classification_name)
      if (emailExists){
        throw new Error("classification already exists")
      }
    }),
  ]
}

/* ******************************
 * Check data and return errors or continue
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
  const { classification_name} = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      errors,
      title: "add classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}


  /*  **********************************
  *  inventory Validation Rules
  * ********************************* */
validate.inventoryRules = () => {
  return [
    // make is required and must be string
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a make."), // on error this message is sent.

    // model is required and must be string
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a model."), // on error this message is sent.
  
    // year must be a four digit number and is required
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isLength(4)
      .isInt()
      .withMessage("Please provide a year."),
  
    // description is required
    body("inv_description")
      .trim()
      .notEmpty()
      .isLength({min: 5})
      .withMessage("Please provide a description."),

    // price must be a number with 9 digits or less
    body("inv_price")
      .trim()
      .notEmpty()
      .isLength({max: 9})
      .isInt()
      .withMessage("Please provide a price."),
      
    // miles must be a number
    body("inv_miles")
      .trim()
      .notEmpty()
      .isInt()
      .withMessage("Please provide a mileage number."),

    // color must be a string
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a color."),
  ]
}

/* ******************************
 * Check data and return errors or continue
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-inventory", {
      errors,
      title: "add inventory",
      nav,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    })
    return
  }
  next()
}

module.exports = validate