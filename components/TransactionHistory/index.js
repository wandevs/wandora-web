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
    return (
      <div className={style.body}>
        <div className={style.title + ' ' + style.subLine}>
          <Icon type="history" className={style.logo} />
          <div className={style.subTitle}>Transaction History</div>
          <div className={style.rightText}>Total: 2000 WAN</div>
        </div>
        <Table columns={this.columns} dataSource={this.props.transactionHistory} pagination={{ pageSize: 4 }}/>
      </div>
    );
  }
}

export default TransactionHistory;

// export default connect(state => ({
//   selectedAccount: getSelectedAccount(state)
// }))(Panel);


