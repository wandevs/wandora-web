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

  dataSource = [
    {
      time: '2020-01-14 17:46:39',
      address: '0x4cf0a877e906dead748a41ae7da8c220e4247d9e',
      round: '03',
      amount: 100,
      type: 'UP',
      result: 'Done',
    }, 
    {
      time: '2020-01-14 17:46:39',
      address: '0x4cf0a877e906dead748a41ae7da8c220e4247d9e',
      round: '05',
      amount: 100,
      type: 'DOWN',
      result: 'to be settled',
    }, 
    {
      time: '2020-01-14 17:46:39',
      address: '0x4cf0a877e906dead748a41ae7da8c220e4247d9e',
      round: '02',
      amount: 100,
      type: 'DOWN',
      result: 'Done',
    }, 
    {
      time: '2020-01-14 17:46:39',
      address: '0x4cf0a877e906dead748a41ae7da8c220e4247d9e',
      round: '07',
      amount: 100,
      type: 'Return',
      result: 'to be settled',
    }, 
    {
      time: '2020-01-14 17:46:39',
      address: '0x4cf0a877e906dead748a41ae7da8c220e4247d9e',
      round: '-',
      amount: 100.1234,
      type: 'Fee distribution',
      result: 'Done',
    }, 
    {
      time: '2020-01-14 17:46:39',
      address: '0x4cf0a877e906dead748a41ae7da8c220e4247d9e',
      round: '03',
      amount: 100,
      type: 'UP',
      result: 'Done',
    }, {
      time: '2020-01-14 17:46:39',
      address: '0x4cf0a877e906dead748a41ae7da8c220e4247d9e',
      round: '03',
      amount: 100,
      type: 'UP',
      result: 'Done',
    }, 
    {
      time: '2020-01-14 17:46:39',
      address: '0x4cf0a877e906dead748a41ae7da8c220e4247d9e',
      round: '05',
      amount: 100,
      type: 'DOWN',
      result: 'to be settled',
    }, 
    {
      time: '2020-01-14 17:46:39',
      address: '0x4cf0a877e906dead748a41ae7da8c220e4247d9e',
      round: '02',
      amount: 100,
      type: 'DOWN',
      result: 'Done',
    }, 
    {
      time: '2020-01-14 17:46:39',
      address: '0x4cf0a877e906dead748a41ae7da8c220e4247d9e',
      round: '07',
      amount: 100,
      type: 'Return',
      result: 'to be settled',
    }, 
    {
      time: '2020-01-14 17:46:39',
      address: '0x4cf0a877e906dead748a41ae7da8c220e4247d9e',
      round: '-',
      amount: 100.1234,
      type: 'Fee distribution',
      result: 'Done',
    }, 
    {
      time: '2020-01-14 17:46:39',
      address: '0x4cf0a877e906dead748a41ae7da8c220e4247d9e',
      round: '03',
      amount: 100,
      type: 'UP',
      result: 'Done',
    }, 
  ]

  render() {
    return (
      <div className={style.body}>
        <div className={style.title + ' ' + style.subLine}>
          <Icon type="history" className={style.logo} />
          <div className={style.subTitle}>Transaction History</div>
          <div className={style.rightText}>Total: 2000 WAN</div>
        </div>
        <Table columns={this.columns} dataSource={this.dataSource} pagination={{ pageSize: 4 }}/>
      </div>
    );
  }
}

export default TransactionHistory;

// export default connect(state => ({
//   selectedAccount: getSelectedAccount(state)
// }))(Panel);


