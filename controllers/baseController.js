const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const tool = utilities.getTools(req, res)
  res.render("index", {title: "Home", tool})
}

module.exports = baseController