import type { AddressReturnType } from "lib/hooks";

export const getAddressTypeText = (addressType: AddressReturnType) => {
  switch (addressType) {
    case "contract_address":
      return "(Contract Address)";
    case "user_address":
      return "(Wallet Address)";
    default:
      return "(Invalid Address)";
  }
};
