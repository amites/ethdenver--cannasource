var MITSContract = artifacts.require("./MITSContract");

// ordering hack DISPOSED SC transition test requires this be the last item in both lists!
module.exports = function(deployer) {
  deployer.deploy(MITSContract, ["CREATED_ASSET", "IMMATURE","VEGETATIVE_TAGGED","FLOWERING","CUT_GET_WET_WEIGHT","HARVESTED","PACKAGED_TAGGED","DISPOSED"],["CREATED_ASSET","INVENTORY","TRANSFERRING","DISPOSED"]);
};
