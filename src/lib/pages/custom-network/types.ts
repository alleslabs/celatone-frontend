import type { ChainConfig } from "@alleslabs/shared";
import type { RefinementCtx } from "zod";

import { getAccountBech32Rest } from "lib/services/account/rest";
import {
  zAsset,
  zChainConfig,
  zDenomUnit,
  zEvmConfig,
  zFeeToken,
  zGasConfig,
  zGasConfigCosts,
  zHttpsUrl,
  zMoveConfig,
  zNumberInput,
  zRegistry,
  zWasmConfig,
} from "lib/types";
import { capitalize } from "lodash";
import { z, ZodIssueCode } from "zod";

import {
  DEFAULT_BECH32_PREFIX,
  DEFAULT_CUSTOM_MINITIA_NETWORK,
  DEFAULT_GAS,
  DEFAULT_GOV_CONFIG,
  DEFAULT_MOVE_CONFIG,
  DEFAULT_POOL_CONFIG,
  DEFAULT_PUBLIC_PROJECT_CONFIG,
  DEFAULT_SLIP44,
  DEFAULT_WASM_CONFIG,
} from "./constant";

const isAlphabetNumberAndSpecialCharacters = (str: string) =>
  /^[a-z0-9/:._-]+$/.test(str);

const mustBeAlphabetNumberAndSpecialCharacters =
  "Must be alphabet (a-z), numbers (0-9), or these special characters: “/”, “:”, “.”, “_”, “-”";

interface ValidateExistingChain {
  isChainIdExist: (chainId: string) => boolean;
}

export enum VmType {
  MOVE = "move",
  WASM = "wasm",
  EVM = "evm",
}

const zMoveVmRadio = z.object({
  type: z.literal(VmType.MOVE),
});

const zWasmVmRadio = z.object({
  type: z.literal(VmType.WASM),
});

const zEvmVmRadio = z.object({
  type: z.literal(VmType.EVM),
  jsonRpc: zHttpsUrl,
});
export type EvmVmRadio = z.infer<typeof zEvmVmRadio>;

const zVmTypeRadio = z.union([zMoveVmRadio, zWasmVmRadio, zEvmVmRadio]);

// MARK: Network Details Form
const zNetworkDetails = zChainConfig
  .innerType()
  .pick({
    prettyName: true,
    rest: true,
    rpc: true,
    chainId: true,
    registryChainName: true,
  })
  .extend({
    vm: zVmTypeRadio,
    logoUri: z.union([zHttpsUrl, z.literal("")]),
  });
type NetworkDetails = z.infer<typeof zNetworkDetails>;

const networkDetailsFormValidator = (
  val: NetworkDetails,
  ctx: RefinementCtx,
  validateExistingChain: ValidateExistingChain
) => {
  const { prettyName, chainId, registryChainName } = val;
  const { isChainIdExist } = validateExistingChain;

  if (prettyName === "")
    ctx.addIssue({
      code: ZodIssueCode.custom,
      message: " ",
      path: ["prettyName"],
    });

  if (prettyName.length > 50)
    ctx.addIssue({
      code: ZodIssueCode.custom,
      message: `Rollup Name is too long. (${prettyName.length}/50)`,
      path: ["prettyName"],
    });

  if (chainId === "")
    ctx.addIssue({
      code: ZodIssueCode.custom,
      message: " ",
      path: ["chainId"],
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
const zGasConfigFeeDetails = zGasConfig
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
  .merge(zGasConfigCosts.pick({ cosmos_send: true, ibc_transfer: true }))
  .extend({
    gasConfig: z.enum(["standard", "custom"]),
    gasPrice: zNumberInput.optional(),
  });
type GasFeeDetails = z.infer<typeof zGasConfigFeeDetails>;

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

  if (!isAlphabetNumberAndSpecialCharacters(denom))
    ctx.addIssue({
      code: ZodIssueCode.custom,
      message: mustBeAlphabetNumberAndSpecialCharacters,
      path: ["denom"],
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

export const zGasConfigFeeDetailsForm = zGasConfigFeeDetails.superRefine(
  (val, ctx) => gasFeeDetailsFormValidator(val, ctx)
);
export type GasFeeDetailsForm = z.infer<typeof zGasConfigFeeDetailsForm>;

// MARK: WalletRegistryForm
const zWalletRegistryAssetDenom = zDenomUnit
  .pick({ denom: true, exponent: true })
  .superRefine((val, ctx) => {
    const { denom, exponent } = val;

    if (!isAlphabetNumberAndSpecialCharacters(denom))
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

    if (!isAlphabetNumberAndSpecialCharacters(base))
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
    .merge(zGasConfigFeeDetails)
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
}: ValidateExistingChain) =>
  zAddNetworkManualForm({
    isChainIdExist,
  }).transform<ChainConfig>(
    ({
      chainId,
      registryChainName,
      prettyName,
      logoUri,
      rest,
      rpc,
      vm,
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
      ...DEFAULT_CUSTOM_MINITIA_NETWORK,
      chainId,
      registryChainName,
      prettyName,
      logo_URIs: {
        png: logoUri || undefined,
      },
      rest,
      rpc,
      features: {
        wasm: vm.type === "wasm" ? DEFAULT_WASM_CONFIG : { enabled: false },
        move: vm.type === "move" ? DEFAULT_MOVE_CONFIG : { enabled: false },
        evm:
          vm.type === "evm"
            ? {
                enabled: true,
                jsonRpc: vm.jsonRpc,
              }
            : { enabled: false },
        pool: DEFAULT_POOL_CONFIG,
        publicProject: DEFAULT_PUBLIC_PROJECT_CONFIG,
        gov: DEFAULT_GOV_CONFIG,
        nft: {
          enabled: vm.type === "move",
        },
      },
      gas: {
        gasAdjustment,
        maxGasLimit,
      },
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
    rest: true,
    rpc: true,
    gas: true,
    fees: true,
    registry: true,
  })
  .extend({
    features: z.object({
      wasm: zWasmConfig,
      move: zMoveConfig,
      evm: zEvmConfig,
    }),
  })
  .transform<ChainConfig>(({ features, ...val }) => ({
    ...val,
    ...DEFAULT_CUSTOM_MINITIA_NETWORK,
    features: {
      ...features,
      pool: DEFAULT_POOL_CONFIG,
      publicProject: DEFAULT_PUBLIC_PROJECT_CONFIG,
      gov: DEFAULT_GOV_CONFIG,
      nft: {
        enabled: features.move.enabled,
      },
    },
  }));

export type AddNetworkJsonChainConfigJson = z.infer<
  typeof zAddNetworkJsonChainConfigJson
>;

export const zAddNetworkLinkChainConfigJson = z
  .object({
    chainId: z.string().min(1, "Chain ID cannot be empty"),
    // MARK: Support backward lcd to rest
    lcd: zHttpsUrl.optional(),
    rest: zHttpsUrl.optional(),
    rpc: zHttpsUrl,
    jsonRpc: zHttpsUrl.optional(),
    vm: z.nativeEnum(VmType),
    minGasPrice: z.number(),
    denom: z.string(),
  })
  .superRefine((val, ctx) => {
    if (!val.lcd && !val.rest) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: "REST is required",
        path: ["rest"],
      });
    }

    if (val.vm === VmType.EVM && !val.jsonRpc) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: "jsonRpc is required when vm is evm",
        path: ["jsonRpc"],
      });
    }
  })
  .transform<ChainConfig>(async (val) => {
    // MARK: Support backward lcd to rest
    const restEndpoint = val.rest ?? val.lcd ?? "";

    const bech32Prefix = await getAccountBech32Rest(restEndpoint)
      .then((res) => res.bech32Prefix)
      .catch(() => DEFAULT_BECH32_PREFIX);

    return {
      ...DEFAULT_CUSTOM_MINITIA_NETWORK,
      chainId: val.chainId,
      registryChainName: val.chainId,
      prettyName: capitalize(val.chainId),
      rest: restEndpoint,
      rpc: val.rpc,
      features: {
        wasm: val.vm === VmType.WASM ? DEFAULT_WASM_CONFIG : { enabled: false },
        move: val.vm === VmType.MOVE ? DEFAULT_MOVE_CONFIG : { enabled: false },
        evm:
          val.vm === VmType.EVM
            ? { enabled: true, jsonRpc: val.jsonRpc! } // jsonRpc is required when vm is evm
            : { enabled: false },
        pool: DEFAULT_POOL_CONFIG,
        publicProject: DEFAULT_PUBLIC_PROJECT_CONFIG,
        gov: DEFAULT_GOV_CONFIG,
        nft: {
          enabled: val.vm === VmType.MOVE,
        },
      },
      gas: {
        gasAdjustment: DEFAULT_GAS.gasAdjustment,
        maxGasLimit: DEFAULT_GAS.maxGasLimit,
      },
      fees: {
        fee_tokens: [
          {
            denom: val.denom,
            fixed_min_gas_price: val.minGasPrice,
            low_gas_price: val.minGasPrice,
            average_gas_price: val.minGasPrice,
          },
        ],
      },
      registry: {
        bech32_prefix: bech32Prefix,
        slip44: DEFAULT_SLIP44,
        assets: [],
      },
    };
  });
