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

router.post(
    "/signUp",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.signUpAccount)
)

module.exports = router;