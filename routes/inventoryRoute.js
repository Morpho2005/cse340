// Needed Resources 
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const validator = require("../utilities/inv-validator")
const utilities = require("../utilities")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory by detail view
router.get("/detail/:invId", invController.buildByInvId)

// Route to build management view
router.get("/", invController.buildManagement)

// Route to build add classification view
router.get("/add-class", invController.buildAddClass)

// Route for post new classifications
router.post(
    "/add-class",
    validator.classificationRules(),
    validator.checkClassData,
    utilities.handleErrors(invController.postClass())
)

module.exports = router;