// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7 <0.9.0;

library CoinGameLibrary {
    enum GAME_STATUS {OPEN, IN_PROGRESS, DETERMINING_RESULT, FINISHED}
    enum RANDOM_NUM_REQUEST_STATUS { IN_PROGRESS, FINISHED }
}