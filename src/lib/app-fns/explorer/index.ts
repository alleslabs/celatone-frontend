export const explorerMap: Record<string, string> = {
  osmosis: "https://www.mintscan.io/osmosis",
  osmosistestnet: "https://testnet.mintscan.io/osmosis-testnet",
  terra2: "https://terrasco.pe/mainnet",
  terra2testnet: "https://terrasco.pe/testnet",
};

export const getExplorerProposalUrl = (chainName: string) => {
  let pathSuffix = "";
  switch (chainName) {
    case "osmosis":
    case "osmosistestnet":
      pathSuffix = "proposals";
      break;
    case "terra2":
      return "https://station.terra.money/proposal/phoenix-1";
    case "terra2testnet":
      return "https://station.terra.money/proposal/pisco-1";
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

export const getPoolUrl = (chainName: string) => {
  switch (chainName) {
    case "osmosis":
      return "https://app.osmosis.zone/pool";
    case "osmosistestnet":
      return "https://testnet.osmosis.zone/pool";
    default:
      return "";
  }
};
