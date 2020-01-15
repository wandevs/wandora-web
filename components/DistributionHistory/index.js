import { Component } from "../base";
import { Icon, Table, Select } from 'antd';
import style from './style.less';

const { Option } = Select;

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
      title: 'AMOUNT TO BUY',
      dataIndex: 'amountBuy',
      key: 'amountBuy',
    },
    {
      title: 'AMOUNT TO BE DISTRIBUTED',
      dataIndex: 'amountPay',
      key: 'amountPay',
    },
  ]

  dataSource = [
    {
      time: '2020-01-14 17:46:39',
      address: '0x4cf0a877e906dead748a41ae7da8c220e4247d9e',
      amountBuy: '1000',
      amountPay: 100.1234,
    }, 
    {
      time: '2020-01-14 17:46:39',
      address: '0x4cf0a877e906dead748a41ae7da8c220e4247d9e',
      amountBuy: '1000',
      amountPay: 100.1234,
    }, 
    {
      time: '2020-01-14 17:46:39',
      address: '0x4cf0a877e906dead748a41ae7da8c220e4247d9e',
      amountBuy: '1000',
      amountPay: 100.1234,
    }, 
    {
      time: '2020-01-14 17:46:39',
      address: '0x4cf0a877e906dead748a41ae7da8c220e4247d9e',
      amountBuy: '1000',
      amountPay: 100.1234,
    }, 
    {
      time: '2020-01-14 17:46:39',
      address: '0x4cf0a877e906dead748a41ae7da8c220e4247d9e',
      amountBuy: '1000',
      amountPay: 100.1234,
    }, 
    {
      time: '2020-01-14 17:46:39',
      address: '0x4cf0a877e906dead748a41ae7da8c220e4247d9e',
      amountBuy: '1000',
      amountPay: 100.1234,
    }, 
    {
      time: '2020-01-14 17:46:39',
      address: '0x4cf0a877e906dead748a41ae7da8c220e4247d9e',
      amountBuy: '1000',
      amountPay: 100.1234,
    }, 
  ]

  options = [
    {value: '9th Jan 2020'},
    {value: '8th Jan 2020'},
    {value: '7th Jan 2020'},
    {value: '6th Jan 2020'},
    {value: '5th Jan 2020'},
    {value: '4th Jan 2020'},
    {value: '3th Jan 2020'},
    {value: '2th Jan 2020'},
  ]

  render() {
    setTimeout(()=>{
      let scr = document.getElementById('scrollView')
      if (scr) {
        scr.scrollLeft = scr.scrollWidth;
      }
    }, 500);
    return (
      <div className={style.body}>
        <div className={style.title + ' ' + style.subLine}>
          <Icon type="history" className={style.logo} />
          <div className={style.subTitle}>Distribution History</div>
          <Select className={style.subSelect} defaultValue={this.options[0].value} onChange={()=>{}}>
            {
              this.options.map((v,i) => {
                return (<Option value={v.value} key={v.value}>{v.value}</Option>);
              })
            }
          </Select>
          <div className={style.rightText}>Address: 213</div>
          <div className={style.rightText}>Amount: 20000 WAN</div>
          <div className={style.rightText}>Total Fee: 2000 WAN</div>

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


