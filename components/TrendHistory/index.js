import { Component } from "../base";
import { Icon, Tooltip } from 'antd';
import style from './style.less';

class TrendHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.web3 = props.web3;
  }

  componentDidMount() {
    setTimeout(() => {
      let scr = document.getElementById('scrollView')
      if (scr) {
        scr.scrollLeft = scr.scrollWidth;
      }
    }, 300);
  }

  render() {
    let history = this.props.trendHistory.slice();
    history.push({ round: this.props.trendInfo.round, result: 'waitting', startPrice: this.props.trendInfo.btcPriceStart, endPrice: 'waiting...' });
    const { endLeft } = this.getTimeLeft(this.props.trendInfo);
    return (
      <div className={style.body}>
        <div className={style.title}>
          <Icon type="history" style={{ margin: '6px' }} />
          Trend History
        </div>
        <div className={style.subLine}>
          <div>
            <div className={style.colTitle}>TREND/ROUND</div>
            <div className={style.colLine1}>UP</div>
            <div className={style.colLine1}>DOWN</div>
          </div>
          <div id='scrollView' className={style.scrollHistory + ' ' + style.subLine}>
            {
              history.map((v, i, arr) => {
                let round = v.round.toString().padStart(2, '0');
                let up = v.result === 'up' ? (<div className={style.ball} />) : '';
                let down = v.result === 'down' ? <div className={style.ball} /> : '';
                if (up.length === 0 && down.length === 0) {
                  up = 'In ' + endLeft.h + 'h ' + endLeft.m + 'm';
                  down = 'In ' + endLeft.h + 'h ' + endLeft.m + 'm';
                }
                let info = (<div>Start Price:{v.startPrice}<br />End Price:{v.endPrice}</div>);

                return (
                  <Tooltip title={info}>
                    <div key={i.toString()}>
                      <div className={style.colTitle}>{round}</div>
                      <div className={style.colLine2}>{up}</div>
                      <div className={style.colLine2}>{down}</div>
                    </div>
                  </Tooltip>);
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

export default TrendHistory;

// export default connect(state => ({
//   selectedAccount: getSelectedAccount(state)
// }))(Panel);


