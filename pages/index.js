import { connect } from "react-redux";
import { Component } from "../components/base";
import { Icon, message, Modal } from 'antd';
import BigNumber from 'bignumber.js';
import { Wallet, getSelectedAccount, WalletButton, WalletButtonLong, getSelectedAccountWallet, getTransactionReceipt } from "wan-dex-sdk-wallet";
import "wan-dex-sdk-wallet/index.css";
import lotteryAbi from "./abi/lottery";
import style from './style.less';
import Panel from '../components/Panel';
import TrendHistory from '../components/TrendHistory';
import TransactionHistory from '../components/TransactionHistory';
import DistributionHistory from '../components/DistributionHistory';
import sleep from 'ko-sleep';

const lotterySCAddr = '0x0411d36b9b54890c5d697f33d76b31a4f7e83d95';

var Web3 = require("web3");

let debugStartTime = (Date.now() / 1000)

function alertAntd(info) {
  if (typeof (info) === "string" && !info.includes('Error')) {
    message.success(info, 10);
  } else {
    if (info.toString().includes("Error")) {
      message.error(info.toString(), 10);
    } else if (info.hasOwnProperty('tip')) {
      message.info(info.tip, 5);
    } else {
      message.info(JSON.stringify(info), 10);
    }
  }
}

class IndexPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    // window._nodeUrl = "https://demodex.wandevs.org:48545";
    window._nodeUrl = "https://mywanwallet.io/testnet";

    window.alertAntd = alertAntd;

    let trendStr = window.localStorage.getItem('currentTrend');
    let trend = null;
    if (trendStr) {
      trend = JSON.parse(trendStr);
    } else {
      trend = {
        round: 0,
        startTime: debugStartTime,
        timeSpan: 3600 * 12,
        stopBefore: 3600 * 2,
        btcPriceStart: 0,
        randomPoolAmount: 0,
        upPoolAmount: 0,
        downPoolAmount: 0,
        lotteryRound: 0,
      };
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

    window.debugState = this.state;

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

  async componentDidMount() {
    var web3 = new Web3();
    web3.setProvider(new Web3.providers.HttpProvider(window._nodeUrl));
    this.web3 = web3;
    this.lotterySC = new this.web3.eth.Contract(lotteryAbi, lotterySCAddr);


    await this.getOnce();
    await this.updateTrendInfoFromNode();
    this.timerTrendInfo = setInterval(this.updateTrendInfoFromNode, 5000);

    this.timerTrendHistory = setInterval(this.updateTrendHistoryFromNode, 60 * 1000);
    this.timerTrendHistory = setInterval(this.flushTransactionHistory, 100 * 1000);
  }

  componentWillUnmount() {
    if (this.timerTrendInfo) {
      clearInterval(this.timerTrendInfo);
    }

    if (this.timerTrendHistory) {
      clearInterval(this.timerTrendHistory);
    }
  }

  setTrendInfo = (trendInfo) => {
    let stateTrend = JSON.stringify(this.state.trendInfo);
    let inComeTrend = JSON.stringify(trendInfo);
    if (stateTrend !== inComeTrend) {
      this.setState({ trendInfo });
      window.localStorage.setItem('currentTrend', inComeTrend);
    }
  }

  getOnce = async () => {
    let trend = {
      round: 0,
      startTime: debugStartTime,
      timeSpan: 0,
      stopBefore: 0,
      btcPriceStart: 0,
      randomPoolAmount: 0,
      upPoolAmount: 0,
      downPoolAmount: 0,
      lotteryRound: 0,
      randomEndTime: 0,
    };
    let lotterySC = this.lotterySC;

    let awaitArray = [];
    awaitArray.push(lotterySC.methods.curUpDownRound().call());
    awaitArray.push(lotterySC.methods.curRandomRound().call());
    awaitArray.push(lotterySC.methods.gameStartTime().call());
    awaitArray.push(lotterySC.methods.upDownLotteryTimeCycle().call());
    awaitArray.push(lotterySC.methods.feeRatio().call());
    awaitArray.push(lotterySC.methods.upDownLtrstopTimeSpanInAdvance().call());
    awaitArray.push(lotterySC.methods.randomLotteryTimeCycle().call());

    [
      trend.round,
      trend.lotteryRound,
      trend.gameStartTime,
      trend.timeSpan,
      trend.feeRatio,
      trend.stopBefore,
      trend.randomTimeCycle,
    ] = await Promise.all(awaitArray);

    trend.round = Number(trend.round);
    trend.lotteryRound = Number(trend.lotteryRound);
    trend.gameStartTime = Number(trend.gameStartTime);
    trend.timeSpan = Number(trend.timeSpan);
    trend.feeRatio = Number(trend.feeRatio);
    trend.stopBefore = Number(trend.stopBefore);
    trend.randomTimeCycle = Number(trend.randomTimeCycle);

    awaitArray = []
    awaitArray.push(lotterySC.methods.updownGameMap(trend.round).call());
    awaitArray.push(lotterySC.methods.randomGameMap(trend.lotteryRound).call());
    awaitArray.push(lotterySC.methods.extraPrizeMap(trend.lotteryRound).call());


    let [roundInfo, randomInfo, extraPrice] = await Promise.all(awaitArray);


    trend.startTime = trend.round * trend.timeSpan + trend.gameStartTime;
    trend.btcPriceStart = Number(roundInfo.openPrice) / 1e8;
    trend.upPoolAmount = Number(roundInfo.upAmount) / 1e18;
    trend.downPoolAmount = Number(roundInfo.downAmount) / 1e18;
    trend.randomPoolAmount = ((Number(randomInfo.stakeAmount)) / 1e18 * (trend.feeRatio / 1000) + Number(extraPrice) / 1e18).toFixed(1);
    trend.randomEndTime = Number((trend.lotteryRound + 1) * trend.randomTimeCycle) + Number(trend.gameStartTime);
    this.setTrendInfo(trend);
    this.flushTransactionHistory();
  }

  updateTrendInfoFromNode = async () => {
    let trend = Object.assign({}, this.state.trendInfo);
    let lotterySC = this.lotterySC;
    let roundOld = trend.round;

    let awaitArray = [];
    awaitArray.push(lotterySC.methods.curUpDownRound().call());
    awaitArray.push(lotterySC.methods.curRandomRound().call());
    awaitArray.push(lotterySC.methods.updownGameMap(trend.round).call());
    awaitArray.push(lotterySC.methods.randomGameMap(trend.lotteryRound).call());
    awaitArray.push(lotterySC.methods.extraPrizeMap(trend.lotteryRound).call());

    let roundInfo = {};
    let randomInfo = {};
    let extraPrice = 0;

    [trend.round, trend.lotteryRound, roundInfo, randomInfo, extraPrice] = await Promise.all(awaitArray);

    trend.round = Number(trend.round);
    trend.lotteryRound = Number(trend.lotteryRound);

    trend.startTime = trend.round * trend.timeSpan + trend.gameStartTime;
    trend.btcPriceStart = Number(roundInfo.openPrice) / 1e8;
    trend.upPoolAmount = Number(roundInfo.upAmount) / 1e18;
    trend.downPoolAmount = Number(roundInfo.downAmount) / 1e18;
    trend.randomPoolAmount = ((Number(randomInfo.stakeAmount)) / 1e18 * (trend.feeRatio / 1000) + Number(extraPrice) / 1e18).toFixed(1);
    trend.randomEndTime = Number((trend.lotteryRound + 1) * trend.randomTimeCycle) + Number(trend.gameStartTime);

    this.setTrendInfo(trend);
    this.updateTrendHistoryFromNode();
    this.updateRandomHistoryFromNode();
    if (roundOld != trend.round) {
      this.flushTransactionHistory();
    }
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
      let trendHistory = this.state.trendHistory.slice();
      if (!trendHistory[0]) {
        trendHistory = [];
      }

      let roundArray = this.getUpDownRoundRange();

      if (roundArray.length === 0) {
        return;
      }

      let lotterySC = this.lotterySC;

      for (let i = 0; i < roundArray.length; i++) {
        let ret = await lotterySC.methods.updownGameMap(roundArray[i]).call();
        trendHistory.push({
          round: roundArray[i],
          startPrice: ret.openPrice / 1e8,
          endPrice: ret.closePrice / 1e8,
          result: (ret.openPrice > ret.closePrice) ? 'down' : (ret.openPrice < ret.closePrice) ? 'up' : 'draw',
          upAmount: ret.upAmount / 1e18,
          downAmount: ret.downAmount / 1e18,
          feeTotal: (ret.upAmount / 1e18 + ret.downAmount / 1e18) * this.state.trendInfo.feeRatio / 1000,
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
    const stateHistory = Object.assign({}, this.state.lotteryHistory);
    let history = {};
    if (stateHistory) {
      history = stateHistory;
    }
    for (var i in randomHistories) {
      history[i] = randomHistories[i];
    }
    this.setState({ lotteryHistory: history });
    window.localStorage.setItem('randomHistory', JSON.stringify(history));
  }

  updateRandomHistoryFromNode = async () => {
    try {
      let randomHistories = {};
      const { selectedAccount } = this.props;
      const address = selectedAccount ? selectedAccount.get('address') : null;

      let roundArray = this.getRandomRoundRange();
      if (roundArray.length === 0) {
        return;
      }

      let lotterySC = this.lotterySC;
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
          let block = await this.web3.eth.getBlock(events[i].blockNumber);
          randomHistories[events[i].returnValues.round].push({
            blockNumber: events[i].blockNumber,
            time: (new Date(Number(block.timestamp) * 1000)).format("yyyy-MM-dd hh:mm:ss"),
            round: events[i].returnValues.round,
            address: events[i].returnValues.staker.toLowerCase(),
            amountBuy: '--',
            amountPay: (Number(events[i].returnValues.prizeAmount) / 1e18).toFixed(2),
          });

          if (address.toLowerCase() === events[i].returnValues.staker.toLowerCase()) {
            let txHistory = this.getTransactionHistory();
            let bHave = false;
            for (let h =0; h<txHistory.length; h++) {
              if (txHistory[h].type.toLowerCase() == 'distribute' && txHistory[h].round == events[i].returnValues.round) {
                bHave = true;
                break;
              }
            }
            if (!bHave) {
              this.addTransactionHistory({
                key: events[i].transactionHash,
                time: (new Date(Number(block.timestamp) * 1000)).format("yyyy-MM-dd hh:mm:ss"),
                address: address.toLowerCase(),
                round: events[i].returnValues.round,
                amount: (Number(events[i].returnValues.prizeAmount) / 1e18).toFixed(2),
                type: 'Distribute',
                result: 'Done',
              });
            }
          }
        }
        this.addRandomHistory(randomHistories);
      }

      this.setRandomHistoryStartBlock(blockNumber);
    } catch (err) {
      console.log(err);
    }
  }

  getUpDownRoundRange = () => {
    let currentRound = 0;
    if (this.state.trendInfo) {
      currentRound = this.state.trendInfo.round;
    }

    let startRound = currentRound - 29 > 0 ? (currentRound - 29) : 0;
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
    let currentRound = 0;
    if (this.state.trendInfo) {
      currentRound = this.state.trendInfo.lotteryRound;
    }

    let startRound = currentRound - 7 > 0 ? (currentRound - 7) : 0;
    let maxKey = 1;
    if (this.state.lotteryHistory && this.state.lotteryHistory.length > 0 && startRound > 0) {
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

    return [];
  }

  getLotteryHistory = () => {
    let randomHistory = window.localStorage.getItem('randomHistory');
    if (randomHistory) {
      return JSON.parse(randomHistory);
    }

    return {};
  }

  flushTransactionHistory = async () => {
    if (!this.getDataWait(() => { return this.state.trendInfo })) {
      return;
    }

    if (!this.getDataWait(() => { return this.state.trendHistory })) {
      return;
    }

    let history = this.getTransactionHistory();
    let length = history.length;
    let bChanged = false;
    for (let i = 0; i < length; i++) {
      if (history[i].result === 'To be settled') {
        if ((history[i].type.toLowerCase() === 'up' || history[i].type.toLowerCase() === 'down')
          && history[i].round < this.state.trendInfo.round) {
          for (let m = 0; m < this.state.trendHistory.length; m++) {
            if (this.state.trendHistory[m].round == history[i].round) {
              if ((history[i].type.toLowerCase() == this.state.trendHistory[m].result) || (this.state.trendHistory[m].result === 'draw')) {
                history.push({
                  key: history[i].key + '_return',
                  time: new Date().format("yyyy-MM-dd hh:mm:ss"),
                  address: history[i].address,
                  round: history[i].round,
                  amount: this.getPayAmount(-1 * (history[i].amount), this.state.trendHistory[m]),
                  type: 'Return',
                  result: 'Done',
                })
              }
              history[i].result = 'Done';
              bChanged = true;
              break;
            }
          }
        }
      }
    }

    if (bChanged) {
      this.setState({ transactionHistory: history });
      window.localStorage.setItem('transactionHistory', JSON.stringify(history));
    }
  }

  getPayAmount = (amount, trendHistoryOne) => {
    if (trendHistoryOne.result === 'draw') {
      return amount * 0.9
    }

    if (trendHistoryOne.result === 'up') {
      let value = (trendHistoryOne.upAmount + trendHistoryOne.downAmount) * 0.9 / trendHistoryOne.upAmount * amount;
      return Number(value.toFixed(1))
    }

    if (trendHistoryOne.result === 'down') {
      let value = (trendHistoryOne.upAmount + trendHistoryOne.downAmount) * 0.9 / trendHistoryOne.downAmount * amount;
      return Number(value.toFixed(1))
    }
    return 0
  }

  getDataWait = async (dataFunc) => {
    let max = 60;
    let i = 0;
    while (i < max) {
      if (dataFunc()) {
        return dataFunc();
      }
      await sleep(1000);
      i++;
    }
    return undefined
  }

  watchTransactionStatus = (txID, callback) => {
    const getTransactionStatus = async () => {
      const tx = await getTransactionReceipt(txID);
      if (!tx) {
        window.setTimeout(() => getTransactionStatus(txID), 3000);
      } else if (callback) {
        callback(Number(tx.status) === 1);
      } else {
        window.alertAntd('success');
      }
    };
    window.setTimeout(() => getTransactionStatus(txID), 3000);
  };

  estimateSendGas = async (value, selectUp) => {
    let lotterySC = this.lotterySC;
    try {
      let ret = await lotterySC.methods.stakeIn(selectUp).estimateGas({ gas: 10000000, value })
      if (ret == 10000000) {
        return -1;
      }
      return '0x' + (ret + 30000).toString(16);
    } catch (err) {
      console.log(err);
      return -1;
    }
  }

  sendTransaction = async (amount, selectUp) => {
    const { selectedAccount, selectedWallet } = this.props;
    const address = selectedAccount ? selectedAccount.get('address') : null;

    const value = new BigNumber(amount).multipliedBy(Math.pow(10, 18)).toString();

    let params = {
      to: lotterySCAddr,
      data: selectUp ? '0xf4ee1fbc0000000000000000000000000000000000000000000000000000000000000001' : '0xf4ee1fbc0000000000000000000000000000000000000000000000000000000000000000',
      value,
      gasPrice: "0x29E8D60800",
      gasLimit: "0x87A23",
    };

    params.gasLimit = await this.estimateSendGas(value, selectUp);
    if (params.gasLimit == -1) {
      window.alertAntd('Estimate Gas Error. Maybe out of time range.');
      return false;
    }

    try {
      let transactionID = await selectedWallet.sendTransaction(params);
      let round = this.state.trendInfo.round;
      this.watchTransactionStatus(transactionID, (ret) => {
        if (ret) {
          this.addTransactionHistory({
            key: transactionID,
            time: new Date().format("yyyy-MM-dd hh:mm:ss"),
            address,
            round,
            amount: amount * -1,
            type: selectUp ? 'Up' : 'Down',
            result: 'To be settled',
          });
        }
      });

      return transactionID;
    } catch (err) {
      console.log(err);
      window.alertAntd(err);
      return false;
    }
  }

  showGameRule = () => {
    window.open("https://github.com/wandevs/wan-game/blob/master/GameRule.md"); 
  }

  render() {
    return (
      <div className={style.app}>
        <div className={style.header}>
          <Wallet title="Wan Game" nodeUrl={window._nodeUrl} />
          <Icon className={style.logo} type="appstore" />
          <div className={style.title}>Wandora Box</div>
          <div className={style.gameRule} onClick={this.showGameRule}>Game Rule</div>
          <WalletButton />
        </div>
        <Panel walletButton={WalletButtonLong} trendInfo={this.state.trendInfo} sendTransaction={this.sendTransaction} watchTransactionStatus={this.watchTransactionStatus} />
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





