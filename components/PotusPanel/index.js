import { Component } from "../base";
import { Icon, Tooltip, Modal, Spin } from 'antd';
import style from './style.less';
import SendModal from '../SendModal';
import PieChart from '../PieChartPotus';
import upArrow from '../../img/up-icon.png';
import downArrow from '../../img/down-icon.png';
import bigUpArrow from '../../img/big-up-arrow.png';
import bigDownArrow from '../../img/big-down-arrow.png';

class PotusPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endLeft: { h: '0', m: '0', s: '0' },
      buyLeft: { h: '0', m: '0', s: '0' },
      nextStart: { h: '0', m: '0', s: '0' },
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
          <p>1. Users predict whether the price of WAN/BTC will rise or fall within a time period (8 hours).</p>
          <p>2. Users can place a bet on whether the price will go up or down within the first 6 hours of the period.</p>
          <p>3. Betting is closed 2 hours before the end of the period.</p>
          <p>4. If the price rises during the 8 hour period, users who bet "UP" win, if the price falls during the period, users who bet "DOWN" win.</p>
          <p>5. The losing side's bets are distributed to the winning side in proportion to the size of each individual's bet vs the total bets for the winning side.</p>
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
          <p>1. 10% of the each bet will be pooled in a prize pot to be rewarded once per 3 days to 20 lucky users who participated in the game.</p>
          <p>2. The remaining 90% shall be divided amongst the winners in each period. Losers will receive nothing and winners will receive an amount equal to the proportion of their bet vs the total amount of all winning bets. </p>
          <p>3. Regardless of winning or losing the Up/Down bet, all players have a chance of winning the prize pot.</p>
          <p>4. Wanchain's on chain random number generation will be used to decide the prize pot winners.</p>
        </div>
      ),
      onOk() { },
    });
  }

  render() {
    const { d, h } = this.getLastTimeDH(Number(this.props.trendInfo.randomEndTime) - this.props.trendInfo.chainEndTime);
    let distrbuteText = "To be distributed after " + d + " days " + h + " hours";
    if (d == 0 && h == 0) {
      distrbuteText = "(To be distributed in 1 hours)"
    }
    return (
      <div className={style.panel}>
        <Spin size="large" tip="The contract is being settled, please hold on..." spinning={this.state.endLeft.h == 0 && this.state.endLeft.m == 0}>
          <div className={style.upBlock}>
            <div className={style.pieChart}>
              <PieChart upCnt={this.state.upPoolAmount} downCnt={this.state.downPoolAmount} upName={"Trump"} downName={"Biden"} />
            </div>
            <div className={style.middleBlock}>
              <div className={style.middleBlockText}>Return Rate</div>
              <div className={style.middleBlockContent}>
                <img src={upArrow} width="6" height="6" style={{ marginRight: "5px" }} />
                {this.props.amountInfo.upOdds}
              </div>
              <div className={style.middleBlockContent} style={{ color: "#E30079" }}>
                <img src={downArrow} width="6" height="6" style={{ marginRight: "5px" }} />
                {this.props.amountInfo.downOdds}
              </div>
              <div className={style.middleBlockText} style={{marginTop:"20px"}}>My Prediction</div>
              <div className={style.middleBlockContent}>
                <img src={upArrow} width="6" height="6" style={{ marginRight: "5px" }} />
                {this.props.amountInfo.upAmount + " (" + (Number(this.props.amountInfo.upAmount) * Number(this.props.amountInfo.upOdds)).toFixed(2) + ")"}
              </div>
              <div className={style.middleBlockContent} style={{ color: "#E30079" }}>
                <img src={downArrow} width="6" height="6" style={{ marginRight: "5px" }} />
                {this.props.amountInfo.downAmount + " (" + (Number(this.props.amountInfo.downAmount) * Number(this.props.amountInfo.downOdds)).toFixed(2) + ")"}
              </div>
              {/* <div className={style.middleBlockText}>Expected Return</div>
              <div className={style.middleBlockContent} style={{ color: "#0CA0FE" }}>
                {this.props.amountInfo.expectReturn}
              </div> */}
            </div>

            <div className={style.rightBlock}>
              <div className={style.firstLine}>
                <div className={style.subLine}>
                  <div>Who will win the presidental election of USA, 2020 ?</div>
                </div>
                <div className={style.subLine}>
                  <div>
                    Place your prediction before 00:00 UTC, 3th Nov. 2020
                  </div>
                  {/* <div className={style.boxText2}>{this.state.endLeft.s}s</div> */}
                  {/* <Tooltip title={"Show Help"}>
                    <Icon type="question-circle" onClick={this.showHelp1} className={style.helpIcon} style={{ margin: '13px', color: 'gray', fontSize: '16px' }} />
                  </Tooltip> */}
                </div>
              </div>
              <div className={style.secondLine}>
                <div className={style.subLine}>
                  <div className={style.btnCont}>
                    {this.state.disable
                      ? <div className={style.upButtonDisable}>
                        <div className={style.btText}>Trump</div>
                      </div>
                      : <div className={style.upButton} onClick={this.onUpClick}>
                        <div className={style.btText}>Trump</div>
                      </div>
                    }
                    {this.state.disable
                      ? <div className={style.downButtonDisable}>
                        <div className={style.btText}>Biden</div>
                      </div>
                      : <div className={style.downButton} onClick={this.onDownClick}>
                        <div className={style.btText}>Biden</div>
                      </div>
                    }
                  </div>
                  {/* { Number(this.state.randomPoolAmount) > 0 ?
                  (<div>
                    <div className={`${style.subLine} ${style.mobileSubLine}`}>
                      <div className={style.poolValue}>{this.state.randomPoolAmount}</div>
                      <div className={style.unitText}>WAN</div>
                    </div>
                    <div className={style.mobileText} style={{ margin: "26px 0px 0px 100px" }}>
                      <div className={style.subLine}>
                        <div className={style.subLine2}>The total lottery pool in this period.</div>
                      </div>
                      <div className={style.subLine2}>{distrbuteText}</div>
                    </div>
                  </div>)
                  :null} */}
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
            
          </div>
        </Spin>
        <SendModal sendTransaction={this.props.sendTransaction} watchTransactionStatus={this.props.watchTransactionStatus} visible={this.state.modalVisible} hideModal={this.hideModal} type={this.type} walletButton={this.props.walletButton} />
      </div>
    );
  }
}

export default PotusPanel;

// export default connect(state => ({
//   selectedAccount: getSelectedAccount(state)
// }))(Panel);


