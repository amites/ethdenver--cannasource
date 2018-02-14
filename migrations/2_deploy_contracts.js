var MITSContract = artifacts.require("./MITSContract");

module.exports = function(deployer) {
  deployer.deploy(MITSContract, ["CREATED_ASSET", "IMMATURE","VEGETATIVE_TAGGED","FLOWERING","HARVESTED","PACKAGED_TAGGED","DISPOSED"],["CREATED_ASSET","INVENTORY","TRANSFERRING","DISPOSED"]);
};
