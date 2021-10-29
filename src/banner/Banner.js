import React from "react";
import Web3 from "web3";
import {Link} from "react-router-dom";
import CoinGameService from "../service/CoinGameService";

class Banner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isConnected:false,
            address:null,
            coinGameService: CoinGameService.Instance()
        };
        if(this.state.coinGameService.isConnected) {
            this.setState({isConnected:true, address:this.coinGameService.account});
        }
    }
    render() {
        return (
            <div className="Banner c">
                    <div className="w50">
                        <div className="w25 fix-banner-text">
                            <Link exact path="/home">
                                <h4 className="banner-title">ethFlip</h4>
                            </Link>
                        </div>                        
                    </div>
                    <div className="w50 fix-connect-btn">
                        <button className="btn-connect" onClick={() => this.connect()}>
                            {this.state.isConnected ? this.state.address : 'Connect'}
                        </button>
                    </div>
            </div>
        )
    }

    async connect() {
        if(!this.state.isConnected) {
            let result = await this.state.coinGameService.connectToW3();
            this.setState({isConnected:result.isConnected, address: result.account})
        }        
    }
}

export default Banner;