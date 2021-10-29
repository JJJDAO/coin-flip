import React from "react";
import CoinGameService from "../service/CoinGameService";
import {Router, Link, useHistory} from "react-router-dom";

export default class ViewGames extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isConnected: false,
            openMatches: []
        }
    }

    componentDidMount() {
        this.coinGameService = CoinGameService.Instance();
        setTimeout(() => {
            this.coinGameService.getOpenMatches().then(res => {
                this.setState({openMatches:res});
            });
        }, 3000);
    }

    render() {
        const items = []
        for(let i = 0; i < this.state.openMatches.length; i++) {
            let url = `/match/${i}`
            items.push(
                <Link to={url}>
                    <div class="w100 match">
                        <div class="w25">Match Id:</div>
                        <div className="w75 txt-left">{this.state.openMatches[i]} </div>
                    </div>
                </Link>
                )
        }
        return(
            <div className="c">
                <div className="pos-m">
                    <div className="coin-game-menu">
                        <div>
                            <div class="view-games">View Games</div>
                            <div>{items}</div>
                        </div>
                    </div>
                </div>
            </div>
        )

    }

    onMatchClick(matchId) {
        // let history = useHistory();
        // history.push(`match/${matchId}`);

    }
}