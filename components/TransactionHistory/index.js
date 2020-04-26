import { Component } from "../base";
import { Icon, Table } from 'antd';
import style from './style.less';

class TransactionHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.web3 = props.web3;
  }

  componentDidMount() {

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
      title: 'ROUND',
      dataIndex: 'round',
      key: 'round',
    },
    {
      title: 'AMOUNT',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'TYPE',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'RESULT',
      dataIndex: 'result',
      key: 'result',
    }
  ]

  render() {
    let total = 0;
    this.props.transactionHistory.forEach(element => {
      total += Number(element.amount);
    });
    return (
      <div className={style.body}>
        <div className={style.title + ' ' + style.subLine}>
          <Icon type="history" className={style.logo} />
          <div className={style.subTitle}>Transaction History</div>
          <div className={style.rightText}>Total: {total.toFixed(2)} WAN</div>
        </div>
        <Table columns={this.columns} dataSource={this.props.transactionHistory.slice().reverse()} pagination={{ pageSize: 10 }}/>
      </div>
    );
  }
}

export default TransactionHistory;

// export default connect(state => ({
//   selectedAccount: getSelectedAccount(state)
// }))(Panel);


