const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const tool = utilities.getTools(req, res)
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav, tool})
}

module.exports = baseController