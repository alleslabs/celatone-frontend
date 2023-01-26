import type { AssetInfo, ContractAddr, HumanAddr } from "lib/types";

export interface Account {
  address: HumanAddr;
  description: string;
  name: string;
  slug: string;
}

export interface Code {
  description: string;
  id: number;
  name: string;
  slug: string;
}

export interface RawContract {
  address: ContractAddr;
  description: string;
  name: string;
  slug: string;
}

export interface Social {
  name: string;
  url: string;
}

export interface Detail {
  github: string;
  logo: string;
  name: string;
  socials: Social[];
  website: string;
  description: string;
}

export interface RawPublicProjectInfo {
  accounts: Account[];
  assets: AssetInfo;
  codes: Code[];
  contracts: RawContract[];
  details: Detail;
  slug: string;
}

export interface Contract extends Omit<RawContract, "address"> {
  contractAddress: string;
}

export interface PublicProjectInfo {
  accounts: Account[];
  assets: AssetInfo;
  codes: Code[];
  contracts: Contract[];
  details: Detail;
  slug: string;
}

export interface PublicInfo {
  slug: string;
  name: string;
  contractAddress: ContractAddr;
  description: string;
}
