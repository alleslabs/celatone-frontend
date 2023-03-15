import type { Event } from "@cosmjs/stargate";
import type { Log } from "@cosmjs/stargate/build/logs";
import axios from "axios";
import type { CompactBitArray } from "cosmjs-types/cosmos/crypto/multisig/v1beta1/multisig";
import type { SignMode } from "cosmjs-types/cosmos/tx/signing/v1beta1/signing";
import type { Any } from "cosmjs-types/google/protobuf/any";

import { CELATONE_API_ENDPOINT, getChainApiPath } from "env";
import type { Option, Fee } from "lib/types";
import { parseDateOpt } from "lib/utils";

// ----------------------------------------
// --------------AuthInfo------------------
// ----------------------------------------
interface AuthInfo {
  signer_infos: SignerInfo[];
  fee?: Fee;
}

interface SignerInfo {
  public_key?: { "@type": string; key: string };
  mode_info?: ModeInfo;
  sequence: string;
}

interface ModeInfo {
  single?: ModeInfoSingle | undefined;
  multi?: ModeInfoMulti | undefined;
}

interface ModeInfoSingle {
  mode: keyof typeof SignMode;
}

// Revisit Multisig Info
interface ModeInfoMulti {
  bitarray?: CompactBitArray;
  modeInfos: ModeInfo[];
}

// ----------------------------------------
// -----------------Tx---------------------
// ----------------------------------------
export type TypeUrl =
  // cosmwasm
  | "/cosmwasm.wasm.v1.MsgStoreCode"
  | "/cosmwasm.wasm.v1.MsgInstantiateContract"
  | "/cosmwasm.wasm.v1.MsgInstantiateContract2"
  | "/cosmwasm.wasm.v1.MsgExecuteContract"
  | "/cosmwasm.wasm.v1.MsgMigrateContract"
  | "/cosmwasm.wasm.v1.MsgUpdateAdmin"
  | "/cosmwasm.wasm.v1.MsgClearAdmin"
  // cosmos-sdk
  | "/cosmos.bank.v1beta1.MsgSend"
  | "/cosmos.bank.v1beta1.MsgMultiSend"
  | "/cosmos.authz.v1beta1.MsgGrant"
  | "/cosmos.authz.v1beta1.MsgRevoke"
  | "/cosmos.authz.v1beta1.MsgExec"
  | "/cosmos.crisis.v1beta1.MsgVerifyInvariant"
  | "/cosmos.distribution.v1beta1.MsgSetWithdrawAddress"
  | "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward"
  | "/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission"
  | "/cosmos.distribution.v1beta1.MsgFundCommunityPool"
  | "/cosmos.evidence.v1beta1.MsgSubmitEvidence"
  | "/cosmos.feegrant.v1beta1.MsgGrantAllowance"
  | "/cosmos.feegrant.v1beta1.MsgRevokeAllowance"
  | "/cosmos.gov.v1beta1.MsgSubmitProposal"
  | "/cosmos.gov.v1beta1.MsgVote"
  | "/cosmos.gov.v1beta1.MsgVoteWeighted"
  | "/cosmos.gov.v1beta1.MsgDeposit"
  | "/cosmos.slashing.v1beta1.MsgUnjail"
  | "/cosmos.staking.v1beta1.MsgCreateValidator"
  | "/cosmos.staking.v1beta1.MsgEditValidator"
  | "/cosmos.staking.v1beta1.MsgDelegate"
  | "/cosmos.staking.v1beta1.MsgUndelegate"
  | "/cosmos.staking.v1beta1.MsgBeginRedelegate"
  | "/ibc.applications.transfer.v1.MsgTransfer"
  | "/ibc.core.client.v1.MsgCreateClient"
  | "/ibc.core.client.v1.MsgUpdateClient"
  | "/ibc.core.client.v1.MsgUpgradeClient"
  | "/ibc.core.client.v1.MsgSubmitMisbehaviour"
  | "/ibc.core.connection.v1.MsgConnectionOpenInit"
  | "/ibc.core.connection.v1.MsgConnectionOpenTry"
  | "/ibc.core.connection.v1.MsgConnectionOpenAck"
  | "/ibc.core.connection.v1.MsgConnectionOpenConfirm"
  | "/ibc.core.channel.v1.MsgChannelOpenInit"
  | "/ibc.core.channel.v1.MsgChannelOpenTry"
  | "/ibc.core.channel.v1.MsgChannelOpenAck"
  | "/ibc.core.channel.v1.MsgChannelOpenConfirm"
  | "/ibc.core.channel.v1.MsgChannelCloseInit"
  | "/ibc.core.channel.v1.MsgChannelCloseConfirm"
  | "/ibc.core.channel.v1.MsgRecvPacket"
  | "/ibc.core.channel.v1.MsgTimeout"
  | "/ibc.core.channel.v1.MsgTimeoutOnClose"
  | "/ibc.core.channel.v1.MsgAcknowledgement"
  // osmosis
  | "/osmosis.gamm.poolmodels.balancer.v1beta1.MsgCreateBalancerPool"
  | "/osmosis.gamm.poolmodels.stableswap.v1beta1.MsgCreateStableswapPool"
  | "/osmosis.gamm.poolmodels.stableswap.v1beta1.MsgStableSwapAdjustScalingFactors"
  | "/osmosis.gamm.v1beta1.MsgJoinPool"
  | "/osmosis.gamm.v1beta1.MsgExitPool"
  | "/osmosis.gamm.v1beta1.MsgSwapExactAmountIn"
  | "/osmosis.gamm.v1beta1.MsgSwapExactAmountOut"
  | "/osmosis.gamm.v1beta1.MsgJoinSwapExternAmountIn"
  | "/osmosis.gamm.v1beta1.MsgJoinSwapShareAmountOut"
  | "/osmosis.gamm.v1beta1.MsgExitSwapShareAmountIn"
  | "/osmosis.gamm.v1beta1.MsgExitSwapExternAmountOut"
  | "/osmosis.incentives.MsgCreateGauge"
  | "/osmosis.incentives.MsgAddToGauge"
  | "/osmosis.lockup.MsgLockTokens"
  | "/osmosis.lockup.MsgBeginUnlockingAll"
  | "/osmosis.lockup.MsgBeginUnlocking"
  | "/osmosis.lockup.MsgForceUnlock"
  | "/osmosis.lockup.MsgExtendLockup"
  | "/osmosis.superfluid.MsgSuperfluidDelegate"
  | "/osmosis.superfluid.MsgSuperfluidUndelegate"
  | "/osmosis.superfluid.MsgSuperfluidUnbondLock"
  | "/osmosis.superfluid.MsgLockAndSuperfluidDelegate"
  | "/osmosis.superfluid.MsgUnPoolWhitelistedPool"
  | "/osmosis.tokenfactory.v1beta1.MsgCreateDenom"
  | "/osmosis.tokenfactory.v1beta1.MsgMint"
  | "/osmosis.tokenfactory.v1beta1.MsgBurn"
  | "/osmosis.tokenfactory.v1beta1.MsgChangeAdmin"
  | "/osmosis.tokenfactory.v1beta1.MsgSetDenomMetadata";

export interface MsgBody {
  "@type": TypeUrl;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface TxBody {
  messages: MsgBody[];
  memo: string;
  timeout_height: string;
  // Revisit extension options
  extension_options: Any[];
  non_critical_extension_options: Any[];
}

export interface Tx {
  "@type": string;
  body: TxBody;
  auth_info: AuthInfo;
  signatures: string[];
}

export interface TxResponse {
  height: string;
  txhash: string;
  codespace: string;
  code: number;
  data: string;
  raw_log: string;
  logs: Log[];
  info: string;
  gas_wanted: string;
  gas_used: string;
  tx: Tx;
  timestamp: Option<Date>;
  events: Event[];
}

export const queryTxData = async (
  chainName: string,
  chainId: string,
  txHash: string
): Promise<TxResponse> => {
  const { data } = await axios.get(
    `${CELATONE_API_ENDPOINT}/txs/${getChainApiPath(
      chainName
    )}/${chainId}/${txHash}`
  );

  return {
    ...data.tx_response,
    timestamp: parseDateOpt(data.tx_response.timestamp),
  } as TxResponse;
};
