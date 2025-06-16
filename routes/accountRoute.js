// Needed Resources 
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController.js");
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validator')

// Route to build login view
router.get("/login", accountController.buildLogin);

// Route to build sing up view
router.get("/signUp", accountController.buildSignUp)

// route for account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))

router.post(
  "/signUp",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.signUpAccount)
)

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

//route for logout view
router.get("/logout",
  utilities.checkLogin,
  accountController.buildLogout)

// Process the logout attempt
router.post(
  "/logout",
  utilities.handleErrors(accountController.accountLogout)
)

// route for update view
router.get("/update",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdate)
)

// route for updating names
router.post("/update/name",
  utilities.checkLogin,
  utilities.handleErrors(accountController.updateName)
)

// route for updating passwords
router.post("/update/password",
  utilities.checkLogin,
  utilities.handleErrors(accountController.updatePassword)
)

module.exports = router;