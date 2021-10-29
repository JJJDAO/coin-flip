import './App.css';
import Banner from './banner/Banner';
import Coin from './coin/Coin';
import ViewGames from './view-games/ViewGames';
import CreateGame from './create-game/CreateGame';
import Home from './home/Home';
import CoinGameMenu from "./coin-game-menu/CoinGameMenu";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

function App() {
  return (
    <div className="App">
        <Router>
            <Banner></Banner>
            <Switch>
                {/*<CoinGameMenu>*/}
                    <Route exact path="/" component={Home}></Route>
                    <Route exact path="/home" component={Home}></Route>
                    <Route exact path="/create" component={CreateGame}></Route>
                    <Route exact path="/view" component={ViewGames}></Route>
                    <Route exact path="/match/:id" component={Coin}></Route>
                {/*</CoinGameMenu>*/}
            </Switch>
        </Router>
    </div>
  );
}

export default App;
