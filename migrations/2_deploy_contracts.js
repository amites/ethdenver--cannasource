var MITSContract = artifacts.require("./MITSContract");

module.exports = function(deployer) {
  deployer.deploy(MITSContract);
};
