const CoinGameTest = artifacts.require("CoinGameTest");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("CoinGameTest", function (/* accounts */) {
  it("should assert true", async function () {
    await CoinGameTest.deployed();
    return assert.isTrue(true);
  });
});
