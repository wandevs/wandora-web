import { connect } from "react-redux";
import { Component } from "../components/base";
import { Button, Table, Icon } from 'antd';
import BigNumber from 'bignumber.js';
import { Wallet, getSelectedAccount, WalletButton, WalletButtonLong, getSelectedAccountWallet } from "wan-dex-sdk-wallet";
import "wan-dex-sdk-wallet/index.css";
import randomAbi from "./abi/random";
import hydroAbi from "./abi/hydro";
import lotteryAbi from "./abi/lottery";
import style from './style.less';
import Panel from '../components/Panel';
import TrendHistory from '../components/TrendHistory';
import TransactionHistory from '../components/TransactionHistory';
import DistributionHistory from '../components/DistributionHistory';

const lotterySCAddr = '0x0000000000000000000000000000000000000262';

var Web3 = require("web3");

let debugStartTime = (Date.now() / 1000)

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

    Date.prototype.format = function (fmt) {
      var o = {
        "M+": this.getMonth() + 1,                 //月份 
        "d+": this.getDate(),                    //日 
        "h+": this.getHours(),                   //小时 
        "m+": this.getMinutes(),                 //分 
        "s+": this.getSeconds(),                 //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds()             //毫秒 
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
      }
      return fmt;
    }
  }

  componentDidMount() {
    var web3 = new Web3();
    web3.setProvider(new Web3.providers.HttpProvider(window._nodeUrl));
    this.web3 = web3;

    this.updateTrendInfoFromNode();
    setInterval(this.updateTrendInfoFromNode, 5000);

    setInterval(this.updateTrendHistoryFromNode, 60 * 1000);
  }

  setTrendInfo = (trendInfo) => {
    let stateTrend = JSON.stringify(this.state.trendInfo);
    let inComeTrend = JSON.stringify(trendInfo);
    if (stateTrend !== inComeTrend) {
      this.setState({ trendInfo });
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

    let lotterySC = new this.web3.eth.Contract(lotteryAbi, lotterySCAddr);
    trend.round = await lotterySC.methods.curUpDownRound().call();
    trend.lotteryRound = await lotterySC.methods.curRandomRound().call();
    trend.startTime = await lotterySC.methods.upDownLotteryStartTime().call();
    trend.timeSpan = await lotterySC.methods.upDownLotteryTimeCycle().call();
    trend.stopBefore = await lotterySC.methods.upDownLtrstopTimeSpanInAdvance().call();
    let roundInfo = await lotterySC.methods.updownGameMap(trend.round).call();
    trend.btcPriceStart = roundInfo.openPrice;
    trend.upPoolAmount = roundInfo.upAmount;
    trend.downPoolAmount = roundInfo.downAmount;
    trend.randomPoolAmount = roundInfo.feeTotal;

    this.setTrendInfo(trend);

    this.updateTrendHistoryFromNode();
    this.updateRandomHistoryFromNode();
  }

  setTrendHistory = (trendHistory) => {
    let stateValue = JSON.stringify(this.state.trendHistory);
    let inComeValue = JSON.stringify(trendHistory);
    if (stateValue !== inComeValue) {
      this.setState({ trendHistory });
      window.localStorage.setItem('trendHistory', inComeValue);
    }
  }

  updateTrendHistoryFromNode = async () => {
    try {
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

      let roundArray = this.getUpDownRoundRange();
      if (roundArray.length === 0) {
        return;
      }

      let lotterySC = new this.web3.eth.Contract(lotteryAbi, lotterySCAddr);

      for (let i = 0; i < roundArray.length; i++) {
        let ret = await lotterySC.methods.updownGameMap(roundArray[i]).call();
        trendHistory.push({
          round: roundArray[i],
          startPrice: ret.openPrice,
          endPrice: ret.closePrice,
          result: (ret.openPrice > ret.closePrice) ? 'down' : 'up',
          upAmount: ret.upAmount,
          downAmount: ret.downAmount,
          feeTotal: ret.feeTotal,
        })
        if (trendHistory.length > 29) {
          trendHistory.splice(0, 1);
        }
      }
      this.setTrendHistory(trendHistory);
    } catch (err) {
      console.log(err);
    }
  }

  addRandomHistory = (randomHistories) => {
    const stateHistory = this.state.lotteryHistory;
    let history = [];
    if (stateHistory) {
      history = stateHistory.slice();
    }
    for (let i = 0; i < randomHistories; i++) {
      history.push(singleRandomHistory);
    }
    this.setState({ transactionHistory: history });
    window.localStorage.setItem('randomHistory', JSON.stringify(history));
  }

  updateRandomHistoryFromNode = async () => {
    try {
      let randomHistories = {};

      let roundArray = this.getRandomRoundRange();
      if (roundArray.length === 0) {
        return;
      }

      let lotterySC = new this.web3.eth.Contract(lotteryAbi, lotterySCAddr);
      let blockNumber = await this.web3.eth.getBlockNumber();
      let events = await lotterySC.getPastEvents('RandomBingGo', {
        filter: { round: roundArray },
        fromBlock: this.getRandomHistoryStartBlock(),
        toBlock: blockNumber
      });

      if (events && events.length > 0) {
        for (let i = 0; i < events.length; i++) {
          if (!randomHistories[events[i].returnValues.round]) {
            randomHistories[events[i].returnValues.round] = [];
          }

          randomHistories[events[i].returnValues.round].push({
            round: events[i].returnValues.round,
            address: events[i].returnValues.staker,
            amountBuy: '--',
            amountPay: events[i].returnValues.prizeAmount,
          });
        }
      }

      this.addRandomHistory(randomHistories);
      this.setRandomHistoryStartBlock(blockNumber);
    } catch (err) {
      console.log(err);
    }
  }

  getUpDownRoundRange = () => {
    let currentRound = 1;
    if (this.state.trendInfo) {
      currentRound = this.state.trendInfo.round - 1;
    }

    let startRound = currentRound - 29 > 1 ? (currentRound - 29) : 1;
    if (this.state.trendHistory && this.state.trendHistory.length > 0) {
      startRound = Number(this.state.trendHistory[this.state.trendHistory.length - 1].round) + 1;
    }

    if (startRound >= currentRound) {
      return [];
    }

    let roundArray = [];
    for (let i = startRound; i < currentRound; i++) {
      roundArray.push(i);
    }
    return roundArray;
  }

  getRandomRoundRange = () => {
    let currentRound = 1;
    if (this.state.trendInfo) {
      currentRound = this.state.trendInfo.lotteryRound - 1;
    }

    let startRound = currentRound - 7 > 1 ? (currentRound - 7) : 1;
    let maxKey = 1;
    if (this.state.lotteryHistory && this.state.lotteryHistory.length > 0 && startRound > 1) {
      for (var i in this.state.lotteryHistory) {
        if (Number(i) > maxKey) {
          maxKey = Number(i);
        }
      }
      startRound = maxKey + 1;
    }

    if (startRound >= currentRound) {
      return [];
    }

    let roundArray = [];
    for (let i = startRound; i < currentRound; i++) {
      roundArray.push(i);
    }
    return roundArray;
  }

  getRandomHistoryStartBlock = () => {
    let startBlock = window.localStorage.getItem('RandomHistoryStartBlock');
    if (startBlock && startBlock.length > 0) {
      return Number(startBlock);
    }

    let defaultStartBlock = 6000000;
    return defaultStartBlock;
  }

  setRandomHistoryStartBlock = (blockNumber) => {
    window.localStorage.setItem('RandomHistoryStartBlock', blockNumber.toString());
  }

  addTransactionHistory = (singleHistory) => {
    const stateHistory = this.state.transactionHistory;
    let history = [];
    if (stateHistory) {
      history = stateHistory.slice();
    }
    history.push(singleHistory);
    this.setState({ transactionHistory: history });
    window.localStorage.setItem('transactionHistory', JSON.stringify(history));
  }

  getTransactionHistory = () => {
    let transactionHistory = window.localStorage.getItem('transactionHistory');
    if (transactionHistory) {
      return JSON.parse(transactionHistory);
    }

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
    let randomHistory = window.localStorage.getItem('randomHistory');
    if (randomHistory) {
      return JSON.parse(randomHistory);
    }

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
      ]
    };
  }

  flushTransactionHistory = () => {

  }

  sendTransaction = async (amount, selectUp) => {
    const { selectedAccount, selectedWallet } = this.props;
    const address = selectedAccount ? selectedAccount.get('address') : null;
    console.log('address:', address);

    const value = new BigNumber(amount).multipliedBy(Math.pow(10, 18)).toString();

    let params = {
      to: lotterySCAddr,
      data: selectUp ? '0xf4ee1fbc0000000000000000000000000000000000000000000000000000000000000001' : '0xf4ee1fbc0000000000000000000000000000000000000000000000000000000000000000',
      value
    };

    try {
      let transactionID = await selectedWallet.sendTransaction(params);
      this.addTransactionHistory({
        key: transactionID,
        time: new Date().format("yyyy-MM-dd hh:mm:ss"),
        address,
        round: this.state.currentRound,
        amount,
        type: selectUp ? 'UP' : 'DOWN',
        result: 'to be settled',
      });
      return transactionID;
    } catch (err) {
      window.assert(err);
      return false;
    }
  }


  render() {
    return (
      <div className={style.app}>
        <div className={style.header}>
          <Wallet title="Wan Game" nodeUrl={window._nodeUrl} />
          <Icon className={style.logo} type="appstore" />
          <div className={style.title}>BTC</div>
          <WalletButton />
        </div>
        <Panel walletButton={WalletButtonLong} trendInfo={this.state.trendInfo} sendTransaction={this.sendTransaction} />
        <TrendHistory trendHistory={this.state.trendHistory} trendInfo={this.state.trendInfo} />
        <TransactionHistory transactionHistory={this.state.transactionHistory} />
        <DistributionHistory lotteryHistory={this.state.lotteryHistory} />
      </div>
    );
  }
}

export default connect(state => ({
  selectedAccount: getSelectedAccount(state),
  selectedWallet: getSelectedAccountWallet(state),
}))(IndexPage);


