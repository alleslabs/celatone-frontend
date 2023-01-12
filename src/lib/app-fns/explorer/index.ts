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
    case "terra2testnet":
      pathSuffix = "tx";
      break;
    default:
      break;
  }
  return `${explorerMap[chainName]}/${pathSuffix}`;
};

export const getExplorerUserAddressUrl = (chainName: string) => {
  let pathSuffix = "";
  switch (chainName) {
    case "osmosis":
    case "osmosistestnet":
      pathSuffix = "account";
      break;
    case "terra2":
    case "terra2testnet":
      pathSuffix = "address";
      break;
    default:
      break;
  }
  return `${explorerMap[chainName]}/${pathSuffix}`;
};

export const getExplorerBlockUrl = (chainName: string) => {
  let pathSuffix = "";
  switch (chainName) {
    case "osmosis":
    case "osmosistestnet":
    case "terra2":
    case "terra2testnet":
      pathSuffix = "blocks";
      break;
    default:
      break;
  }
  return `${explorerMap[chainName]}/${pathSuffix}`;
};
