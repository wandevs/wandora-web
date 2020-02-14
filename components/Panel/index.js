import { Component } from "../base";
import { Icon, Tooltip, Modal } from 'antd';
import style from './style.less';
import SendModal from '../SendModal';
import PieChart from '../PieChart';

class Panel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endLeft: { h: '0', m: '0', s: '0' },
      buyLeft: { h: '0', m: '0', s: '0' },
      modalVisible: false,
      startTime: 0,
      timeSpan: 0,
      stopBefore: 0,
      btcPriceStart: 0,
      randomPoolAmount: 0,
      upPoolAmount: 0,
      downPoolAmount: 0,
      upAddrCnt: 0,
      downAddrCnt: 0,
      disable: true,
    };
    this.web3 = props.web3;
  }

  componentDidMount() {
    //Update left time
    this.flushData();
    this.timer = setInterval(async () => {
      await this.flushData();
    }, 5000);
  }

  flushData = () => {
    const ret = this.props.trendInfo;

    if (ret && ret.startTime !== 0 && ret.timeSpan !== 0 && ret.stopBefore !== 0 && (ret.startTime < (Date.now() / 1000))) {
      const { endLeft, buyLeft } = this.getTimeLeft(ret);
      if (buyLeft.h === '0' && buyLeft.m === '0') {
        this.setState({
          endLeft,
          buyLeft,
          ...ret,
          disable: true
        });
      } else {
        this.setState({
          endLeft,
          buyLeft,
          ...ret,
          disable: false
        });
      }
    } else {
      this.setState({
        endLeft: this.getLastTime(-1),
        buyLeft: this.getLastTime(-1),
        ...ret,
        disable: true
      })
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  onUpClick = () => {
    this.type = 'Up';
    this.setState({ modalVisible: true });
  }

  onDownClick = () => {
    this.type = 'Down';
    this.setState({ modalVisible: true });
  }

  hideModal = () => {
    this.setState({ modalVisible: false });
  }

  showHelp1 = () => {
    Modal.info({
      title: 'Rules of Up and Down Forecast Game',
      content: (
        <div>
          <p>1) WAN-BTC price rise and fall predicted by users within a certain time;</p>
          <p>2) Buy up or buy down according to the forecast;</p>
          <p>3) 10% of the fund will be accumulated to the random number bonus pool as a service charge;</p>
          <p>4) The remaining 90% shall be allocated according to the proportion of bets. The loser shall receive no reward and the winner shall enjoy all the rewards;</p>
          <p>5) Have the chance to participate in random number lottery regardless of winning or losing;</p>
          <p>6) There is a period of time before the settlement is prohibited betting period.</p>
        </div>
      ),
      onOk() { },
    });
  }

  showHelp2 = () => {
    Modal.info({
      title: 'Rules of Random Lottery Game',
      content: (
        <div>
          <p>1) The handling charge of up and down games is used as the prize pool of random number lottery;</p>
          <p>2) Every few days, only a few people can win the lottery;</p>
          <p>3) The true random number on wanchain is used as the drawing basis;</p>
          <p>4) The probability of winning is directly proportional to the bet amount, and 1 wan coin is taken as a bet;</p>
          <p>5) The winners share the whole prize pool according to the betting rate;</p>
        </div>
      ),
      onOk() { },
    });
  }

  render() {
    const { d, h } = this.getLastTimeDH(Date.now() / 1000 - this.props.trendInfo.randomEndTime);
    return (
      <div className={style.panel}>
        <div className={style.upBlock}>
          <div className={style.pieChart}>
            <PieChart upCnt={this.state.upPoolAmount} downCnt={this.state.downPoolAmount} />
          </div>

          <div className={style.rightBlock}>
            <div className={style.firstLine}>
              How do you predict the price trend of WAN-BTC compared with
            <div className={style.subLine}>
                <div className={style.bold}>{this.state.btcPriceStart} BTC</div>
                <div>WAN in</div>
                <div className={style.boxText2}>{this.state.endLeft.h}h</div>
                <div className={style.boxText2}>{this.state.endLeft.m}m</div>
                {/* <div className={style.boxText2}>{this.state.endLeft.s}s</div> */}
                <div style={{ marginLeft: '10px' }}>later.</div>
                <Tooltip title={"Show Help"}>
                  <Icon type="question-circle" onClick={this.showHelp1} className={style.helpIcon} style={{ margin: '13px', color: 'gray', fontSize: '16px' }} />
                </Tooltip>
              </div>
            </div>
            <div className={style.secondLine}>
              <div className={style.subLine}>
                <div className={style.subLine2}>The total fee in this period {this.props.trendInfo.lotteryRound} （to be distributed after {d} days {h} hours later）</div>
                <Tooltip title={"Show Help"}>
                  <Icon type="question-circle" onClick={this.showHelp2} className={style.helpIcon} style={{ color: 'gray', fontSize: '16px' }} />
                </Tooltip>
              </div>
              <div className={style.subLine}>
                <div className={style.poolValue}>{this.state.randomPoolAmount}</div>
                <div className={style.unitText}>WAN</div>
                {this.state.disable
                  ? <div className={style.upButtonDisable}>
                    <div className={style.btText}><Icon type="arrow-up" style={{ fontSize: '20px', marginRight: '3px' }} />UP</div>
                  </div>
                  : <div className={style.upButton} onClick={this.onUpClick}>
                    <div className={style.btText}><Icon type="arrow-up" style={{ fontSize: '20px', marginRight: '3px' }} />UP</div>
                  </div>
                }
                {this.state.disable
                  ? <div className={style.downButtonDisable}>
                    <div className={style.btText}><Icon type="arrow-down" style={{ fontSize: '20px', marginRight: '3px' }} />DOWN</div>
                  </div>
                  : <div className={style.downButton} onClick={this.onDownClick}>
                    <div className={style.btText}><Icon type="arrow-down" style={{ fontSize: '20px', marginRight: '3px' }} />DOWN</div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
        <div className={style.bottomLine}>
          <Icon type="bulb" style={{ color: '#40DABF', fontSize: '16px' }} />
          <div className={style.bottomText}>Buying in this round will be closed in</div>
          <div className={style.boxText}>{this.state.buyLeft.h}h</div>
          <div className={style.boxText}>{this.state.buyLeft.m}m</div>
          {/* <div className={style.boxText}>{this.state.buyLeft.s}s</div> */}
        </div>

        <SendModal sendTransaction={this.props.sendTransaction} watchTransactionStatus={this.props.watchTransactionStatus} visible={this.state.modalVisible} hideModal={this.hideModal} type={this.type} walletButton={this.props.walletButton} />
      </div>
    );
  }
}

export default Panel;

// export default connect(state => ({
//   selectedAccount: getSelectedAccount(state)
// }))(Panel);


