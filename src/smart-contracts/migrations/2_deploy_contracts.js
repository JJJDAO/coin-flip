let coinGame = artifacts.require("./CoinGame.sol");

module.exports = async function(deployer) {
    await deployer.deploy(coinGame);
}