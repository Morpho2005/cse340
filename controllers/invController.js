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
  const tool = utilities.getTools(req, res)
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    tool,
    grid,
  })
}

/* ***************************
 *  Build inventory by details view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryByInvId(inv_id)
  const grid = await utilities.buildDetailsGrid(data)
  let nav = await utilities.getNav()
  const tool = utilities.getTools(req, res)
  const modelName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`
  res.render("./inventory/detail", {
    title: modelName,
    nav,
    tool,
    grid,
  })
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const tool = utilities.getTools(req, res)
  const classificationSelect = await utilities.buildClassificationList()
    res.render("./inventory/management", {
      title: "management",
      nav,
      tool,
      classificationSelect
    })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClass = async function (req, res, next) {
  let nav = await utilities.getNav()
  const tool = utilities.getTools(req, res)
    res.render("./inventory/add-classification", {
      title: "add classification",
      nav,
      tool,
      errors: null
    })
}

/* ***************************
 *  Add classification
 * ************************** */
invCont.postClass = async function (req, res) {
  let nav = await utilities.getNav()
  const tool = utilities.getTools(req, res)
  const { classification_name } = req.body

  const classResult = await invModel.buildClass(classification_name)

  if (classResult) {
    req.flash(
      "notice",
      `succesfully added ${classification_name} classification to database`
    )
    res.status(201).render("./inventory/management", {
      title: "Management",
      nav,
      tool
    })
  } else {
    req.flash("notice", "Sorry, the system failed to upload the classification")
    res.status(501).render("./inventory/add-classification", {
      title: "add classification",
      nav,
      tool,
      errors: null,
    })
  }
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInv = async function (req, res, next) {
  let nav = await utilities.getNav()
  const tool = utilities.getTools(req, res)
  let classlist = await utilities.buildClassificationList()
    res.render("./inventory/add-inventory", {
      title: "add inventory",
      nav,
      tool,
      classlist,
      errors: null
    })
}

/* ***************************
 *  Add inventory
 * ************************** */
invCont.postInv = async function (req, res) {
  let nav = await utilities.getNav()
  const tool = utilities.getTools(req, res)
  const { 
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_price, 
    inv_miles, 
    inv_color, 
    classification_id 
  } = req.body

  const postResult = await invModel.addInv(inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id)

  if (postResult) {
    req.flash(
      "notice",
      `succesfully added ${inv_make} ${inv_model} ${inv_year} to inventory`
    )
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the system failed to upload the inventory.")
    res.status(501).render("./inventory/add-inventory", {
      title: "add invetory",
      nav,
      tool,
      errors: null,
    })
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
 *  Return information for editing inventory data
 * ************************** */
invCont.getEditInventory = async (req, res, next) => {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const tool = utilities.getTools(req, res)
  const data = await invModel.getInventoryByInvId(inv_id)
  const invData = data[0]
  const classlist = await utilities.buildClassificationList(parseInt(invData.classification_id))
  const itemName = `${invData.inv_make} ${invData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: `edit ${itemName}`,
    nav,
    tool,
    classlist,
    errors: null,
    inv_id: invData.inv_id,
    inv_make: invData.inv_make,
    inv_model: invData.inv_model,
    inv_year: invData.inv_year,
    inv_description: invData.inv_description,
    inv_image: invData.inv_image,
    inv_thumbnail: invData.inv_thumbnail,
    inv_price: invData.inv_price,
    inv_miles: invData.inv_miles,
    inv_color: invData.inv_color,
    classification_id: invData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const tool = utilities.getTools(req, res)
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
  const updateResult = await invModel.updateInventory(
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
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    tool,
    classificationSelect: classificationSelect,
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
 *  Return information for deleting inventory data
 * ************************** */
invCont.getDeleteInventory = async (req, res, next) => {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const tool = utilities.getTools(req, res)
  const data = await invModel.getInventoryByInvId(inv_id)
  const invData = data[0]
  const itemName = `${invData.inv_make} ${invData.inv_model}`
  res.render("./inventory/delete-inventory", {
    title: `delete ${itemName}`,
    nav,
    tool,
    errors: null,
    inv_id: invData.inv_id,
    inv_make: invData.inv_make,
    inv_model: invData.inv_model,
    inv_year: invData.inv_year,
    inv_price: invData.inv_price,
    inv_miles: invData.inv_miles,
  })
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const tool = utilities.getTools(req, res)
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_price,
    inv_year,
  } = req.body
  const deleteResult = await invModel.deleteInventory(
    inv_id,
  )

  if (deleteResult) {
    const itemName = inv_make + " " + inv_model
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("inventory/delete-inventory", {
    title: "Delete " + itemName,
    nav,
    tool,
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