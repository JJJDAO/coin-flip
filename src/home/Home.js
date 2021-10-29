import React from "react";
import {Link} from "react-router-dom";
import CoinGameMenu from "../coin-game-menu/CoinGameMenu";

export default class Home extends React.Component {

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className="c">
                <div className="pos-m">
                    <div className="coin-game-menu">
                        <div className="w100">
                            <div className="m-container">
                                <div className="w100">
                                    <Link to="/create">
                                        <button className="btn-full"> Create Game</button>
                                    </Link>
                                </div>
                                <div className="w100">
                                    <Link to="/view">
                                        <button className="btn-full"> View Matches</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}
