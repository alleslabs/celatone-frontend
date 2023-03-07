import type {
  Addr,
  AssetInfo,
  ContractAddr,
  HumanAddr,
  InstantiatePermission,
  PermissionAddresses,
  Option,
} from "lib/types";

export interface Account {
  address: HumanAddr;
  description: string;
  name: string;
  slug: string;
}

export interface RawPublicCode {
  description: string;
  id: number;
  name: string;
  slug: string;
  contracts: number;
  uploader: Addr;
  instantiatePermission: InstantiatePermission;
  permissionAddresses: PermissionAddresses;
  github: string;
  verified: boolean;
  cw2Contract: Option<string | null>;
  cw2Version: Option<string | null>;
}

export interface PublicCode extends Omit<RawPublicCode, "contracts"> {
  contractCount: number;
}

export interface RawPublicContract {
  address: ContractAddr;
  description: string;
  name: string;
  slug: string;
  instantiator: Addr;
  admin: Addr;
  label: string;
}

export interface Social {
  name: string;
  url: string;
}

export interface PublicDetail {
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
  codes: RawPublicCode[];
  contracts: RawPublicContract[];
  details: PublicDetail;
  slug: string;
}

export interface PublicContract extends Omit<RawPublicContract, "address"> {
  contractAddress: ContractAddr;
}

export interface PublicProjectInfo {
  accounts: Account[];
  assets: AssetInfo;
  codes: PublicCode[];
  contracts: PublicContract[];
  details: PublicDetail;
  slug: string;
}

export interface PublicInfo {
  slug: string;
  name: string;
  contractAddress: ContractAddr;
  description: string;
}
