// import { networks } from '../config/constants';

// export const RPC_URLS = {
//     [networks.MainNet]: `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`,
//     [networks.Ropsten]: `https://ropsten.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`,
//     [networks.Rinkeby]: `https://rinkeby.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`,
//     [networks.Goerli]: `https://goerli.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`,
//     [networks.Kovan]: `https://kovan.infura.iov3/${process.env.REACT_APP_INFURA_ID}`,
//     [networks.Polygon]: 'https://matic-mainnet.chainstacklabs.com',
//     [networks.EWC]: 'https://rpc.energyweb.org/',
//     [networks.Sepolia]: `https://sepolia.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`,
// };

// const POLLING_INTERVAL = 12000;

// export const injected = new InjectedConnector({
//     supportedChainIds: [
//         chainId,
//         // networks.MainNet,
//         // networks.Ropsten,
//         // networks.Rinkeby,
//         // networks.Goerli,
//         // networks.Kovan,
//     ],
// });

// export const walletConnect = new WalletConnectConnector({
//     rpc: { [chainId]: RPC_URLS[chainId] },
//     bridge: 'https://bridge.walletconnect.org',
//     qrcode: true,
//     pollingInterval: POLLING_INTERVAL,
// });

// export const walletlink = new WalletLinkConnector({
//     url: RPC_URLS[chainId],
//     appName: 'https://otaris.io/',
//     supportedChainIds: [chainId],
// });

// export const ledger = new LedgerConnector({
//     chainId: chainId,
//     url: RPC_URLS[chainId],
//     pollingInterval: POLLING_INTERVAL,
// });

// export const trezor = new TrezorConnector({
//     chainId: chainId,
//     url: RPC_URLS[chainId],
//     pollingInterval: POLLING_INTERVAL,
//     manifestEmail: 'developer@xyz.com',
//     manifestAppUrl: 'https://otaris.io/',
// });

// export const frame = new FrameConnector({ supportedChainIds: [1] });

// export const fortmatic = new FortmaticConnector({
//     apiKey: 'pk_live_911E0486D54C05CE',
//     chainId: networks.Goerli,
// });

// export const portis = new PortisConnector({
//     dAppId: 'f420bde8-28fa-4954-855e-317667191963',
//     networks: [chainId, 100],
// });

// export const squarelink = new SquarelinkConnector({
//     clientId: '5f2a2233db82b06b24f9',
//     networks: [chainId, 100],
// });

// export const torus = new TorusConnector({ chainId: chainId });

// export const authereum = new AuthereumConnector({ chainId: chainId });
