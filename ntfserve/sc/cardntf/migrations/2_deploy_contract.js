let SignCheck = artifacts.require('./SignCheck.sol');
module.exports = function(deployer) {
    deployer.deploy(SignCheck);
};