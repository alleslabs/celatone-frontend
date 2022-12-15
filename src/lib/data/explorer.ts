export const explorerMap: Record<string, string> = {
  osmosis: "https://www.mintscan.io/osmosis",
  terra2: "https://finder.terra.money/mainnet",
  osmosistestnet: "https://testnet.mintscan.io/osmosis-testnet",
};

export const getExplorerTxUrl = (chainName: string) => {
  let pathSuffix = "";
  switch (chainName) {
    case "osmosis":
    case "osmosistestnet":
      pathSuffix = "txs";
      break;
    case "terra2":
      pathSuffix = "tx";
      break;
    default:
      break;
  }
  return `${explorerMap[chainName]}/${pathSuffix}`;
};

export const getExplorerContractAddressUrl = (chainName: string) => {
  let pathSuffix = "";
  switch (chainName) {
    case "osmosis":
    case "osmosistestnet":
      pathSuffix = "account";
      break;
    case "terra2":
      pathSuffix = "address";
      break;
    default:
      break;
  }
  return `${explorerMap[chainName]}/${pathSuffix}`;
};

// NOTE - Seperate the function for further implementation
// eslint-disable-next-line sonarjs/no-identical-functions
export const getExplorerUserAddressUrl = (chainName: string) => {
  let pathSuffix = "";
  switch (chainName) {
    case "osmosis":
    case "osmosistestnet":
      pathSuffix = "account";
      break;
    case "terra2":
      pathSuffix = "address";
      break;
    default:
      break;
  }
  return `${explorerMap[chainName]}/${pathSuffix}`;
};
