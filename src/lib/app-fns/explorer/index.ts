export const explorerMap: Record<string, string> = {
  osmosis: "https://www.mintscan.io/osmosis",
  terra2: "https://finder.terra.money/mainnet",
  terra2testnet: "https://finder.terra.money/testnet",
  osmosistestnet: "https://testnet.mintscan.io/osmosis-testnet",
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

export const getProposalUrl = (chainName: string) => {
  let pathSuffix = "";
  switch (chainName) {
    case "osmosis":
    case "osmosistestnet":
      pathSuffix = "proposals";
      break;
    case "terra2":
      return `https://station.terra.money/proposal/phoenix-1`;
    case "terra2testnet":
      return `https://station.terra.money/proposal/pisco-1`;
    default:
      break;
  }
  return `${explorerMap[chainName]}/${pathSuffix}`;
};

export const getExplorerValidatorUrl = (chainName: string) => {
  let pathSuffix = "";
  switch (chainName) {
    case "osmosis":
    case "osmosistestnet":
      pathSuffix = "validators";
      break;
    case "terra2":
    case "terra2testnet":
      pathSuffix = "validator";
      break;
    default:
      break;
  }
  return `${explorerMap[chainName]}/${pathSuffix}`;
};
