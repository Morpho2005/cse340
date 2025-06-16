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
    utilities.handleErrors(invController.postClass)
)

// Route to build add inventory view
router.get("/add-inv", invController.buildAddInv)

// Route to add a new item to inventory
router.post(
    "/add-inv",
    validator.inventoryRules(),
    validator.checkInvData,
    utilities.handleErrors(invController.postInv),
)

// route for accouring inventory by classification id
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// route for modifying inventory items
router.get("/edit/:inv_id", utilities.handleErrors(invController.getEditInventory))

// route for confirming the modification of inventory items
router.post("/update", utilities.handleErrors(invController.updateInventory))

// route for deleting inventory items
router.get("/delete/:inv_id", utilities.handleErrors(invController.getDeleteInventory))

// route for confirming the deletion of inventory items
router.post("/delete", utilities.handleErrors(invController.deleteInventory))

module.exports = router;