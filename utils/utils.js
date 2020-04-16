import { message } from 'antd';
import BigNumber from 'bignumber.js';

export const toUnitAmount = (amount, decimals) => {
  return new BigNumber(amount).div(Math.pow(10, decimals));
};

export const alertAntd = (info) => {
  if (typeof (info) === "string" && !info.includes('Error')) {
    message.success(info, 10);
  } else {
    if (info.toString().includes("Error")) {
      message.error(info.toString(), 10);
    } else if (info.hasOwnProperty('tip')) {
      message.info(info.tip, 5);
    } else {
      message.info(JSON.stringify(info), 10);
    }
  }
}
