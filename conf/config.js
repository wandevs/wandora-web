
export const mainnetSCAddr = '0xdfad0145311acb8f0e0305aceef5d11a05df9aa0';//mainnet 8 hours smart contract
export const testnetSCAddr = '0x6e1f4097ec38965256a17a9c8ed3ef38162647ad';//testnet 8 hours smart contract

// change networkId to switch network
export const networkId = 3; //1:mainnet, 3:testnet;

export const nodeUrl = networkId == 1 ? "https://gwan-ssl.wandevs.org:56891" : "http://192.168.1.179:54320";

// export const nodeUrl = networkId == 1 ? "https://gwan-ssl.wandevs.org:56891" : "https://gwan-ssl.wandevs.org:46891";
// export const nodeUrl = networkId == 1 ? "https://gwan-ssl.wandevs.org:56891" : "https://demodex.wandevs.org:48545";
