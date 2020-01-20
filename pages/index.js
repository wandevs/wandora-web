import { connect } from "react-redux";
import { Component } from "../components/base";
import { Button, Table, Icon } from 'antd';
import { Wallet, getSelectedAccount, WalletButton, WalletButtonLong } from "wan-dex-sdk-wallet";
import "wan-dex-sdk-wallet/index.css";
import randomAbi from "./abi/random";
import hydroAbi from "./abi/hydro";
import style from './style.less';
import Panel from '../components/Panel';
import TrendHistory from '../components/TrendHistory';
import TransactionHistory from '../components/TransactionHistory';
import DistributionHistory from '../components/DistributionHistory';

var Web3 = require("web3");

let debugStartTime = (Date.now()/1000).toFixed(0)

class IndexPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    // window._nodeUrl = "https://demodex.wandevs.org:48545";
    window._nodeUrl = "https://mywanwallet.io/testnet";

    let trendStr = window.localStorage.getItem('currentTrend');
    let trend = null;
    if (trendStr) {
      trend = JSON.parse(trendStr);
    }

    let trendHistoryStr = window.localStorage.getItem('trendHistory');
    let trendHistory = [];
    if (trendHistoryStr) {
      trendHistory = JSON.parse(trendHistoryStr);
    }

    this.state = {
      trendInfo: trend,
      trendHistory: trendHistory,
      transactionHistory: this.getTransactionHistory(),
      lotteryHistory: this.getLotteryHistory(),
    }
  }


  componentDidMount() {
    var web3 = new Web3();
    web3.setProvider(new Web3.providers.HttpProvider(window._nodeUrl));
    this.web3 = web3;

    this.updateTrendInfoFromNode();
    setInterval(this.updateTrendInfoFromNode, 5000);
    
    this.updateTrendHistoryFromNode();
    setInterval(this.updateTrendHistoryFromNode, 60*1000);
  }

  setTrendInfo = (trendInfo) => {
    let stateTrend = JSON.stringify(this.state.trendInfo);
    let inComeTrend = JSON.stringify(trendInfo);
    if (stateTrend !== inComeTrend) {
      this.setState({trendInfo});
      window.localStorage.setItem('currentTrend', inComeTrend);
    }
  }

  updateTrendInfoFromNode = async () => {
    let trend = {
      round: 21,
      startTime: debugStartTime,
      timeSpan: 3600 * 12,
      stopBefore: 3600 * 2,
      btcPriceStart: 0.0000241,
      randomPoolAmount: 9873.1234,
      upPoolAmount: 4351,
      downPoolAmount: 2321,
      lotteryRound: 1,
    };

    this.setTrendInfo(trend);
  }

  setTrendHistory = (trendHistory) => {
    let stateValue = JSON.stringify(this.state.trendHistory);
    let inComeValue = JSON.stringify(trendHistory);
    if (stateValue !== inComeValue) {
      this.setState({trendHistory});
      window.localStorage.setItem('trendHistory', inComeValue);
    }
  }

  updateTrendHistoryFromNode = async () => {
    let trendHistory = [
      { round: 1, result: "up", startPrice: '0.0000281', endPrice: '0.0000288' },
      { round: 2, result: "down", startPrice: '0.0000281', endPrice: '0.0000288' },
      { round: 3, result: "up", startPrice: '0.0000281', endPrice: '0.0000288' },
      { round: 4, result: "up", startPrice: '0.0000281', endPrice: '0.0000288' },
      { round: 5, result: "down", startPrice: '0.0000281', endPrice: '0.0000288' },
      { round: 6, result: "up", startPrice: '0.0000281', endPrice: '0.0000288' },
      { round: 7, result: "up", startPrice: '0.0000281', endPrice: '0.0000288' },
      { round: 8, result: "down", startPrice: '0.0000281', endPrice: '0.0000288' },
      { round: 9, result: "up", startPrice: '0.0000281', endPrice: '0.0000288' },
      { round: 10, result: "up", startPrice: '0.0000281', endPrice: '0.0000288' },
      { round: 11, result: "up", startPrice: '0.0000281', endPrice: '0.0000288' },
      { round: 12, result: "down", startPrice: '0.0000281', endPrice: '0.0000288' },
      { round: 13, result: "up", startPrice: '0.0000281', endPrice: '0.0000288' },
      { round: 14, result: "up", startPrice: '0.0000281', endPrice: '0.0000288' },
      { round: 15, result: "down", startPrice: '0.0000281', endPrice: '0.0000288' },
      { round: 16, result: "down", startPrice: '0.0000281', endPrice: '0.0000288' },
      { round: 17, result: "up", startPrice: '0.0000281', endPrice: '0.0000288' },
      { round: 18, result: "up", startPrice: '0.0000281', endPrice: '0.0000288' },
      { round: 19, result: "down", startPrice: '0.0000281', endPrice: '0.0000288' },
      { round: 20, result: "up", startPrice: '0.0000281', endPrice: '0.0000288' },
    ];

    this.setTrendHistory(trendHistory);
  }

  addTransactionHistory = (singleHistory) => {
    const stateHistory = this.state.transactionHistory;
    let history = [];
    if (stateHistory) {
      history = stateHistory.slice();
    }
    history.push(singleHistory);
    this.setState({transactionHistory: history});
    window.localStorage.setItem('transactionHistory', JSON.stringify(history));
  }

  getTransactionHistory = () => {
    return [
      {
        key: 0,
        time: '2020-01-14 17:46:39',
        address: '0x4cf0a877e906dead748a41ae7da8c220e4247d9e',
        round: '03',
        amount: 100,
        type: 'UP',
        result: 'Done',
      },
      {
        key: 1,
        time: '2020-01-14 17:46:39',
        address: '0x4cf0a877e906dead748a41ae7da8c220e4247d9e',
        round: '05',
        amount: 100,
        type: 'DOWN',
        result: 'to be settled',
      },
      {
        key: 2,
        time: '2020-01-14 17:46:39',
        address: '0x4cf0a877e906dead748a41ae7da8c220e4247d9e',
        round: '02',
        amount: 100,
        type: 'DOWN',
        result: 'Done',
      },
      {
        key: 3,
        time: '2020-01-14 17:46:39',
        address: '0x4cf0a877e906dead748a41ae7da8c220e4247d9e',
        round: '07',
        amount: 100,
        type: 'Return',
        result: 'to be settled',
      },
      {
        key: 4,
        time: '2020-01-14 17:46:39',
        address: '0x4cf0a877e906dead748a41ae7da8c220e4247d9e',
        round: '-',
        amount: 100.1234,
        type: 'Fee distribution',
        result: 'Done',
      },
      {
        key: 5,
        time: '2020-01-14 17:46:39',
        address: '0x4cf0a877e906dead748a41ae7da8c220e4247d9e',
        round: '03',
        amount: 100,
        type: 'UP',
        result: 'Done',
      }, {
        key: 6,
        time: '2020-01-14 17:46:39',
        address: '0x4cf0a877e906dead748a41ae7da8c220e4247d9e',
        round: '03',
        amount: 100,
        type: 'UP',
        result: 'Done',
      },
      {
        key: 7,
        time: '2020-01-14 17:46:39',
        address: '0x4cf0a877e906dead748a41ae7da8c220e4247d9e',
        round: '05',
        amount: 100,
        type: 'DOWN',
        result: 'to be settled',
      },
      {
        key: 8,
        time: '2020-01-14 17:46:39',
        address: '0x4cf0a877e906dead748a41ae7da8c220e4247d9e',
        round: '02',
        amount: 100,
        type: 'DOWN',
        result: 'Done',
      },
      {
        key: 9,
        time: '2020-01-14 17:46:39',
        address: '0x4cf0a877e906dead748a41ae7da8c220e4247d9e',
        round: '07',
        amount: 100,
        type: 'Return',
        result: 'to be settled',
      },
      {
        key: 10,
        time: '2020-01-14 17:46:39',
        address: '0x4cf0a877e906dead748a41ae7da8c220e4247d9e',
        round: '-',
        amount: 100.1234,
        type: 'Fee distribution',
        result: 'Done',
      },
      {
        key: 11,
        time: '2020-01-14 17:46:39',
        address: '0x4cf0a877e906dead748a41ae7da8c220e4247d9e',
        round: '03',
        amount: 100,
        type: 'UP',
        result: 'Done',
      },
    ];
  }

  getLotteryHistory = () => {
    return {
      '1': [
      {
        time: '2020-01-14 17:46:39',
        address: '0x4cf0a877e906dead748a41ae7da8c220e4247d9e',
        amountBuy: '1000',
        amountPay: 100.1234,
      }, 
      {
        time: '2020-01-14 17:46:39',
        address: '0x4cf0a877e906dead748a41ae7da8c220e4247d9e',
        amountBuy: '1000',
        amountPay: 100.1234,
      }, 
      {
        time: '2020-01-14 17:46:39',
        address: '0x4cf0a877e906dead748a41ae7da8c220e4247d9e',
        amountBuy: '1000',
        amountPay: 100.1234,
      }, 
      {
        time: '2020-01-14 17:46:39',
        address: '0x4cf0a877e906dead748a41ae7da8c220e4247d9e',
        amountBuy: '1000',
        amountPay: 100.1234,
      }, 
      {
        time: '2020-01-14 17:46:39',
        address: '0x4cf0a877e906dead748a41ae7da8c220e4247d9e',
        amountBuy: '1000',
        amountPay: 100.1234,
      }, 
      {
        time: '2020-01-14 17:46:39',
        address: '0x4cf0a877e906dead748a41ae7da8c220e4247d9e',
        amountBuy: '1000',
        amountPay: 100.1234,
      }, 
      {
        time: '2020-01-14 17:46:39',
        address: '0x4cf0a877e906dead748a41ae7da8c220e4247d9e',
        amountBuy: '1000',
        amountPay: 100.1234,
      }, 
    ]};
  }

  // async getInfoFromSC() {
  //   // let blockNumber = await this.web3.eth.getBlockNumber();
  //   // let random = new this.web3.eth.Contract(randomAbi, "0x0000000000000000000000000000000000000262");
  //   // let epochId = await random.methods.getEpochId((Date.now()/1000).toFixed(0)).call();
  //   // let randomNow = await random.methods.getRandomNumberByEpochId(epochId).call();
  //   // let randomLast = await random.methods.getRandomNumberByEpochId(epochId-1).call();
  //   // this.setState({ epochId: epochId, rn: randomNow, rn0: randomLast, blockNumber });

  //   // let hydro = new this.web3.eth.Contract(hydroAbi, '0x8786038ef9c2f659772c6c2ee8402bdfdc511bb8');
  //   // console.log(blockNumber);
  //   // // let events = await hydro.getPastEvents('Match', {fromBlock: blockNumber - 100, toBlock: 'latest'});
  //   // // console.log('events:', events);
  //   // // hydro.once('Match', (err, event)=>{
  //   // //   console.log('err, event:', err, event);
  //   // // })
  //   // hydro.getPastEvents({fromBlock:5581471}, (err, event)=>{
  //   //   console.log('err, event:', err, event);
  //   // })
  // }

  // renderAccount(account) {
  //   return (
  //     <p>
  //       Address: {account.get("address")}
  //       <br />
  //       IsLock: {account.get("isLocked").toString()}
  //       <br />
  //       Eth Balance: {(account.get("balance")/1e18).toFixed(4)}
  //       <br />
  //       <br />
  //       <button
  //         className="HydroSDK-button"
  //         onClick={() =>
  //           account
  //             .get("wallet")
  //             .signPersonalMessage("0xff2137d657209247083297f72c85e10227634b221049a44c63348509a08d95cc")
  //             .then(alert, alert)
  //         }>
  //         Sign "0xff2137d657209247083297f72c85e10227634b221049a44c63348509a08d95cc"
  //       </button>

  //       <button
  //         className="HydroSDK-button"
  //         onClick={() =>
  //           account
  //             .get("wallet")
  //             .sendTransaction({to:"0x15f59e30ef6f881549ec6196b0633a2cdf3de54c", value: 1e18})
  //             // .then(alert, alert)
  //             .then(console.log, console.log)
  //         }>
  //         Send Transaction
  //       </button>
  //     </p>
  //   );
  // }



  getTrendHistoryFromBlock = async (blockNumber) => {
    try {
      let lotteryAbi = '';
      let lotteryAddr = '';
      let lotteryEvent = 'Pay';
      let lottery = new this.web3.eth.Contract(lotteryAbi, lotteryAddr);
      let events = lottery.getPastEvents(lotteryEvent, { fromBlock: blockNumber, toBlock: 'latest' });
      console.log('events:', events);
      return events;
    } catch (error) {
      console.log(error);
      return null
    }
  }



  render() {
    const { selectedAccount } = this.props;
    return (
      <div className={style.app}>
        <div className={style.header}>
          <Wallet title="Wan Game" nodeUrl={window._nodeUrl} />
          <Icon className={style.logo} type="appstore" />
          <div className={style.title}>BTC</div>
          <WalletButton />
        </div>
        <Panel walletButton={WalletButtonLong} trendInfo={this.state.trendInfo} />
        <TrendHistory trendHistory={this.state.trendHistory} trendInfo={this.state.trendInfo} />
        <TransactionHistory transactionHistory={this.state.transactionHistory} />
        <DistributionHistory lotteryHistory={this.state.lotteryHistory} />

      </div>
    );
  }
}

export default connect(state => ({
  selectedAccount: getSelectedAccount(state)
}))(IndexPage);


