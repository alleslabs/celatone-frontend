export const addressType = (address: string, chainName: string) => {
  if (chainName === "osmosis" || chainName === "osmosistestnet") {
    switch (address.length) {
      case 43:
        return "user_address";
      case 63:
        return "contract_address";
      default:
        break;
    }
  }
  return undefined;
};
