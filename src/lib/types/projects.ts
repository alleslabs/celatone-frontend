import { z } from "zod";

import type {
  AssetInfo,
  BechAddr,
  BechAddr32,
  HexAddr,
  Nullable,
  Option,
  PermissionAddresses,
} from "lib/types";
import { snakeToCamel } from "lib/utils/formatter/snakeToCamel";

import { zBechAddr, zBechAddr32 } from "./addrs";
import { AccessConfigPermission } from "./code";

export interface PublicAccount {
  // NOTE: multisig is considered a public account
  address: BechAddr;
  description: string;
  name: string;
  slug: string;
  type: string;
}

export interface PublicModule {
  address: HexAddr;
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
  uploader: BechAddr;
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
  address: BechAddr32;
  description: string;
  name: string;
  slug: string;
  instantiator: BechAddr;
  admin: BechAddr;
  label: string;
}

export interface PublicContract extends Omit<RawPublicContract, "address"> {
  contractAddress: BechAddr32;
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
  contractAddress: BechAddr32;
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
  // NOTE: multisig is considered a public account
  address: zBechAddr,
  description: z.string(),
  name: z.string(),
  slug: z.string(),
  type: z.string(),
});
export type PublicAccountInfo = z.infer<typeof zPublicAccountInfo>;

export const zPublicContractInfo = z.object({
  address: zBechAddr32,
  admin: zBechAddr,
  code: z.number().positive(),
  description: z.string(),
  github: z.string(),
  instantiator: zBechAddr,
  label: z.string(),
  name: z.string(),
  slug: z.string(),
});
export type PublicContractInfo = z.infer<typeof zPublicContractInfo>;

export const zPublicCodeInfo = z
  .object({
    contracts: z.number().nonnegative(),
    cw2_contract: z.string().nullable(),
    cw2_version: z.string().nullable(),
    description: z.string(),
    github: z.string(),
    id: z.number().nonnegative(),
    instantiate_permission: z.nativeEnum(AccessConfigPermission),
    name: z.string(),
    permission_addresses: z.array(zBechAddr),
    slug: z.string(),
    uploader: zBechAddr,
  })
  .transform(snakeToCamel);
export type PublicCodeInfo = z.infer<typeof zPublicCodeInfo>;
