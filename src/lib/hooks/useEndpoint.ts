import { useWallet } from "@cosmos-kit/react";

import { LCD_ENDPOINT } from "lib/data";

export const useEndpoint = () => {
  const { currentChainName } = useWallet();
  return LCD_ENDPOINT[currentChainName];
};
