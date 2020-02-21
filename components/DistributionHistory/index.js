import { Component } from "../base";
import { Icon, Table, Select } from 'antd';
import style from './style.less';

const { Option } = Select;

class DistributionHistory extends Component {
  constructor(props) {
    super(props);
    this.state = { dataSource: [], options:[] };
    this.web3 = props.web3;
  }

  dataAll = {}

  componentDidMount() {
    this.updateData();
  }

  infoSelection = {};

  updateData = () => {
    let dataArray = {};
    let defaultData = null;
    this.infoSelection = {};
    for (var i in this.props.lotteryHistory) {
      let info = this.props.lotteryHistory[i];
      if (info && info.length > 0) {
        defaultData = info;

        let time = new Date(info[0].time);
        let dateStrs = time.toDateString().split(' ');
        let dateStr = dateStrs[1] + ' ' + dateStrs[3];
        if (!dataArray[dateStr]) {
          dataArray[dateStr] = {};
          dataArray[dateStr].count = 0;
        }

        dataArray[dateStr].count++;
        let title = dataArray[dateStr].count + 'th ' + dateStr;
        this.infoSelection[title] = info;
      }
    }
    let options = []
    for (var title in this.infoSelection) {
      options.push({value:title});
    }
    if (defaultData) {
      this.setState({options:options.slice().reverse(), dataSource: defaultData});
    }

    setTimeout(this.updateData, 30000);
  }

  columns = [
    {
      title: 'TIME',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'ADDRESS',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'BLOCK NUMBER',
      dataIndex: 'blockNumber',
      key: 'blockNumber',
    },
    {
      title: 'AMOUNT TO BE DISTRIBUTED',
      dataIndex: 'amountPay',
      key: 'amountPay',
    },
  ]

  selectChange = (value) => {
    this.setState({dataSource: this.infoSelection[value]});
  }

  render() {
    let addressCnt = this.state.dataSource.length;
    let totalFee = 0;
    for (let i=0; i<this.state.dataSource.length; i++) {
      totalFee += Number(this.state.dataSource[i].amountPay)
    }
    let defaultSelect = this.state.options.length > 0 ? this.state.options[0].value:undefined;
    return (
      <div className={style.body}>
        <div className={style.title + ' ' + style.subLine}>
          <Icon type="history" className={style.logo} />
          <div className={style.subTitle}>Distribution History</div>
          <Select className={style.subSelect} defaultValue={defaultSelect} onChange={this.selectChange}>
            {
              this.state.options.map((v,i) => {
                return (<Option value={v.value} key={v.value}>{v.value}</Option>);
              })
            }
          </Select>
          
          
          <div className={style.rightText}>Address Count: {addressCnt}</div>
          {/* <div className={style.rightText}>Amount: N/A WAN</div> */}
          <div className={style.rightText}>Total Fee: {totalFee.toFixed(1)} WAN</div>
        </div>
        <Table columns={this.columns} dataSource={this.state.dataSource} pagination={{ pageSize: 4 }}/>
      </div>
    );
  }
}

export default DistributionHistory;

// export default connect(state => ({
//   selectedAccount: getSelectedAccount(state)
// }))(Panel);


