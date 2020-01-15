import { Component } from "../base";
import { Icon } from 'antd';
import style from './style.less';
import SendModal from '../SendModal';

class Panel extends Component {
  constructor(props) {
    super(props);
    this.state = {second: 59, modalVisible: false};
    this.web3 = props.web3;
  }

  componentDidMount() {
    this.timer = setInterval(()=>{this.state.second > 0 ? this.setState({second: this.state.second - 1}):this.setState({second:59})}, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  onUpClick = () => {
    console.log('up click');
    this.type = 'Up';
    this.setState({modalVisible: true});
  }

  onDownClick = () => {
    console.log('down click');
    this.type = 'Down';
    this.setState({modalVisible: true});
  }

  hideModal = () => {
    this.setState({modalVisible: false});
  }

  render() {
    return (
      <div className={style.panel}>
        <div className={style.upButton} onClick={this.onUpClick}>
          <div className={style.btText}><Icon type="arrow-up" style={{ fontSize: '20px', marginRight: '3px' }} />UP</div>
        </div>
        <div className={style.downButton} onClick={this.onDownClick}>
          <div className={style.btText}><Icon type="arrow-down" style={{ fontSize: '20px', marginRight: '3px' }} />DOWN</div>
        </div>
        <div className={style.roundPoolUp}>200 WAN from 200 addresses</div>
        <div className={style.roundPoolDown}>200 WAN from 200 addresses</div>
        <div className={style.rightBlock}>
          <div className={style.firstLine}>
            How do you predict the price trend of WAN-BTC compared with
            <div className={style.subLine}>
              <div className={style.bold}>0.0000240 BTC</div>
              <div>WAN in</div>
              <div className={style.boxText2}>4h</div>
              <div className={style.boxText2}>23m</div>
              <div className={style.boxText2}>{this.state.second}s</div>
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
              <div className={style.poolValue}>9000</div>
              <div className={style.unitText}>WAN</div>
            </div>
          </div>
        </div>
        <div className={style.bottomLine}>
          <Icon type="bulb" style={{ color: '#40DABF', fontSize: '16px' }} />
          <div className={style.bottomText}>Buying in this round will be closed in</div>
          <div className={style.boxText}>2h</div>
          <div className={style.boxText}>25m</div>
          <div className={style.boxText}>{this.state.second}s</div>
        </div>
        <SendModal web3={this.web3} visible={this.state.modalVisible} hideModal={this.hideModal} type={this.type} walletButton={this.props.walletButton}/>
      </div>
    );
  }
}

export default Panel;

// export default connect(state => ({
//   selectedAccount: getSelectedAccount(state)
// }))(Panel);


