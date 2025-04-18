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
  jsonRpc: zHttpsUrl,
  type: z.literal(VmType.EVM),
});
export type EvmVmRadio = z.infer<typeof zEvmVmRadio>;

const zVmTypeRadio = z.union([zMoveVmRadio, zWasmVmRadio, zEvmVmRadio]);

// MARK: Network Details Form
const zNetworkDetails = zChainConfig
  .innerType()
  .pick({
    chainId: true,
    prettyName: true,
    registryChainName: true,
    rest: true,
    rpc: true,
  })
  .extend({
    logoUri: z.union([zHttpsUrl, z.literal("")]),
    vm: zVmTypeRadio,
  });
type NetworkDetails = z.infer<typeof zNetworkDetails>;

const networkDetailsFormValidator = (
  val: NetworkDetails,
  ctx: RefinementCtx,
  validateExistingChain: ValidateExistingChain
) => {
  const { chainId, prettyName, registryChainName } = val;
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
      average_gas_price: true,
      denom: true,
      fixed_min_gas_price: true,
      high_gas_price: true,
      low_gas_price: true,
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
    average_gas_price: averageGasPrice,
    denom,
    fixed_min_gas_price: fixedMinGasPrice,
    gasConfig,
    gasPrice,
    high_gas_price: highGasPrice,
    low_gas_price: lowGasPrice,
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
    base: true,
    name: true,
    symbol: true,
  })
  .extend({
    denoms: z.array(zWalletRegistryAssetDenom),
  })
  .superRefine((val, ctx) => {
    const { base, name, symbol } = val;

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
      assets,
      average_gas_price,
      bech32_prefix,
      chainId,
      cosmos_send,
      denom,
      fixed_min_gas_price,
      gasAdjustment,
      ibc_transfer,
      logoUri,
      low_gas_price,
      maxGasLimit,
      prettyName,
      registryChainName,
      rest,
      rpc,
      slip44,
      vm,
    }: AddNetworkManualForm) => ({
      ...DEFAULT_CUSTOM_MINITIA_NETWORK,
      chainId,
      features: {
        evm:
          vm.type === "evm"
            ? {
                enabled: true,
                jsonRpc: vm.jsonRpc,
              }
            : { enabled: false },
        gov: DEFAULT_GOV_CONFIG,
        move: vm.type === "move" ? DEFAULT_MOVE_CONFIG : { enabled: false },
        nft: {
          enabled: vm.type === "move",
        },
        pool: DEFAULT_POOL_CONFIG,
        publicProject: DEFAULT_PUBLIC_PROJECT_CONFIG,
        wasm: vm.type === "wasm" ? DEFAULT_WASM_CONFIG : { enabled: false },
      },
      fees: {
        fee_tokens: [
          {
            average_gas_price,
            denom,
            fixed_min_gas_price,
            gas_costs: {
              cosmos_send,
              ibc_transfer,
            },
            low_gas_price,
          },
        ],
      },
      gas: {
        gasAdjustment,
        maxGasLimit,
      },
      logo_URIs: {
        png: logoUri || undefined,
      },
      prettyName,
      registry: {
        assets: assets.map(({ base, denoms, name, symbol }) => ({
          base,
          denom_units: denoms.map(({ denom: denomUnit, exponent }) => ({
            denom: denomUnit,
            exponent,
          })),
          display: symbol,
          name,
          symbol,
        })),
        bech32_prefix,
        slip44,
      },
      registryChainName,
      rest,
      rpc,
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
    fees: true,
    gas: true,
    logo_URIs: true,
    prettyName: true,
    registry: true,
    registryChainName: true,
    rest: true,
    rpc: true,
  })
  .extend({
    features: z.object({
      evm: zEvmConfig,
      move: zMoveConfig,
      wasm: zWasmConfig,
    }),
  })
  .transform<ChainConfig>(({ features, ...val }) => ({
    ...val,
    ...DEFAULT_CUSTOM_MINITIA_NETWORK,
    features: {
      ...features,
      gov: DEFAULT_GOV_CONFIG,
      nft: {
        enabled: features.move.enabled,
      },
      pool: DEFAULT_POOL_CONFIG,
      publicProject: DEFAULT_PUBLIC_PROJECT_CONFIG,
    },
  }));

export type AddNetworkJsonChainConfigJson = z.infer<
  typeof zAddNetworkJsonChainConfigJson
>;

export const zAddNetworkLinkChainConfigJson = z
  .object({
    chainId: z.string().min(1, "Chain ID cannot be empty"),
    denom: z.string(),
    jsonRpc: zHttpsUrl.optional(),
    // MARK: Support backward lcd to rest
    lcd: zHttpsUrl.optional(),
    minGasPrice: z.number(),
    rest: zHttpsUrl.optional(),
    rpc: zHttpsUrl,
    vm: z.nativeEnum(VmType),
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
      features: {
        evm:
          val.vm === VmType.EVM
            ? { enabled: true, jsonRpc: val.jsonRpc! } // jsonRpc is required when vm is evm
            : { enabled: false },
        gov: DEFAULT_GOV_CONFIG,
        move: val.vm === VmType.MOVE ? DEFAULT_MOVE_CONFIG : { enabled: false },
        nft: {
          enabled: val.vm === VmType.MOVE,
        },
        pool: DEFAULT_POOL_CONFIG,
        publicProject: DEFAULT_PUBLIC_PROJECT_CONFIG,
        wasm: val.vm === VmType.WASM ? DEFAULT_WASM_CONFIG : { enabled: false },
      },
      fees: {
        fee_tokens: [
          {
            average_gas_price: val.minGasPrice,
            denom: val.denom,
            fixed_min_gas_price: val.minGasPrice,
            low_gas_price: val.minGasPrice,
          },
        ],
      },
      gas: {
        gasAdjustment: DEFAULT_GAS.gasAdjustment,
        maxGasLimit: DEFAULT_GAS.maxGasLimit,
      },
      prettyName: capitalize(val.chainId),
      registry: {
        assets: [],
        bech32_prefix: bech32Prefix,
        slip44: DEFAULT_SLIP44,
      },
      registryChainName: val.chainId,
      rest: restEndpoint,
      rpc: val.rpc,
    };
  });
