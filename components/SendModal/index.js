import { Component } from "../base";
import { Modal, Form, Input, Icon } from 'antd';
import style from './style.less';

class SendModalForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ModalText: 'Content of the modal',
      confirmLoading: false,
    };
    this.web3 = props.web3;
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  okCallback = (ret) => {
    this.setState({
      confirmLoading: false,
    });

    if (ret) {
      window.alertAntd('Transaction Success!');
      if (ret) {
        this.props.hideModal();
      }
    } else {
      window.alertAntd('Error: Transaction Failed!');
    }
  }

  handleOk = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          confirmLoading: true,
        });
        setTimeout(async () => {
          let ret = await this.props.sendTransaction(values.amount, this.props.type.toLowerCase() === 'up' ? true : false);
          if (ret) {
            this.props.watchTransactionStatus(ret, this.okCallback)
          } else {
            this.okCallback(false);
          }
        }, 0);
      }
    });
  };

  handleCancel = () => {
    this.props.hideModal();
  };

  amountValidator = (rule, value, callback) => {
    if (Number(value) < 1) {
      callback("Must larger than 1.");
    } else if (Number(value) > 1000) {
      callback("We limit max amount to 1000 wan.");
    } else {
      callback();
    }
  }

  render() {
    const { confirmLoading, ModalText, fields } = this.state;
    const WalletButton = this.props.walletButton;
    const { getFieldDecorator, setFieldsValue } = this.props.form;
    return (
      <div>
        <Modal
          title={"Transaction for " + this.props.type}
          visible={this.props.visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
        >
          <Form layout={'vertical'}>
            <Form.Item label="Address:">
              <WalletButton />
            </Form.Item>
            <Form.Item label="Amount:">
              {getFieldDecorator('amount', {
                getValueFromEvent: (e) => {
                  const convertedValue = Number(e.currentTarget.value);
                  if (isNaN(convertedValue)) {
                    return Number(this.props.form.getFieldValue("amount"));
                  } else {
                    return convertedValue;
                  }
                },
                rules: [{ required: true, type: 'integer', validator: this.amountValidator }],
                initialValue: 1
              })(
                <Input
                  prefix={<Icon type="dollar" style={{ color: 'white' }} />}
                  suffix="WAN"
                />,
              )}
            </Form.Item>
          </Form>
          <div className={style.bt20} onClick={() => { this.props.form.setFieldsValue({ amount: 20 }) }}>20 wan</div>
          <div className={style.bt10} onClick={() => { this.props.form.setFieldsValue({ amount: 10 }) }}>10 wan</div>
          <div className={style.bt5} onClick={() => { this.props.form.setFieldsValue({ amount: 5 }) }}>5 wan</div>
          <div style={{ color: '#880' }}>* We will use the lowest gas charge by default, around 0.002~0.03 WAN.</div>
        </Modal>
      </div>
    );
  }
}

const SendModal = Form.create({ name: 'normal_login' })(SendModalForm);

export default SendModal;

// export default connect(state => ({
//   selectedAccount: getSelectedAccount(state)
// }))(Panel);


