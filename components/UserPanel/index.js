import { Component } from "../base";
import { Icon, Tooltip } from 'antd';
import style from './style.less';
import smallTitle from '../../img/small-title.png';
import upArrow from '../../img/up-icon.png';
import downArrow from '../../img/down-icon.png';

class UserPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.web3 = props.web3;
  }

  componentDidMount() {

  }

  render() {
    const amountInfo = this.props.lastRoundAmountInfo;
    const lastRoundLotteryInfo = this.props.lastRoundLotteryInfo;
    const totalHistory = this.props.totalHistory;

    return (
      <div className={style.body}>
        <div className={style.title}>
          <Icon type="pie-chart" style={{ margin: '6px' }} />
          Panel
        </div>
        <div className={style.subLine}>
          <div className={style.block}>
            <div className={style.blockHead}><img src={smallTitle} height="15px" width="2px" style={{ marginRight: "12px", marginTop: "-3px" }} />Last Round</div>
            <div className={style.blockBody + ' ' + style.subLine}>
              <div className={style.blockBodyContent}>
                <img src={upArrow} width="6" height="6" style={{ marginRight: "5px" }} />
                {amountInfo.upAmount + " (" + amountInfo.upOdds + ")"}
              </div>
              <div className={style.blockBodyContent} style={{ color: "#E30079" }}>
                <img src={downArrow} width="6" height="6" style={{ marginRight: "5px" }} />
                {amountInfo.downAmount + " (" + amountInfo.downOdds + ")"}
              </div>
            </div>
            <div className={style.blockBottom + ' ' + style.subLine}>
              <div className={style.blockBottomValue}>{amountInfo.expectReturn}</div>
              <div className={style.blockBottomTail}>In Last Round</div>
            </div>
          </div>
          <div className={style.block}>
            <div className={style.blockHead}>
              <img src={smallTitle} height="15px" width="2px" style={{ marginRight: "12px", marginTop: "-3px" }} />
              Last Lottery</div>
            <div className={style.blockBody}>
              <div className={style.subLine}>
                <div className={style.blockBodyContent}>{lastRoundLotteryInfo.eachAmount}</div>
                <div className={style.blockBodyContent} style={{ color: "#E30079" }}>{lastRoundLotteryInfo.winTimes}</div>
              </div>
              <div className={style.subLine}>
                <div className={style.blockBodyTitle}>For Each Address</div>
                <div className={style.blockBodyTitle}>Times To Win Prize</div>
              </div>
            </div>
            <div className={style.blockBottom + ' ' + style.subLine}>
              <div className={style.blockBottomValue} style={{ color: "#2AC9AD" }}>{"+ " + Number(lastRoundLotteryInfo.totalWin).toFixed(2)}</div>
              <div className={style.blockBottomTail}>In Last Round Lottery</div>
            </div>
          </div>
          <div className={style.block}>
            <div className={style.blockHead}>
              <img src={smallTitle} height="15px" width="2px" style={{ marginRight: "12px", marginTop: "-3px" }} />
              History</div>
            <div className={style.blockBody}>
              <div className={style.subLine}>
                <div className={style.blockBodyTitle} style={{margin:"7px 50px 0px 50px"}}>Buying:</div>
                <div className={style.blockBodyContent} style={{ color: "#E30079" }}>
                  {totalHistory.totalBuy}</div>
              </div>
              <div className={style.subLine}>
                <div className={style.blockBodyTitle} style={{margin:"7px 42px 0px 50px"}}>Winning:</div>
                <div className={style.blockBodyContent}>
                  {"+ " + totalHistory.inReturn}</div>
              </div>
              <div className={style.subLine}>
                <div className={style.blockBodyTitle} style={{margin:"7px 48px 0px 50px"}}>Lottery:</div>
                <div className={style.blockBodyContent}>{"+ " + totalHistory.fromLottery}</div>
              </div>
              <div className={style.subLine}>
                <div className={style.blockBodyTitle} style={{margin:"7px 26px 0px 50px"}}>Total Profit:</div>
                <div className={style.blockBodyContent} style={{ color: "#0CA0FE" }}>{"+ " + totalHistory.fromLottery}</div>
              </div>
            </div>
            {/* <div className={style.blockBottom + ' ' + style.subLine}>
              <div className={style.blockBottomTail}>Total Profit:</div>
              <div className={style.blockBottomValue} style={{ color: "#0CA0FE" }}>{totalHistory.totalAmount}</div>
            </div> */}
          </div>
        </div>
      </div>
    );
  }
}

export default UserPanel;

// export default connect(state => ({
//   selectedAccount: getSelectedAccount(state)
// }))(Panel);


