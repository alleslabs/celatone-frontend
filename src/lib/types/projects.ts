import type {
  AssetInfo,
  ContractAddr,
  HumanAddr,
  InstantiatePermission,
  PermissionAddresses,
} from "lib/types";

export interface Account {
  address: HumanAddr;
  description: string;
  name: string;
  slug: string;
}

export interface PublicCode {
  description: string;
  id: number;
  name: string;
  slug: string;
  contracts: number;
  uploader: string;
  instantiatePermission: InstantiatePermission;
  permissionAddresses: PermissionAddresses;
}

export interface RawPublicContract {
  address: ContractAddr;
  description: string;
  name: string;
  slug: string;
  instantiator: string;
  admin: string;
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
  codes: PublicCode[];
  contracts: RawPublicContract[];
  details: PublicDetail;
  slug: string;
}

export interface PublicContract extends Omit<RawPublicContract, "address"> {
  contractAddress: string;
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
