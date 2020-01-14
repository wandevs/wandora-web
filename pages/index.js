import { connect } from "react-redux";
import { Component } from "../components/base";
import { Button, Table, Icon } from 'antd';
import { Wallet, getSelectedAccount, WalletButton, WalletButtonLong } from "wan-dex-sdk-wallet";
import "wan-dex-sdk-wallet/index.css";
import randomAbi from "./abi/random";
import hydroAbi from "./abi/hydro";
import style from './style.less';
import Panel from '../components/Panel';

var Web3 = require("web3");


class IndexPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    window._nodeUrl = "https://demodex.wandevs.org:48545";
  }

  columns = [
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Round',
      dataIndex: 'round',
      key: 'round',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Result',
      dataIndex: 'result',
      key: 'result',
    }
  ]


  componentDidMount() {
    var web3 = new Web3();
    web3.setProvider(new Web3.providers.HttpProvider(window._nodeUrl));
    this.web3 = web3;
    // this.getInfoFromSC();
    // setInterval(this.getInfoFromSC.bind(this), 5000)
  }

  // async getInfoFromSC() {
  //   // let blockNumber = await this.web3.eth.getBlockNumber();
  //   // let random = new this.web3.eth.Contract(randomAbi, "0x0000000000000000000000000000000000000262");
  //   // let epochId = await random.methods.getEpochId((Date.now()/1000).toFixed(0)).call();
  //   // let randomNow = await random.methods.getRandomNumberByEpochId(epochId).call();
  //   // let randomLast = await random.methods.getRandomNumberByEpochId(epochId-1).call();
  //   // this.setState({ epochId: epochId, rn: randomNow, rn0: randomLast, blockNumber });

  //   // let hydro = new this.web3.eth.Contract(hydroAbi, '0x8786038ef9c2f659772c6c2ee8402bdfdc511bb8');
  //   // console.log(blockNumber);
  //   // // let events = await hydro.getPastEvents('Match', {fromBlock: blockNumber - 100, toBlock: 'latest'});
  //   // // console.log('events:', events);
  //   // // hydro.once('Match', (err, event)=>{
  //   // //   console.log('err, event:', err, event);
  //   // // })
  //   // hydro.getPastEvents({fromBlock:5581471}, (err, event)=>{
  //   //   console.log('err, event:', err, event);
  //   // })
  // }

  // renderAccount(account) {
  //   return (
  //     <p>
  //       Address: {account.get("address")}
  //       <br />
  //       IsLock: {account.get("isLocked").toString()}
  //       <br />
  //       Eth Balance: {(account.get("balance")/1e18).toFixed(4)}
  //       <br />
  //       <br />
  //       <button
  //         className="HydroSDK-button"
  //         onClick={() =>
  //           account
  //             .get("wallet")
  //             .signPersonalMessage("0xff2137d657209247083297f72c85e10227634b221049a44c63348509a08d95cc")
  //             .then(alert, alert)
  //         }>
  //         Sign "0xff2137d657209247083297f72c85e10227634b221049a44c63348509a08d95cc"
  //       </button>

  //       <button
  //         className="HydroSDK-button"
  //         onClick={() =>
  //           account
  //             .get("wallet")
  //             .sendTransaction({to:"0x15f59e30ef6f881549ec6196b0633a2cdf3de54c", value: 1e18})
  //             // .then(alert, alert)
  //             .then(console.log, console.log)
  //         }>
  //         Send Transaction
  //       </button>
  //     </p>
  //   );
  // }


  render() {
    const { selectedAccount } = this.props;
    return (
      <div className={style.app}>
        <div className={style.header}>
          <Wallet title="Wan Game" nodeUrl={window._nodeUrl} />
          <Icon className={style.logo} type="appstore" />
          <div className={style.title}>BTC</div>
          <WalletButton />
        </div>
        <Panel web3={this.web3}/>
        
        <div>How do you...</div>
        <div className={style.upDownRegion}>
          <div>
            <Button className={style.upDownButton}>UP</Button>
          </div>
          <div>
            <Button className={style.upDownButton}>DOWN</Button>
          </div>
        </div>
        <div className={style.roundHistory}>RoundHistoryGrid</div>
        <div>Transaction fee will ...</div>
        <div className={style.feePool}>Fee Pool</div>
        <h2 className={style.history}>Transaction History</h2>
        <Table columns={this.columns}/>
      </div>
    );
  }
}

export default connect(state => ({
  selectedAccount: getSelectedAccount(state)
}))(IndexPage);


