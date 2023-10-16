interface Singleton {
  type: "singleton";
  value: string;
}

interface Bucket {
  type: "bucket";
  values: string[];
}

export type DecodedKey = Singleton | Bucket;

// TODO: Refactor later
interface ResponseContractState {
  key: string;
  value: string;
}

interface Pagination {
  next_key?: string;
  total: number;
}

export interface ResponseContractStates {
  models: ResponseContractState[];
  pagination: Pagination;
}

export interface ContractState {
  rawKey: string;
  key: DecodedKey;
  value: unknown;
}
