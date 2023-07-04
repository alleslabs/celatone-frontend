import axios from "axios";

export interface FaucetResponse {
  ChainID: string;
  NodeURI: string;
  GasPrices: string;
  Port: string;
  Amount: number;
  Denom: string;
  RateLimit: boolean;
}

export const queryFaucetInfo = async (
  faucetUrl: string
): Promise<FaucetResponse> => {
  const { data } = await axios.get(faucetUrl);
  return data;
};
