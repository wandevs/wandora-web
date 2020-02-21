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
      nextStart: {h: '0', m: '0', s: '0'},
      nextEnd: '00:00',
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

    if (ret && ret.startTime !== 0 && ret.timeSpan !== 0 && ret.stopBefore !== 0 && (ret.startTime < ret.chainEndTime)) {
      const { endLeft, buyLeft, nextStart, nextEnd } = this.getTimeLeft(ret);
      if (buyLeft.h == 0 && buyLeft.m == 0) {
        this.setState({
          endLeft,
          buyLeft,
          nextStart,
          nextEnd,
          ...ret,
          disable: true
        });
      } else {
        this.setState({
          endLeft,
          buyLeft,
          nextStart,
          nextEnd,
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
          <p>1) Users predict whether the price of WAN/BTC will rise or fall within a time period.</p>
          <p>2) Users can place a bet on whether the price will go up or down within the period.</p>
          <p>3) 10% of the funds bet will be pooled in a rewards pot to be rewarded to several lucky users who participated in the game.</p>
          <p>4) The remaining 90% shall be divided amongst the winners in each period. Losers will receive nothing and winners will receive an amount equal to the proportion of their bet vs the total amount of all winning bets.</p>
          <p>5) Regardless of winning or losing the. Up/Down bet, all players have a chance of winning the rewards pot.</p>
          <p>6) Last bets must be placed 2 hours before the period begins.</p>
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
          <p>1) 10% of each bet is intered into a rewards pot to be paid out to one user at random.</p>
          <p>2) Each few days there will be several winners.</p>
          <p>3) Wanchain's on chain random number generation will be used to decide the winners.</p>
          <p>4) The probability of winning is directly proportional to the amount bet with 1 WAN counting as 1 bet.</p>
          <p>5) The winners share the whole rewards pot according to their betting ratio.</p>
        </div>
      ),
      onOk() { },
    });
  }

  render() {
    const { d, h } = this.getLastTimeDH(Number(this.props.trendInfo.randomEndTime) - this.props.trendInfo.chainEndTime);
    return (
      <div className={style.panel}>
        <div className={style.upBlock}>
          <div className={style.pieChart}>
            <PieChart upCnt={this.state.upPoolAmount} downCnt={this.state.downPoolAmount} />
          </div>

          <div className={style.rightBlock}>
            <div className={style.firstLine}>
              <div className={style.subLine}>
                <div>The price of WAN at the end of the last round was </div>
                <div className={style.bold}>{this.state.btcPriceStart} BTC</div>
                <div>{' / WAN.'}</div>
              </div>
              <div className={style.subLine}>
                <div>Place your predict whether the price will go up or down after</div>
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
                <div className={style.subLine2}>The total prize pot in this period {this.props.trendInfo.lotteryRound} （to be distributed after {d} days {h} hours later）</div>
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
          <span />
          <div className={style.bottomText}>The next round begins in</div>
          <div className={style.boxText}>{this.state.nextStart.h}h</div>
          <div className={style.boxText}>{this.state.nextStart.m}m</div>
          <div className={style.bottomText}> and ends at {this.state.nextEnd}.</div>
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


