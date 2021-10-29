import React, {isValidElement} from "react";
import Web3 from "web3";
import CoinGameService from "../service/CoinGameService";
import * as contractAbi from "../smart-contracts/build/contracts/CoinGame.json"
import Coin from "../coin/Coin";
export default class CreateGame extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            isConnected: false,
            useHeads:true,
            choiceText:'Heads',
            rounds:0,
            ethBetAmount:0.01
        }

    }

    componentDidMount() {
        this.coinGameService = CoinGameService.Instance();
    }

    render() {
        return (
            <div className="c">
                <div className="pos-m">
                    <div className="coin-game-menu">
                        <div className="c">
                            <div className="m-container">
                                <div className="w100">
                                    <label>Create Game</label>
                                </div>
                                <div className="w100">
                                    <div className="w100">
                                        <label> Number of rounds</label>
                                        <input type="text" value={this.state.rounds}
                                                                                onChange={this.setRounds.bind(this)}
                                                                                placeholder="0"></input>
                                    </div>
                                    <div className="w100">
                                        <label> Choice </label>
                                        <button className="btn"
                                                onClick={this.flipChoice.bind(this)}>{this.state.choiceText}</button>
                                    </div>
                                    <div className="w100">
                                        <label> Eth to bet</label> <input type="text" value={this.state.ethBetAmount}
                                                                          onChange={this.setEthAmount.bind(this)}
                                                                          placeholder={this.state.ethBetAmount}></input>
                                    </div>
                                    <div className="w100">
                                        <button className="btn-full" onClick={this.createGame.bind(this)}>Create
                                        </button>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }

    createGame() {
        debugger;
        //create form validation for rounds
        this.coinGameService.createMatch(this.state.useHeads, this.state.rounds, this.state.ethBetAmount);
    }

    setRounds(e) {
        try {
            let newNum = parseInt(e.target.value);
            this.setState({rounds:newNum});
        } catch (err) {
            alert("Must use a number for rounds!");
            this.setState({rounds:0});
        }
    }

    flipChoice() {
        let newUseHeads = !this.state.useHeads;
        let newUseHeadsText = newUseHeads ? 'Heads' : 'Tails';
        this.setState({useHeads: newUseHeads});
        this.setState({choiceText: newUseHeadsText});
    }

    setEthAmount(amount) {
        this.isValid(amount);
    }

    isValid(e) {
        const text = e.target.value;
        const onlyNumArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'];
        let count = 0;
        for(let i = 0; i < text.length; i++) {
            if(onlyNumArr.indexOf(text[i]) > -1) count++;
        }
        if(count === text.length) {
            let val = parseFloat(text)
            if(val != NaN && val <= 1.00 && val >= 0) this.setState({ethBetAmount:val});
            else this.setState({ethBetAmount:this.ethBetAmount});
        } else {
            this.setState({ethBetAmount:this.ethBetAmount});
        }
    }
}