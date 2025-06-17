const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

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
* Build the details view HTML
* ************************************ */
Util.buildDetailsGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-detail">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<img src="' + vehicle.inv_image  
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" />'
      grid += '<div class="namePrice">'
      grid += '<h2>'
      grid += 'Price ' + '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</h2>'
      grid += '<button type="button" onclick=""> Purchase </button>'
      grid += '<ul>' + '<li>'
      + 'Mileage: ' + Intl.NumberFormat('en-US').format(vehicle.inv_miles)
      + '</li>' + '<li>'
      + 'Color: ' + vehicle.inv_color
      + '</li>' + '<li class=description>'
      +  vehicle.inv_description
      + '</li>' + '</ul>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ****************************************
 * build the classification list
 **************************************** */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

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

/* ************************
 * Constructs the tool HTML link
 ************************** */
Util.getTools = (req, res) => {
  let tools
  if (res.locals.loggedin) {
    tools = '<li><a title="Click to view account" href="/account">Welcome Back</a></li>'
    tools += '<li><a title="Click to log out" href="/account/logout">Log Out</a></li>'
  } else {
    tools = '<li></li>'
    tools += '<li><a title="Click to log in" href="/account/login">My Account</a></li>'
  }
  return tools
}

/* ************************
 * checks account type
 ************************** */
Util.checkAccount = (req, res, next) => {
  if (res.locals.accountData.account_type  == 'Client') {
    req.flash("notice", "you do not have access")
    return res.redirect("/")
  } else {
    next()
  }
}

/* ************************
 * Constructs the tool HTML link
 ************************** */
Util.makeGreeting = (req, res) => {
  let greeting
  if (res.locals.accountData.account_type  == 'Client') {
    greeting = `<h2>Hello ${res.locals.accountData.account_firstname}</h2>`
  } else {
    greeting = `<h2>Hello ${res.locals.accountData.account_firstname}</h2>`
    greeting += `<h3> inventory management </h3>`
    greeting += `<a href="/inv"><button>manage Inventory</button></a>`
  }
  return greeting
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util