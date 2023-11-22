import type {
  Addr,
  AssetInfo,
  ContractAddr,
  HumanAddr,
  AccessConfigPermission,
  PermissionAddresses,
  Option,
  Nullable,
  MoveAccountAddr,
} from "lib/types";

export interface PublicAccount {
  address: HumanAddr;
  description: string;
  name: string;
  slug: string;
  type: string;
}

export interface PublicModule {
  address: MoveAccountAddr;
  description: string;
  github: string;
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
  instantiatePermission: AccessConfigPermission;
  permissionAddresses: PermissionAddresses;
  github: string;
  verified: boolean;
  cw2Contract: Option<Nullable<string>>;
  cw2Version: Option<Nullable<string>>;
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
  accounts: PublicAccount[];
  assets: AssetInfo;
  codes: RawPublicCode[];
  contracts: RawPublicContract[];
  modules: PublicModule[];
  details: PublicDetail;
  slug: string;
}

export interface PublicContract extends Omit<RawPublicContract, "address"> {
  contractAddress: ContractAddr;
}

export interface PublicProjectInfo {
  accounts: PublicAccount[];
  assets: AssetInfo;
  codes: PublicCode[];
  contracts: PublicContract[];
  modules: PublicModule[];
  details: PublicDetail;
  slug: string;
}

export interface PublicInfo {
  slug: string;
  name: string;
  contractAddress: ContractAddr;
  description: string;
  github: string;
}
