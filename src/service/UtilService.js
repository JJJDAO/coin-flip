export class UtilService {
    static _instance = null;
    constructor() {
    }

    static Instance = () => {
        if(this._instance == null) return (this._instance = new UtilService());
        else return this._instance;
    }

    convertEthToWei(ethValue) {
        return ethValue * 10**18;
    }

    convertWeiToEth(weiValue) {
        return weiValue / 10**18;
    }
}