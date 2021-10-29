import React from "react";
import CoinGameService from "../service/CoinGameService";
import {UtilService} from "../service/UtilService";
class Coin extends React.Component {

    constructor(props) {
        super(props);
        // console.log(props);
        this.coinGameService = CoinGameService.Instance();
        let browserMId = this.props.match.params.id;
        console.log('match id: ', browserMId);
        this.state = {
            matchId:this.props.match.params.id,
            isFlipping:false,
            isContractLoaded:this.coinGameService.coinGameServiceContract != null,
            results:[],
            wageredAmount:0,
            rounds:0,
            isMatchAccepted:false,
            matchOwner:'',
            isHeads:false
        }

    }

    componentDidMount() {
        setTimeout(this.getMatch.bind(this), 3000);
    }

    async getMatch() {
        if(this.coinGameService != null) {
            let result = await this.coinGameService.getMatch(this.state.matchId);
            console.log(result);
            const amount = UtilService.Instance().convertWeiToEth(parseInt(result[4]))
            this.setState({
                rounds: parseInt(result[0]),
                isHeads: result[1],
                matchOwner:result[2],
                wageredAmount: amount
            });
            console.log(this.state);
        }
    }

    renderMatchInfo = () => {
        return (
            <div class="w100">
                <div class="w100">
                    <div className="w33">Match Id: {this.state.matchId}</div>
                    <div className="w33">Rounds: {this.state.rounds}</div>
                    <div className="w33">Owner Choice: {this.state.isHeads ? 'heads' : 'tails'}</div>
                    <div className="w33">Bet Amount: {this.state.wageredAmount}</div>
                </div>
                <div class="w100">Match Owner: {this.state.matchOwner}</div>
            </div>
        )
    }
    render() {
        return (
            <div className="c">
                <div className="pos-m">
                    <div className="coin-game-menu">
                        {this.buildConditionalView()}
                    </div>
                </div>
            </div>
        )

    }

    buildConditionalView() {
        if(!this.state.isMatchAccepted) {
            return (
                <div>
                    {this.renderMatchInfo()}
                    <div>
                        <button class="btn-full" onClick={this.acceptMatch.bind(this)}>Accept</button>
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    {this.renderMatchInfo()}
                    <div class="w100">
                        {/*<div className="coin-container">*/}
                        {/*    <div id="coin">*/}
                        {/*        <div className="side-a"></div>*/}
                        {/*        <div className="side-b"></div>*/}
                        {/*    </div>*/}
                        {/*    <button className="btn-flip" onClick={this.startFlipGame.bind(this)}>Flip</button>*/}
                        {/*</div>*/}
                        <div>Match has started, and will be reflected on chain</div>
                    </div>
                </div>
            )
        }
    }

    async acceptMatch() {
        this.coinGameService.acceptMatch(this.state.matchId, this.state.wageredAmount).then(res => {
            this.setState({isMatchAccepted: res});
        });
    }

    // startFlipGame() {
    //     if(this.state.isContractLoaded && this.state.isMatchAccepted) {
    //         if(!this.state.isFlipping) {
    //             this.setState({isFlipping:true});
    //             let results = []
    //             let $coin = document.querySelector('#coin');
    //             let $this = this;
    //             let c = this.state.rounds;
    //             setTimeout(() => { flip(c, results, $coin, $this);}, 100);
    //         }
    //     }
    //
    //     function flip(count, r, coinEl, component) {
    //         if(count === 0) {
    //             component.setState({isFlipping:false});
    //             console.log('results: ', component.state.matchId, r);
    //             component.coinGameService.finishMatch(component.state.matchId, r)
    //         } else {
    //             coinEl.classList.remove('heads', 'tails');
    //             let flipResult = Math.random();
    //             if(flipResult <= 0.5){
    //                 r.push(true);
    //                 coinEl.classList.add('heads');
    //                 console.log('it is head');
    //                 setTimeout(() => { flip(--count, r, coinEl, component);}, 100);
    //             }
    //             else{
    //                 r.push(false);
    //                 coinEl.classList.add('tails');
    //                 console.log('it is tails');
    //                 setTimeout(() => { flip(--count, r, coinEl, component);}, 100);
    //             }
    //         }
    //     }
    // }
}

export default Coin;