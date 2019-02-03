var Scoreboard = artifacts.require("./Scoreboard.sol");

module.exports = function(deployer) {
  deployer.deploy(Scoreboard);
};
