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
    res.render("account/signUp", {
      errors,
      title: "add classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

module.exports = validate