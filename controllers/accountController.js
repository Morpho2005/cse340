const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  const tool = utilities.getTools(req, res)
  res.render("account/login", {
    title: "Login",
    tool,
    errors: null,
  })
}

/* ****************************************
*  Deliver sign up view
* *************************************** */
async function buildSignUp(req, res, next) {
  const tool = utilities.getTools(req, res)
  res.render("account/signUp", {
    title: "SignUp",
    tool,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function signUpAccount(req, res) {
  const tool = utilities.getTools(req, res)
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/signUp", {
      title: "SignUp",
      tool,
      errors: null,
    })
  }

  const regResult = await accountModel.signUpAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve signed up ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      tool,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/signUp", {
      title: "sign up",
      tool,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  const tool = utilities.getTools(req, res)
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      tool,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        tool,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
*  Deliver sign up view
* *************************************** */
async function buildManagement(req, res, next) {
  let tool = utilities.getTools(req, res)
  let greeting = utilities.makeGreeting(req, res)
  res.render("account/management", {
    title: "Account",
    tool,
    greeting
  })
}

/* ****************************************
*  Deliver logout view
* *************************************** */
async function buildLogout(req, res, next) {
  const tool = utilities.getTools(req, res)
  res.render("account/logout", {
    title: "Logout",
    tool,
    errors: null,
  })
}

/* ****************************************
 *  Process logout request
 * ************************************ */
async function accountLogout(req, res) {
  res.clearCookie("jwt")
  if (!res.cookie.jwt) {
    res.redirect('/')
  } else {
    let tool = utilities.getTools(req, res)
    req.flash("message notice", "logout process failed.")
    res.render("account/logout", {
      title: "Logout",
      tool,
      errors: null,})
  }
}

/* ****************************************
*  Deliver update view
* *************************************** */
async function buildUpdate(req, res, next) {
  const tool = utilities.getTools(req, res)
  account_id = res.locals.accountData.account_id
  const data = await accountModel.getAccountById(account_id)

  res.render("account/update", {
    title: "Update Account",
    tool,
    account_id: data.account_id,
    account_firstname: data.account_firstname,
    account_lastname: data.account_lastname,
    account_email: data.account_email,
    errors: null
  })
}

/* ***************************
 *  Update Account Name
 * ************************** */
async function updateName(req, res, next) {
  const tool = utilities.getTools(req, res)
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  } = req.body
  const updateResult = await accountModel.updateName(
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  )

  if (updateResult) {
    req.flash("notice", `The name update was successfully updated.`)
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/update", {
    title: "Update Account",
    tool,
    account_id,
    account_firstname,
    account_lastname,
    account_email,
    errors: null
    })
  }
}

/* ***************************
 *  Update Account Password
 * ************************** */
async function updatePassword(req, res, next) {
  const tool = utilities.getTools(req, res)
  const {
    account_id,
    account_password
  } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the update.')
    res.status(500).render("account/update", {
    title: "Update Account",
    tool,
    account_id,
    errors: null
    })
  }

  const updateResult = await accountModel.updatePassword(
    account_id,
    hashedPassword
  )

  if (updateResult) {
    req.flash("notice", `The password update was successfully updated.`)
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.redirect("/account/update")
  }
}


module.exports = { buildLogin, buildSignUp, signUpAccount, accountLogin, buildManagement, buildLogout, accountLogout, buildUpdate, updateName, updatePassword }