import { z } from "zod";

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

import { zAddr } from "./addrs";

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

// ------------------------------------------//
// --------------------V1--------------------//
// ------------------------------------------//
export const zProjectInfo = z.object({
  description: z.string(),
  github: z.string(),
  logo: z.string(),
  name: z.string(),
  socials: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
    })
  ),
  website: z.string(),
});

export type ProjectInfo = z.infer<typeof zProjectInfo>;

export const zPublicAccountInfo = z.object({
  address: zAddr,
  description: z.string(),
  name: z.string(),
  slug: z.string(),
  type: z.string(),
});

export type PublicAccountInfo = z.infer<typeof zPublicAccountInfo>;
