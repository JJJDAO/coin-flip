// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7 <0.9.0;

import "./CoinGameLibrary.sol";

contract CoinGame {
  event MatchCreated(uint, string);
  event MatchAccepted(uint, string);
  event MatchFinished(uint, string);

  struct Game {
    uint gameId;
    address player1;
    address player2;
    uint rounds;
    bool isHeads;
    address winner;
    uint amount;
    CoinGameLibrary.GAME_STATUS gameStatus;
  }

  address payable owner;
  address private oracle;

  mapping(uint => Game) games;
  uint private gameId;

  uint[] openGames;
  uint[] finishedGames;

  constructor() public {
    gameId = 0;
    owner = payable(address(this));
  }

  function createMatch(bool _isHeads, uint _rounds) external payable {
    uint amount = msg.value;
    uint balance = address(msg.sender).balance;
    require(balance > amount, "Not enough ether");

    emit MatchCreated(gameId, "Match Created");
    games[gameId] = Game(
      gameId,
      msg.sender,
      address(0x0),
      _rounds,
      _isHeads,
      address(0x0),
      amount,
      CoinGameLibrary.GAME_STATUS.OPEN
    );
    openGames.push(gameId);
    gameId++;

    owner.transfer(msg.value);
  }

  function acceptMatch(uint256 _gameId) external payable {
    //match check and accept
    Game storage m = games[_gameId];
    require(msg.sender != m.player1, "Cannot accept match");
    require(address(msg.sender).balance > m.amount, "Balance not enough");
    require(msg.value == m.amount, "Not enough ether");
    require(msg.sender != m.player1, "Unable to accept match");
    require(m.gameStatus == CoinGameLibrary.GAME_STATUS.OPEN, "Unable to accept match");
    m.gameStatus = CoinGameLibrary.GAME_STATUS.IN_PROGRESS;
    m.player2 = msg.sender;
    m.amount += msg.value;
    owner.transfer(msg.value);
    emit MatchAccepted(m.gameId, "Match Accepted");
    //finssh game
    require(m.gameStatus == CoinGameLibrary.GAME_STATUS.IN_PROGRESS, "Match is not in progress!");

    uint[] memory results = new uint[](m.rounds);

    uint randNonce = 0;
    for(uint i = 0; i < m.rounds; i++) {
      uint modulus = 100;
      //I know its not really random... fight me
      uint val = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))) % modulus;
      results[i] = val;
      randNonce++;
    }

    //count totals
    require(m.gameStatus == CoinGameLibrary.GAME_STATUS.IN_PROGRESS, "Match currently finishing");
    m.gameStatus = CoinGameLibrary.GAME_STATUS.DETERMINING_RESULT;
    uint256 hCount = 0;
    uint256 tCount = 0;
    for(uint256 i = 0; i < m.rounds; i++) {
      if(results[i] < 50) {
        hCount++;
      } else {
        tCount++;
      }
    }

    //set winner
    address winner = address(0);
    if(m.isHeads) {
      winner =  hCount > tCount ? m.player1 : m.player2;
    } else {
      winner =  tCount > hCount ? m.player1 : m.player2;
    }

    //finish game and transfer moeny
    m.gameStatus = CoinGameLibrary.GAME_STATUS.FINISHED;
    emit MatchFinished(m.gameId, "Match Finished");
    m.winner = winner;
    payable(m.winner).transfer(m.amount);

    //remove entry from openGames
    if(openGames.length == 1) {
      openGames.pop();
    } else {
      uint index = 0;
      for(uint i = 0; i < openGames.length; i++) {
        if(openGames[i] == m.gameId) {
          index = i;
          break;
        }
      }
      if(index != (openGames.length - 1)) {
        openGames[index] = openGames[openGames.length - 1];
      }
      openGames.pop();
    }
    finishedGames.push(m.gameId);
  }


  //aux funcs
  function isMatchInProgress(uint _gameId) private view returns(bool) {
    Game storage m = games[_gameId];
    return (m.gameStatus == CoinGameLibrary.GAME_STATUS.IN_PROGRESS);
  }

  function viewOpenMatches() public view returns(uint[] memory) {
    return openGames;
  }

  function viewFinishedMatches() public view returns(uint[] memory) {
    return finishedGames;
  }

  function getMatch(uint _gameId) public view returns(uint, bool, address, address, uint, address) {
    Game storage m = games[_gameId];
    return (m.rounds, m.isHeads, m.player1, m.player2, m.amount, m.winner);
  }

  function getBalance() public view returns (uint) {
    return address(owner).balance;
  }

  receive() payable external {}
}
