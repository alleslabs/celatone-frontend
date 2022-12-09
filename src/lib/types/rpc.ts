export interface RpcContractError {
  error: string;
}

export interface RpcQueryError {
  code: number;
  message: string;
  details: string[];
}
