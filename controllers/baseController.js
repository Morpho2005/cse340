const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const tool = utilities.getTool()
  const nav = await utilities.getNav()
  req.flash("notice", "This is a flash message.")
  res.render("index", {title: "Home", nav, tool})
}

module.exports = baseController