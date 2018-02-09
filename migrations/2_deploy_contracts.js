var MITSContract = artifacts.require("./MITSContract");

module.exports = function(deployer) {
  deployer.deploy(MITSContract, ["CREATED_ASSET", "IMMATURE","VEGATATIVE","FLOWERING","HARVESTED","PACKAGED","ATTACHED_TAG"],["CREATED_ASSET","INVENTORY","TRANSFERRING"]);
};
