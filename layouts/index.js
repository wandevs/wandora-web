import { Component } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'react-redux';
import { message } from 'antd';
import { Wallet, getSelectedAccount, WalletButton, WalletButtonLong, getSelectedAccountWallet, getTransactionReceipt } from "wan-dex-sdk-wallet";
import "wan-dex-sdk-wallet/index.css";
import style from './style.less';
import logo from '../img/wandoraLogo.png';
import {alertAntd, toUnitAmount} from '../utils/utils.js';
import {networkId, nodeUrl} from '../conf/config.js';
import { Link } from 'umi';
import sleep from 'ko-sleep';


const networkLogo = networkId == 1 ? require('../img/mainnet.svg') : require('../img/testnet.svg');

class Layout extends Component {
  constructor(props) {
    super(props);
  }

  async componentWillMount() {
    let timer = 0;
    while(this.props.selectedAccount === null) {
      if(timer > 10) {
        break;
      }
      await sleep(500);
      timer++;
    }

    this.setState({});
  }

  showGameRule = () => {
    window.open("https://github.com/wandevs/wan-game/blob/master/GameRule.md");
  }

  render() {
    const props = this.props;
    let active = style.menuItem + ' ' + style.menuItemActive;
    let normal = style.menuItem;
    return (
      <div className={style.conT}>
        <div className={style.header}>
          <Wallet title="Wan Game" nodeUrl={nodeUrl} />
          <img className={style.logo} width="28px" height="28px" src={logo} alt="Logo" />
          <div className={style.title}>Wandora Box</div>
          <div className={style.typeCon}>
            <Link to="/" className={[style.menuBt1, props.location.pathname === '/' ? active : normal].join(' ')}>
              <div className={style.buttonText1}>WAN</div>
              <div className={style.buttonText2}>{" / BTC"}</div>
            </Link>
            <Link to="/btc2usd" className={[style.menuBt2, props.location.pathname === '/btc2usd' ? active : normal].join(' ')}>
              <div className={style.buttonText1}>BTC</div>
              <div className={style.buttonText2}>{" / USD"}</div>
            </Link>
            <Link to="/eth2usd" className={[style.menuBt3, props.location.pathname === '/eth2usd' ? active : normal].join(' ')}>
              <div className={style.buttonText1}>ETH</div>
              <div className={style.buttonText2}>{" / USD"}</div>
            </Link>
          </div>
          <img className={style.networkLogo} style={{ height: "25px", margin: "3px 8px 3px 3px" }} src={networkLogo} />
          <div className={style.gameRule} onClick={this.showGameRule}>Game Rules</div>
          <WalletButton />
        </div>
        {this.props.selectedAccountID === 'EXTENSION' && parseInt(this.props.networkId, 10) !== parseInt(networkId, 10) && (
          <div className="network-warning bg-warning text-white text-center" style={{ padding: 4, backgroundColor: "red", textAlign:"center" }}>
            Please be noted that you are currently choosing the Testnet for WanMask and shall switch to Mainnet for playing Wandora.
          </div>
        )}
        {this.props.children}
      </div>
    );
  }
}

export default withRouter(connect(state => {
  const selectedAccountID = state.WalletReducer.get('selectedAccountID');
  return {
    selectedAccount: getSelectedAccount(state),
    selectedWallet: getSelectedAccountWallet(state),
    networkId: state.WalletReducer.getIn(['accounts', selectedAccountID, 'networkId']),
    selectedAccountID,
    wanBalance: toUnitAmount(state.WalletReducer.getIn(['accounts', selectedAccountID, 'balance']), 18),
  }
})(Layout));
