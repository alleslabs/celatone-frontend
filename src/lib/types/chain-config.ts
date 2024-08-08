import { z } from "zod";

export const zApiChainConfig = z.object({
  chain: z.string(),
  chainId: z.string(),
  extra: z.object({}),
  features: z.object({
    faucet: z.object({
      enabled: z.boolean(),
      url: z.string(),
    }),
    gov: z.object({
      disableStoreCodeProposal: z.boolean(),
      disableWhitelistProposal: z.boolean(),
      enabled: z.boolean(),
      version: z.string(),
    }),
    move: z.object({
      enabled: z.boolean(),
    }),
    nft: z.object({
      enabled: z.boolean(),
    }),
    pool: z.object({
      enabled: z.boolean(),
      url: z.string(),
    }),
    publicProject: z.object({
      enabled: z.boolean(),
    }),
    wasm: z.object({
      clearAdminGas: z.number(),
      enabled: z.boolean(),
      storeCodeMaxFileSize: z.number(),
    }),
  }),
  fees: z.object({
    fee_tokens: z.array(
      z.object({
        average_gas_price: z.number(),
        denom: z.string(),
        fixed_min_gas_price: z.number(),
        high_gas_price: z.number(),
        low_gas_price: z.number(),
      })
    ),
  }),
  gas: z.object({
    gasAdjustment: z.number(),
    maxGasLimit: z.number(),
  }),
  graphql: z.string(),
  lcd: z.string(),
  logo_URIs: z.object({
    png: z.string(),
    svg: z.string(),
  }),
  network_type: z.string(),
  prettyName: z.string(),
  registryChainName: z.string(),
  rpc: z.string(),
  tier: z.string(),
  wallets: z.array(z.string()),
});
