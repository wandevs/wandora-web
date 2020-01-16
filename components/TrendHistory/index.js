import { Component } from "../base";
import { Icon } from 'antd';
import style from './style.less';

class TrendHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.web3 = props.web3;
  }

  componentDidMount() {
    setTimeout(()=>{
      let scr = document.getElementById('scrollView')
      if (scr) {
        scr.scrollLeft = scr.scrollWidth;
      }
    }, 300);
  }

  testHistory = [
    { round: 1, result: "up" },
    { round: 2, result: "down" },
    { round: 3, result: "up" },
    { round: 4, result: "up" },
    { round: 5, result: "down" },
    { round: 6, result: "up" },
    { round: 7, result: "up" },
    { round: 8, result: "down" },
    { round: 9, result: "up" },
    { round: 10, result: "up" },
    { round: 11, result: "up" },
    { round: 12, result: "down" },
    { round: 13, result: "up" },
    { round: 14, result: "up" },
    { round: 15, result: "down" },
    { round: 16, result: "down" },
    { round: 17, result: "up" },
    { round: 18, result: "up" },
    { round: 19, result: "down" },
    { round: 20, result: "up" },
    { round: 21, result: "waiting..." },
  ]

  render() {
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
              this.testHistory.map((v, i, arr)=>{
                let round = v.round.toString().padStart(2, '0');
                let up = v.result === 'up' ? (<div className={style.ball}/>) : '';
                let down = v.result === 'down' ? <div className={style.ball}/> : '';
                if (up.length === 0 && down.length === 0) {
                  up = 'In 4h 3m';
                  down = 'In 4h 3m';
                }

                return(<div key={i.toString()}>
                  <div className={style.colTitle}>{round}</div>
                  <div className={style.colLine2}>{up}</div>
                  <div className={style.colLine2}>{down}</div>
                </div>);
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


