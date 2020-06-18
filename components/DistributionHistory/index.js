import { Component } from "../base";
import { Icon, Table, Select, Spin } from 'antd';
import style from './style.less';

const { Option } = Select;

class DistributionHistory extends Component {
  constructor(props) {
    super(props);
    this.state = { dataSource: [], options: [], selectIndex: 0 };
    this.web3 = props.web3;
  }

  dataAll = {}

  componentDidMount() {
    this.updateData();
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
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
        let time;
        if (info[0].time) {
          time = new Date(info[0].time);
        } else {
          time = new Date(Date.now());
        }

        let dateStrs = time.toDateString().split(' ');
        if (dateStrs[0] === "Invalid") {
          time = new Date(Date.now());
          dateStrs = time.toDateString().split(' ');
        }
        console.log('dateStrs', dateStrs, info[0].time);

        let dateStr = dateStrs[1] + ' ' + dateStrs[3];
        if (!dataArray[dateStr]) {
          dataArray[dateStr] = {};
          dataArray[dateStr].count = 0;
        }

        dataArray[dateStr].count++;
        let title = dataArray[dateStr].count + 'th ' + dateStr;
        if (dataArray[dateStr].count == 1) {
          title = dataArray[dateStr].count + 'st ' + dateStr;
        }
        if (dataArray[dateStr].count == 2) {
          title = dataArray[dateStr].count + 'nd ' + dateStr;
        }
        if (dataArray[dateStr].count == 3) {
          title = dataArray[dateStr].count + 'rd ' + dateStr;
        }
        this.infoSelection[title] = info;
      }
    }
    let options = []
    for (var title in this.infoSelection) {
      options.push({ value: title });
    }
    if (defaultData) {
      this.setState({ options: options.slice().reverse(), dataSource: defaultData, selectIndex: 0 });
    }

    this.timer = setTimeout(this.updateData, 30000);
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
    this.setState({ dataSource: this.infoSelection[this.state.options[value].value], selectIndex: value });
  }

  render() {
    let addressCnt = this.state.dataSource.length;
    let totalFee = 0;
    for (let i = 0; i < this.state.dataSource.length; i++) {
      totalFee += Number(this.state.dataSource[i].amountPay)
    }

    const spinning = this.props.spinning;
    // let defaultSelect = this.state.options.length > 0 ? this.state.options[0].value:undefined;
    return (
      <div className={style.body}>
        <Spin spinning={spinning}>
          <div className={style.title + ' ' + style.subLine}>
            <Icon type="history" className={style.logo} />
            <div className={style.subTitle}>Distribution History</div>
            <Select className={style.subSelect}
              // defaultValue={0}
              value={this.state.selectIndex}
              onChange={this.selectChange}>
              {
                this.state.options.map((v, i) => {
                  return (<Option value={i} key={v.value}>{v.value}</Option>);
                })
              }
            </Select>


            <div className={style.rightText}>Address Count: {addressCnt}</div>
            {/* <div className={style.rightText}>Amount: N/A WAN</div> */}
            <div className={style.rightText}>Total Fee: {totalFee.toFixed(2)} WAN</div>
          </div>
          <Table columns={this.columns} dataSource={this.state.dataSource} pagination={{ pageSize: 20 }} />
        </Spin>
      </div>
    );
  }
}

export default DistributionHistory;

// export default connect(state => ({
//   selectedAccount: getSelectedAccount(state)
// }))(Panel);


