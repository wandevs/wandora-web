import { Component } from "../base";
import { Icon } from 'antd';
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

  flushData = async () => {
    let ret = await this.getDataFromNode()
    this.setState(ret);

    if (this.state.startTime !== 0 && this.state.timeSpan !== 0 && this.state.stopBefore !== 0) {
      this.setState({
        endLeft: this.getLastTime((this.state.startTime + this.state.timeSpan) - Date.now() / 1000),
        buyLeft: this.getLastTime((this.state.startTime + this.state.timeSpan - this.state.stopBefore) - Date.now() / 1000),
      })
      this.setState({ disable: false });
    } else {
      this.setState({
        endLeft: this.getLastTime(-1),
        buyLeft: this.getLastTime(-1),
      })
    }
  }

  getDataFromNode = async () => {
    //Demo data
    return {
      startTime: 1579238136,
      timeSpan: 3600*12,
      stopBefore: 3600*2,
      btcPriceStart: 0.0000241,
      randomPoolAmount: 9873.1234,
      upPoolAmount: 4351,
      downPoolAmount: 2321,
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  getLastTime(leftTimeSecond) {
    if (leftTimeSecond < 0) {
      return { h: '0', m: '0', s: '0' }
    }

    let h = Math.floor(leftTimeSecond / 60 / 60);
    let m = Math.floor(leftTimeSecond / 60 % 60);
    let s = Math.floor(leftTimeSecond % 60);
    console.log({ h, m, s })
    return { h, m, s }
  }

  onUpClick = () => {
    console.log('up click');
    this.type = 'Up';
    this.setState({ modalVisible: true });
  }

  onDownClick = () => {
    console.log('down click');
    this.type = 'Down';
    this.setState({ modalVisible: true });
  }

  hideModal = () => {
    this.setState({ modalVisible: false });
  }

  render() {
    return (
      <div className={style.panel}>
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
        <div className={style.rightBlock}>
          <div className={style.firstLine}>
            How do you predict the price trend of WAN-BTC compared with
            <div className={style.subLine}>
              <div className={style.bold}>{this.state.btcPriceStart.toFixed(7)} BTC</div>
              <div>WAN in</div>
              <div className={style.boxText2}>{this.state.endLeft.h}h</div>
              <div className={style.boxText2}>{this.state.endLeft.m}m</div>
              <div className={style.boxText2}>{this.state.endLeft.s}s</div>
              <div style={{ marginLeft: '10px' }}>later.</div>
              <Icon type="question-circle" style={{ margin: '13px', color: 'gray', fontSize: '16px' }} />
            </div>
          </div>
          <div className={style.secondLine}>
            <div className={style.subLine}>
              <div className={style.subLine2}>The total fee in this period9 （to be distributed after 4 days 3 hours later）</div>
              <Icon type="question-circle" style={{ color: 'gray', fontSize: '16px' }} />
            </div>
            <div className={style.subLine}>
              <div className={style.poolValue}>{this.state.randomPoolAmount.toFixed(0)}</div>
              <div className={style.unitText}>WAN</div>
            </div>
          </div>
        </div>
        <div className={style.bottomLine}>
          <Icon type="bulb" style={{ color: '#40DABF', fontSize: '16px' }} />
          <div className={style.bottomText}>Buying in this round will be closed in</div>
          <div className={style.boxText}>{this.state.buyLeft.h}h</div>
          <div className={style.boxText}>{this.state.buyLeft.m}m</div>
          <div className={style.boxText}>{this.state.endLeft.s}s</div>
        </div>
        <div className={style.pieChart}>
          <PieChart upCnt={this.state.upPoolAmount} downCnt={this.state.downPoolAmount} />
        </div>
        <SendModal web3={this.web3} visible={this.state.modalVisible} hideModal={this.hideModal} type={this.type} walletButton={this.props.walletButton} />
      </div>
    );
  }
}

export default Panel;

// export default connect(state => ({
//   selectedAccount: getSelectedAccount(state)
// }))(Panel);


