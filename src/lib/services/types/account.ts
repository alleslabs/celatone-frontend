import {
  AccountType,
  AccountTypeRest,
  zProjectInfo,
  zPublicAccountInfo,
} from "lib/types";
import { snakeToCamel } from "lib/utils";
import { z } from "zod";

const zIcns = z.object({
  names: z.array(z.string()),
  primary_name: z.string(),
});

export const zAccountData = z
  .object({
    icns: zIcns.nullable(),
    project_info: zProjectInfo.nullable(),
    public_info: zPublicAccountInfo.nullable(),
  })
  .transform(snakeToCamel);

export type AccountData = z.infer<typeof zAccountData>;

export const zAccountTableCounts = z
  .object({
    code: z.number().nullish(),
    contract_by_admin: z.number().nullish(),
    instantiated: z.number().nullish(),
    proposal: z.number().nullish(),
    tx: z.number().nullish(),
  })
  .transform(snakeToCamel);

export type AccountTableCounts = z.infer<typeof zAccountTableCounts>;

export const zAccountTypeRest = z
  .object({
    account: z.object({
      "@type": z.nativeEnum(AccountTypeRest),
    }),
  })
  .transform((data) => data.account["@type"]);

export const zAccountTypeResponse = z
  .object({
    type: z.nativeEnum(AccountType),
  })
  .transform((val) => val.type);

export const zAccountBech32RestResponse = z
  .object({
    bech32_prefix: z.string(),
  })
  .transform(snakeToCamel);

export type AccountBech32RestResponse = z.infer<
  typeof zAccountBech32RestResponse
>;
