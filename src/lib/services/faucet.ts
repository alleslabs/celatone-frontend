import axios from "axios";

export interface FaucetResponse {
  Amount: number;
  ChainID: string;
  Denom: string;
  GasPrices: string;
  NodeURI: string;
  Port: string;
  RateLimit: boolean;
}

export const queryFaucetInfo = async (
  faucetUrl: string
): Promise<FaucetResponse> => {
  const { data } = await axios.get(faucetUrl);
  return data;
};
