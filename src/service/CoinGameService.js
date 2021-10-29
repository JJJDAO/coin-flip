import Web3 from "web3";
import {UtilService} from "./UtilService";
import * as coinGameAbi from "../smart-contracts/build/contracts/CoinGame.json"

class CoinGameService {

    static _instance = null;
    isConnected = false;
    account = '';
    constructor() {
        this.w3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        this.setupContract();
        this.createW3AccountChangedEvent();
        this.createNetworkChangedEvent();
    }

    static Instance = () => {
        if (this._instance == null) return (this._instance = new CoinGameService());
        else return this._instance;
    }

    async connectToW3() {
        // Load WEB3
        // Check wether it's already injected by something else (like Metamask or Parity Chrome plugin)
        if(typeof window.ethereum !== 'undefined') {
            let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            this.account = accounts[0];
            this.isConnected = true;
        }

        return {isConnected:this.isConnected, account:this.account}
    }

    createW3AccountChangedEvent() {
        if(typeof window.ethereum !== 'undefined') {
            window.ethereum.on('accountsChanged', function (accounts) {
                console.log('accountsChanges', accounts);
                this.account = accounts[0];
            });
        }
    }

    createNetworkChangedEvent() {
        if(typeof window.ethereum !== 'undefined') {
            window.ethereum.on('networkChanged', function (networkId) {
                console.log('networkChanged', networkId);
            });
        }
    }

    getStorage() {
        const storage = localStorage.getItem('coin-game');
        if(storage !== null && storage !== undefined) {
            let isConnected = storage['isConnected'];
            let account = storage['account'];
        }
    }

    createStorage() {
        let storage = { isConnected: false, account: ''}
        localStorage.setItem('coin-game', storage);
    }

    setupContract() {
        let networkId = 0;
        this.w3.eth.net.getId().then((res) => {
            networkId = res;
            let deployedNetwork = coinGameAbi.networks[networkId];
            this.coinGameServiceContract = new this.w3.eth.Contract(
                coinGameAbi.abi,
                deployedNetwork && deployedNetwork.address
            );
        });
    }

    createMatch(isHeads, rounds, amount) {
        const convAmount = UtilService.Instance().convertEthToWei(amount);
        debugger;
        this.coinGameServiceContract.methods.createMatch(isHeads, rounds).send(
            {
                from: this.account,
                // gas: 300000,
                value: convAmount
            }
        );
    }
    async getResults(matchId) {
        let match = await this.coinGameServiceContract.methods.getMatch(matchId).call();
        let results = [];
        for (let i = 0; i < match.rounds; i++) {
            results.push(Math.random() > 0.5);
        }
        return results;
    }

    async acceptMatch(matchId, amount) {
        const convAmount = UtilService.Instance().convertEthToWei(amount);
        return this.coinGameServiceContract.methods.acceptMatch(matchId).send(
            {
                from: this.account,
                gas: 200000,
                value: convAmount
            })
            .then(res => {
                console.log(res);
                return res;
            }).catch(err => {
                return false;
            });
    }

    async getOpenMatches() {
        return await this.coinGameServiceContract.methods.viewOpenMatches().call();
    }

    async getFinishedMatches() {
        return await this.coinGameServiceContract.methods.viewFinishedMatches().call();

    }

    async getMatch(matchId) {
        return await this.coinGameServiceContract.methods.getMatch(matchId).call();
    }
}

export default CoinGameService;