import type { ChainConfig } from "@alleslabs/shared";
import type { RefinementCtx } from "zod";
import { z, ZodIssueCode } from "zod";

import {
  zAsset,
  zChainConfig,
  zDenomUnit,
  zFeeToken,
  zGas,
  zGasCosts,
  zHttpsUrl,
  zNumberInput,
  zRegistry,
} from "lib/types";

export enum VmType {
  MOVE = "move",
  WASM = "wasm",
}

const mustBeAlphabetNumberAndSpecialCharacters =
  "Must be alphabet (a-z), numbers (0-9), or these special characters: “/”, “:”, “.”, “_”, “-”";

interface ValidateExistingChain {
  isChainIdExist: (chainId: string) => boolean;
  isPrettyNameExist: (name: string) => boolean;
}

// MARK: Network Details Form
const zNetworkDetails = zChainConfig
  .innerType()
  .pick({
    prettyName: true,
    lcd: true,
    rpc: true,
    chainId: true,
    registryChainName: true,
  })
  .extend({
    vmType: z.nativeEnum(VmType),
    logoUri: z.union([zHttpsUrl, z.literal("")]),
  });
type NetworkDetails = z.infer<typeof zNetworkDetails>;

const networkDetailsFormValidator = (
  val: NetworkDetails,
  ctx: RefinementCtx,
  validateExistingChain: ValidateExistingChain
) => {
  const { prettyName, chainId, registryChainName } = val;
  const { isChainIdExist, isPrettyNameExist } = validateExistingChain;

  if (prettyName.length > 50)
    ctx.addIssue({
      code: ZodIssueCode.custom,
      message: `Minitia Name is too long. (${prettyName.length}/50)`,
      path: ["prettyName"],
    });

  if (isPrettyNameExist(prettyName))
    ctx.addIssue({
      code: ZodIssueCode.custom,
      message: "This name is already used. Please specify other name.",
      path: ["prettyName"],
    });

  if (isChainIdExist(chainId))
    ctx.addIssue({
      code: ZodIssueCode.custom,
      message: "This Chain ID is already added.",
      path: ["chainId"],
    });

  if (!/^[a-z0-9]+$/.test(registryChainName))
    ctx.addIssue({
      code: ZodIssueCode.custom,
      message: "Lower case letter (a-z) or number (0-9)",
      path: ["registryChainName"],
    });

  return true;
};

export const zNetworkDetailsForm = (
  validateExistingChain: ValidateExistingChain
) =>
  zNetworkDetails.superRefine((val, ctx) =>
    networkDetailsFormValidator(val, ctx, validateExistingChain)
  );
export type NetworkDetailsForm = z.infer<
  ReturnType<typeof zNetworkDetailsForm>
>;

// MARK: Gas Details Form
const zGasFeeDetails = zGas
  .pick({
    gasAdjustment: true,
    maxGasLimit: true,
  })
  .merge(
    zFeeToken.pick({
      denom: true,
      fixed_min_gas_price: true,
      low_gas_price: true,
      average_gas_price: true,
      high_gas_price: true,
    })
  )
  .merge(zGasCosts.pick({ cosmos_send: true, ibc_transfer: true }))
  .extend({
    gasConfig: z.enum(["standard", "custom"]),
    gasPrice: zNumberInput.optional(),
  });
type GasFeeDetails = z.infer<typeof zGasFeeDetails>;

const gasFeeDetailsFormValidator = (val: GasFeeDetails, ctx: RefinementCtx) => {
  const {
    denom,
    gasConfig,
    fixed_min_gas_price: fixedMinGasPrice,
    low_gas_price: lowGasPrice,
    average_gas_price: averageGasPrice,
    high_gas_price: highGasPrice,
    gasPrice,
  } = val;

  if (!/^[a-z0-9/:._-]+$/.test(denom))
    ctx.addIssue({
      code: ZodIssueCode.custom,
      message: mustBeAlphabetNumberAndSpecialCharacters,
    });

  if (gasConfig === "custom") {
    if (fixedMinGasPrice === undefined)
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: " ",
        path: ["fixedMinimumGasPrice"],
      });

    if (lowGasPrice === undefined)
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: " ",
        path: ["lowGasPrice"],
      });

    if (averageGasPrice === undefined)
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: " ",
        path: ["averageGasPrice"],
      });

    if (highGasPrice === undefined)
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: " ",
        path: ["highGasPrice"],
      });
  }

  if (gasConfig === "standard" && gasPrice === undefined)
    ctx.addIssue({
      code: ZodIssueCode.custom,
      message: " ",
      path: ["gasPrice"],
    });

  return true;
};

export const zGasFeeDetailsForm = zGasFeeDetails.superRefine((val, ctx) =>
  gasFeeDetailsFormValidator(val, ctx)
);
export type GasFeeDetailsForm = z.infer<typeof zGasFeeDetailsForm>;

// MARK: WalletRegistryForm
const zWalletRegistryAssetDenom = zDenomUnit
  .pick({ denom: true, exponent: true })
  .superRefine((val, ctx) => {
    const { denom, exponent } = val;

    if (!/^[a-z0-9/:._-]+$/.test(denom))
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: mustBeAlphabetNumberAndSpecialCharacters,
        path: ["denom"],
      });

    if (exponent.toString() === "")
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: " ",
        path: ["exponent"],
      });

    return true;
  });

const zWalletRegistryAsset = zAsset
  .pick({
    name: true,
    base: true,
    symbol: true,
  })
  .extend({
    denoms: z.array(zWalletRegistryAssetDenom),
  })
  .superRefine((val, ctx) => {
    const { name, base, symbol } = val;

    if (!/^[a-z-]+$/.test(name))
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: "Alphabet (a-z) or hyphen (-) only",
        path: ["name"],
      });

    if (!/^[a-z0-9/:._-]+$/.test(base))
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: mustBeAlphabetNumberAndSpecialCharacters,
        path: ["base"],
      });

    if (symbol.length <= 1)
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: " ",
        path: ["symbol"],
      });

    return true;
  });

export const zWalletRegistry = zRegistry
  .pick({
    bech32_prefix: true,
    slip44: true,
  })
  .extend({
    assets: z.array(zWalletRegistryAsset),
  });
export type WalletRegistry = z.infer<typeof zWalletRegistry>;

const walletRegistryFormValidator = (
  val: WalletRegistry,
  ctx: RefinementCtx
) => {
  const { bech32_prefix: bech32Prefix, slip44 } = val;

  if (!/^[a-z]+$/.test(bech32Prefix))
    ctx.addIssue({
      code: ZodIssueCode.custom,
      message: "Alphabet (a-z) only",
      path: ["bech32Prefix"],
    });

  if (!Number.isInteger(slip44))
    ctx.addIssue({
      code: ZodIssueCode.custom,
      message: "Must be an integer",
      path: ["slip44"],
    });

  if (slip44 <= 0)
    ctx.addIssue({
      code: ZodIssueCode.custom,
      message: "Must be greater than 0",
      path: ["slip44"],
    });

  return true;
};

export const zWalletRegistryForm = zWalletRegistry.superRefine((val, ctx) =>
  walletRegistryFormValidator(val, ctx)
);
export type WalletRegistryForm = z.infer<typeof zWalletRegistryForm>;

// MARK: AddNetworkManualForm
export const zAddNetworkManualForm = (
  validateExistingChain: ValidateExistingChain
) =>
  zNetworkDetails
    .merge(zGasFeeDetails)
    .merge(zWalletRegistry)
    .superRefine((val, ctx) => {
      networkDetailsFormValidator(val, ctx, validateExistingChain);
      gasFeeDetailsFormValidator(val, ctx);
      walletRegistryFormValidator(val, ctx);
      return true;
    });

export type AddNetworkManualForm = z.infer<
  ReturnType<typeof zAddNetworkManualForm>
>;

// MARK: AddNetworkManualChainConfigJson
export const zAddNetworkManualChainConfigJson = ({
  isChainIdExist,
  isPrettyNameExist,
}: ValidateExistingChain) =>
  zAddNetworkManualForm({
    isChainIdExist,
    isPrettyNameExist,
  }).transform<ChainConfig>(
    ({
      chainId,
      registryChainName,
      prettyName,
      logoUri,
      lcd,
      rpc,
      vmType,
      gasAdjustment,
      maxGasLimit,
      denom,
      fixed_min_gas_price,
      low_gas_price,
      average_gas_price,
      cosmos_send,
      ibc_transfer,
      bech32_prefix,
      slip44,
      assets,
    }: AddNetworkManualForm) => ({
      tier: "sequencer",
      chainId,
      chain: "initia",
      registryChainName,
      prettyName,
      logo_URIs: {
        png: logoUri || undefined,
      },
      lcd,
      rpc,
      wallets: ["initia", "keplr"],
      features: {
        faucet: {
          enabled: false,
        },
        wasm:
          vmType === VmType.WASM
            ? {
                enabled: true,
                storeCodeMaxFileSize: 1024 * 1024 * 2,
                clearAdminGas: 1000000,
              }
            : { enabled: false },
        move:
          vmType === VmType.MOVE
            ? {
                enabled: true,
                moduleMaxFileSize: 1_048_576,
              }
            : { enabled: false },
        pool: {
          enabled: false,
        },
        publicProject: {
          enabled: true,
        },
        gov: {
          enabled: false,
        },
        nft: {
          enabled: vmType === VmType.MOVE,
        },
      },
      gas: {
        gasAdjustment,
        maxGasLimit,
      },
      extra: {
        isValidatorExternalLink: null,
        layer: "2",
      },
      network_type: "local",
      fees: {
        fee_tokens: [
          {
            denom,
            fixed_min_gas_price,
            low_gas_price,
            average_gas_price,
            gas_costs: {
              cosmos_send,
              ibc_transfer,
            },
          },
        ],
      },
      registry: {
        bech32_prefix,
        slip44,
        staking: {
          staking_tokens: [],
        },
        assets: assets.map(({ name, base, symbol, denoms }) => ({
          name,
          base,
          symbol,
          denom_units: denoms.map(({ denom: denomUnit, exponent }) => ({
            denom: denomUnit,
            exponent,
          })),
          display: symbol,
        })),
      },
    })
  );

export type AddNetworkManualChainConfigJson = z.infer<
  ReturnType<typeof zAddNetworkManualChainConfigJson>
>;

// MARK: AddNetworkJsonChainConfigJson
export const zAddNetworkJsonChainConfigJson = zChainConfig
  .innerType()
  .pick({
    chainId: true,
    registryChainName: true,
    prettyName: true,
    logo_URIs: true,
    lcd: true,
    rpc: true,
    wallets: true,
    features: true,
    gas: true,
    fees: true,
    registry: true,
  })
  .transform<ChainConfig>((val) => ({
    ...val,
    tier: "sequencer",
    chain: "initia",
    graphql: "",
    extra: {
      isValidatorExternalLink: null,
      layer: "2",
    },
    network_type: "local",
  }));

export type AddNetworkJsonChainConfigJson = z.infer<
  typeof zAddNetworkJsonChainConfigJson
>;
