import type { Coin } from "@cosmjs/stargate";
import type { TypeUrl } from "lib/data";
import type {
  AccessConfigPermission,
  BechAddr,
  BechAddr32,
  Nullable,
  Option,
  ValidatorAddr,
} from "lib/types";

import type { VoteOption } from "./mapping";

export interface MsgBaseDetails {
  type: string;
}

export interface MsgUnknownDetails extends MsgBaseDetails {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface InstantiatePermissionResponse {
  address: BechAddr;
  // Remark: addresses will undefined in case of Cosmos SDK v0.26
  addresses?: BechAddr[];
  permission: AccessConfigPermission;
}

// cosmwasm/wasm
export interface MsgStoreCodeDetails extends MsgBaseDetails {
  code_id: Option<string>;
  instantiate_permission: Nullable<InstantiatePermissionResponse>;
  sender: BechAddr;
  wasm_byte_code: string; // base64
}

export interface MsgInstantiateDetails extends MsgBaseDetails {
  admin: BechAddr;
  code_id: string;
  contract_address: Option<BechAddr32>;
  funds: Coin[];
  label: string;
  msg: object;
  sender: BechAddr;
}

export interface MsgInstantiate2Details extends MsgInstantiateDetails {
  fix_msg: boolean;
  salt: string;
}

export interface MsgExecuteDetails extends MsgBaseDetails {
  contract: BechAddr32;
  funds: Coin[];
  msg: object;
  sender: BechAddr;
}

export interface MsgExecuteModuleDetails extends MsgBaseDetails {
  args: string[];
  function_name: string;
  module_address: string;
  module_name: string;
  sender: BechAddr;
  type_args: string[];
}

export interface MsgMigrateDetails extends MsgBaseDetails {
  code_id: string;
  contract: BechAddr32;
  msg: object;
  sender: BechAddr;
}

export interface MsgUpdateAdminDetails extends MsgBaseDetails {
  contract: BechAddr32;
  new_admin: BechAddr;
  sender: BechAddr;
}

export interface MsgClearAdminDetails extends MsgBaseDetails {
  contract: BechAddr32;
  sender: BechAddr;
}

export interface MsgExecDetails extends MsgBaseDetails {
  grantee: BechAddr;
  msg_type_url: string;
  msgs: object[];
}
// x/authz
export interface MsgGrantDetails extends MsgBaseDetails {
  grant: object;
  grantee: BechAddr;
  granter: BechAddr;
}
export interface MsgRevokeDetails extends MsgBaseDetails {
  grantee: BechAddr;
  granter: BechAddr;
  msg_type_url: string;
}

export interface MsgMultiSendDetails extends MsgBaseDetails {
  inputs: object;
  outputs: object;
}
// x/bank
export interface MsgSendDetails extends MsgBaseDetails {
  amount: Coin[];
  from_address: BechAddr;
  to_address: BechAddr;
}

// x/crisis
export interface MsgVerifyInvariantDetails extends MsgBaseDetails {
  invariant_module_name: string;
  invariant_route: string;
  sender: BechAddr;
}

export interface MsgFundCommunityPoolDetails extends MsgBaseDetails {
  amount: Coin[];
  depositor: BechAddr;
}
// x/distribution
export interface MsgSetWithdrawAddressDetails extends MsgBaseDetails {
  delegator_address: BechAddr;
  withdraw_address: BechAddr;
}
export interface MsgWithdrawDelegatorRewardDetails extends MsgBaseDetails {
  delegator_address: BechAddr;
  validator_address: ValidatorAddr;
}
export interface MsgWithdrawValidatorCommissionDetails extends MsgBaseDetails {
  validator_address: ValidatorAddr;
}

// x/evidence
export interface MsgSubmitEvidenceDetails extends MsgBaseDetails {
  evidence: object;
  submitter: BechAddr;
}

// x/feegrant
export interface MsgGrantAllowanceDetails extends MsgBaseDetails {
  allowance: object;
  grantee: BechAddr;
  granter: BechAddr;
}
export interface MsgRevokeAllowanceDetails extends MsgBaseDetails {
  grantee: BechAddr;
  granter: BechAddr;
}

export interface MsgDepositDetails extends MsgBaseDetails {
  amount: Coin[];
  depositor: BechAddr;
  proposal_id: string;
}
// x/gov
export interface MsgSubmitProposalDetails extends MsgBaseDetails {
  content: {
    "@type": string;
    changes?: { key: string; subspace: string; value: string }[];
    description: string;
    subject_client_id: string;
    substitute_client_id: string;
    title: string;
  };
  initial_deposit: Coin[];
  is_expedited?: boolean;
  proposal_id: Option<string>;
  proposal_type: Option<string>;
  proposer: BechAddr;
}
export interface MsgVoteDetails extends MsgBaseDetails {
  option: VoteOption;
  proposal_id: string;
  voter: BechAddr;
}
export interface MsgVoteWeightedDetails extends MsgBaseDetails {
  options: { option: VoteOption; weight: string }[];
  proposal_id: string;
  voter: BechAddr;
}

// x/slashing
export interface MsgUnjailDetails extends MsgBaseDetails {
  validator_addr: ValidatorAddr;
}

export interface MsgBeginRedelegateDetails extends MsgBaseDetails {
  amount: Coin;
  delegator_address: BechAddr;
  validator_dst_address: ValidatorAddr;
  validator_src_address: ValidatorAddr;
}
// x/staking
export interface MsgCreateValidatorDetails extends MsgBaseDetails {
  commission: object;
  delegator_address: BechAddr;
  description: object;
  min_self_delegation: string;
  pubkey: object;
  validator_address: ValidatorAddr;
  value: Coin;
}
export interface MsgDelegateDetails extends MsgBaseDetails {
  amount: Coin;
  delegator_address: BechAddr;
  validator_address: ValidatorAddr;
}
export interface MsgEditValidatorDetails extends MsgBaseDetails {
  commission_rate: string;
  description: object;
  min_self_delegation: string;
  validator_address: ValidatorAddr;
}
export interface MsgUndelegateDetails extends MsgBaseDetails {
  amount: Coin;
  delegator_address: BechAddr;
  validator_address: ValidatorAddr;
}

// ibc/applications
export interface MsgTransferDetails extends MsgBaseDetails {
  memo: string;
  receiver: BechAddr;
  sender: BechAddr;
  source_channel: string;
  source_port: string;
  timeout_height: object;
  timeout_timestamp: string;
  token: Coin;
}

export interface MsgAcknowledgementDetails extends MsgBaseDetails {
  acknowledgement: string;
  packet: object;
  proof_acked: string;
  proof_height: object;
  signer: BechAddr;
}
export interface MsgChannelCloseConfirmDetails extends MsgBaseDetails {
  channel_id: string;
  port_id: string;
  proof_height: object;
  proof_init: string;
  signer: BechAddr;
}
export interface MsgChannelCloseInitDetails extends MsgBaseDetails {
  channel_id: string;
  port_id: string;
  signer: BechAddr;
}
export interface MsgChannelOpenAckDetails extends MsgBaseDetails {
  channel_id: string;
  counterparty_channel_id: string;
  counterparty_version: string;
  port_id: string;
  proof_height: object;
  proof_try: string;
  signer: BechAddr;
}
export interface MsgChannelOpenConfirmDetails extends MsgBaseDetails {
  channel_id: string;
  port_id: string;
  proof_ack: string;
  proof_height: object;
  signer: BechAddr;
}
export interface MsgChannelOpenInitDetails extends MsgBaseDetails {
  channel: object;
  port_id: string;
  signer: BechAddr;
}
export interface MsgChannelOpenTryDetails extends MsgBaseDetails {
  channel: object;
  counterparty_version: string;
  port_id: string;
  previous_channel_id: string;
  proof_height: object;
  proof_init: string;
  signer: BechAddr;
}
export interface MsgConnectionOpenAckDetails extends MsgBaseDetails {
  client_state: object;
  connection_id: string;
  consensus_height: object;
  counterparty_connection_id: string;
  proof_client: string;
  proof_consensus: string;
  proof_height: object;
  proof_try: string;
  signer: BechAddr;
  version: object;
}
export interface MsgConnectionOpenConfirmDetails extends MsgBaseDetails {
  connection_id: string;
  proof_ack: string;
  proof_height: object;
  signer: BechAddr;
}
export interface MsgConnectionOpenInitDetails extends MsgBaseDetails {
  client_id: string;
  counterparty: object;
  delay_period: number;
  signer: BechAddr;
  version: object;
}
export interface MsgConnectionOpenTryDetails extends MsgBaseDetails {
  client_id: string;
  client_state: object;
  consensus_height: object;
  counterparty: object;
  counterparty_versions: object;
  delay_period: number;
  previous_connection_id: string;
  proof_client: string;
  proof_consensus: string;
  proof_height: object;
  proof_init: string;
  signer: BechAddr;
}
// ibc/core
export interface MsgCreateClientDetails extends MsgBaseDetails {
  client_state: object;
  consensus_state: object;
  signer: BechAddr;
}
export interface MsgRecvPacketDetails extends MsgBaseDetails {
  packet: object;
  proof_commitment: string;
  proof_height: object;
  signer: BechAddr;
}
export interface MsgSubmitMisbehaviourDetails extends MsgBaseDetails {
  client_id: string;
  misbehaviour: object;
  signer: BechAddr;
}
export interface MsgTimeoutDetails extends MsgBaseDetails {
  next_sequence_recv: number;
  packet: object;
  proof_height: object;
  proof_unreceived: string;
  signer: BechAddr;
}
export interface MsgTimeoutOnCloseDetails extends MsgBaseDetails {
  next_sequence_recv: number;
  packet: object;
  proof_close: string;
  proof_height: object;
  proof_unreceived: string;
  signer: BechAddr;
}
export interface MsgUpdateClientDetails extends MsgBaseDetails {
  client_id: string;
  // newer version
  client_message?: object;
  // older version
  header?: object;
  signer: BechAddr;
}
export interface MsgUpgradeClientDetails extends MsgBaseDetails {
  client_id: string;
  client_state: object;
  consensus_state: object;
  proof_upgrade_client: string;
  proof_upgrade_consensus_state: string;
  signer: BechAddr;
}

// osmosis/gamm
export interface MsgCreateBalancerPoolDetails extends MsgBaseDetails {
  future_pool_governor: string;
  pool_assets: object;
  pool_params: object;
  sender: BechAddr;
}
export interface MsgCreateStableswapPoolDetails extends MsgBaseDetails {
  future_pool_governor: string;
  initial_pool_liquidity: Coin[];
  pool_params: object;
  scaling_factor_controller: string;
  scaling_factors: string[];
  sender: BechAddr;
}
export interface MsgExitPoolDetails extends MsgBaseDetails {
  pool_id: string;
  sender: BechAddr;
  share_in_amount: string;
  token_out_mins: Option<Coin[]>;
}
export interface MsgExitSwapExternAmountOutDetails extends MsgBaseDetails {
  pool_id: string;
  sender: BechAddr;
  share_in_max_amount: string;
  token_out: Coin;
}
export interface MsgExitSwapShareAmountInDetails extends MsgBaseDetails {
  pool_id: string;
  sender: BechAddr;
  share_in_amount: string;
  token_out_denom: string;
  token_out_min_amount: string;
}
export interface MsgJoinPoolDetails extends MsgBaseDetails {
  pool_id: string;
  sender: BechAddr;
  share_out_amount: string;
  token_in_maxs: Option<Coin[]>;
}
export interface MsgJoinSwapExternAmountInDetails extends MsgBaseDetails {
  pool_id: string;
  sender: BechAddr;
  share_out_min_amount: string;
  token_in: Coin;
}
export interface MsgJoinSwapShareAmountOutDetails extends MsgBaseDetails {
  pool_id: string;
  sender: BechAddr;
  share_out_amount: string;
  token_in_denom: string;
  token_in_max_amount: string;
}
export interface MsgStableSwapAdjustScalingFactorsDetails
  extends MsgBaseDetails {
  pool_id: string;
  scaling_factors: string[];
  sender: BechAddr;
}
export interface MsgSwapExactAmountInDetails extends MsgBaseDetails {
  routes: { poolId: number; tokenOutDenom: string }[];
  sender: BechAddr;
  token_in: Coin;
  token_out_min_amount: string;
}
export interface MsgSwapExactAmountOutDetails extends MsgBaseDetails {
  routes: { poolId: number; tokenInDenom: string }[];
  sender: BechAddr;
  token_in_max_amount: string;
  token_out: Coin;
}

export interface MsgAddToGaugeDetails extends MsgBaseDetails {
  gauge_id: string;
  owner: BechAddr;
  rewards: Coin[];
}
// osmosis/incentives
export interface MsgCreateGaugeDetails extends MsgBaseDetails {
  coins: Coin[];
  distribute_to: object;
  is_perpetual: boolean;
  num_epochs_paid_over: string;
  owner: BechAddr;
  start_time: string;
}

export interface MsgBeginUnlockingAllDetails extends MsgBaseDetails {
  owner: BechAddr;
}
export interface MsgBeginUnlockingDetails extends MsgBaseDetails {
  coins?: Coin[];
  ID: string;
  owner: BechAddr;
}
export interface MsgExtendLockupDetails extends MsgBaseDetails {
  duration: number | string;
  ID: string;
  owner: BechAddr;
}
export interface MsgForceUnlockDetails extends MsgBaseDetails {
  coins?: Coin[];
  ID: string;
  owner: BechAddr;
}
// osmosis/lockup
export interface MsgLockTokensDetails extends MsgBaseDetails {
  coins: Coin[];
  duration: number | string;
  owner: BechAddr;
}

export interface MsgSetRewardReceiverAddressDetails extends MsgBaseDetails {
  lock_id: string;
  owner: BechAddr;
  reward_receiver: BechAddr;
}

export interface MsgLockAndSuperfluidDelegateDetails extends MsgBaseDetails {
  coins: Coin[];
  sender: BechAddr;
  val_addr: ValidatorAddr;
}
// osmosis/superfluid
export interface MsgSuperfluidDelegateDetails extends MsgBaseDetails {
  lock_id: string;
  sender: BechAddr;
  val_addr: ValidatorAddr;
}
export interface MsgSuperfluidUnbondLockDetails extends MsgBaseDetails {
  lock_id: string;
  sender: BechAddr;
}
export interface MsgSuperfluidUndelegateAndUnbondLockDetails
  extends MsgBaseDetails {
  coin: Coin;
  lock_id: string;
  sender: BechAddr;
}
export interface MsgSuperfluidUndelegateDetails extends MsgBaseDetails {
  lock_id: string;
  sender: BechAddr;
}
export interface MsgUnPoolWhitelistedPoolDetails extends MsgBaseDetails {
  pool_id: string;
  sender: BechAddr;
}

export interface MsgAddToConcentratedLiquiditySuperfluidPositionDetails
  extends MsgBaseDetails {
  position_id: string;
  sender: BechAddr;
  token_desired0: Coin;
  token_desired1: Coin;
}
export interface MsgCreateFullRangePositionAndSuperfluidDelegateDetails
  extends MsgBaseDetails {
  coins: Coin[];
  pool_id: string;
  sender: BechAddr;
  val_addr: ValidatorAddr;
}
export interface MsgLockExistingFullRangePositionAndSFStakeDetails
  extends MsgBaseDetails {
  position_id: string;
  sender: BechAddr;
  val_addr: ValidatorAddr;
}
export interface MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionDetails
  extends MsgBaseDetails {
  lock_id: string;
  sender: BechAddr;
  shares_to_migrate: Coin;
  token_out_mins: Coin[];
}

export interface MsgBurnDetails extends MsgBaseDetails {
  amount: Coin;
  sender: BechAddr;
}
export interface MsgChangeAdminDetails extends MsgBaseDetails {
  denom: string;
  new_admin: BechAddr;
  sender: BechAddr;
}
// osmosis/tokenfactory
export interface MsgCreateDenomDetails extends MsgBaseDetails {
  sender: BechAddr;
  subdenom: string;
}
export interface MsgMintDetails extends MsgBaseDetails {
  amount: Coin;
  sender: BechAddr;
}
export interface MsgSetDenomMetadataDetails extends MsgBaseDetails {
  metadata: object;
  sender: BechAddr;
}

export interface MsgForceTransferDetails extends MsgBaseDetails {
  amount: Coin;
  sender: BechAddr;
  transfer_from_address: BechAddr;
  transfer_to_address: BechAddr;
}
export interface MsgSetBeforeSendHookDetails extends MsgBaseDetails {
  cosmwasm_address: string;
  denom: string;
  sender: BechAddr;
}

export interface MsgSetBaseDenomsDetails extends MsgBaseDetails {
  admin: BechAddr;
  base_denoms: object[];
}
export interface MsgSetDeveloperAccountDetails extends MsgBaseDetails {
  admin: BechAddr;
  developer_account: BechAddr;
}
// osmosis/protorev
export interface MsgSetHotRoutesDetails extends MsgBaseDetails {
  admin: BechAddr;
  hot_routes: object[];
}
export interface MsgSetMaxPoolPointsPerBlockDetails extends MsgBaseDetails {
  admin: BechAddr;
  max_pool_points_per_block: string;
}
export interface MsgSetMaxPoolPointsPerTxDetails extends MsgBaseDetails {
  admin: BechAddr;
  max_pool_points_per_tx: string;
}
export interface MsgSetPoolWeightsDetails extends MsgBaseDetails {
  admin: BechAddr;
  pool_weights: object;
}

export interface MsgDelegateBondedTokensDetails extends MsgBaseDetails {
  delegator: BechAddr;
  lockID: string;
}
// osmosis/valset-pref
export interface MsgDelegateToValidatorSetDetails extends MsgBaseDetails {
  coin: Coin;
  delegator: BechAddr;
}
export interface MsgRedelegateValidatorSetDetails extends MsgBaseDetails {
  delegator: BechAddr;
  preferences: object[];
}
export interface MsgSetValidatorSetPreferenceDetails extends MsgBaseDetails {
  delegator: BechAddr;
  preferences: object[];
}
export interface MsgUndelegateFromValidatorSetDetails extends MsgBaseDetails {
  coin: Coin;
  delegator: BechAddr;
}
export interface MsgWithdrawDelegationRewardsDetails extends MsgBaseDetails {
  delegator: BechAddr;
}

// osmosis/poolmanager
export interface MsgSplitRouteSwapExactAmountInDetails extends MsgBaseDetails {
  routes: object[];
  sender: BechAddr;
  token_in_denom: string;
  token_out_min_amount: string;
}
export interface MsgSplitRouteSwapExactAmountOutDetails extends MsgBaseDetails {
  routes: object[];
  sender: BechAddr;
  token_in_max_amount: string;
  token_out_denom: string;
}

export interface MsgAddToPositionDetails extends MsgBaseDetails {
  amount0: string;
  amount1: string;
  position_id: string;
  sender: BechAddr;
  token_min_amount0: string;
  token_min_amount1: string;
}
export interface MsgCollectIncentivesDetails extends MsgBaseDetails {
  position_ids: string[];
  sender: BechAddr;
}
export interface MsgCollectSpreadRewardsDetails extends MsgBaseDetails {
  position_ids: string[];
  sender: BechAddr;
}
export interface MsgCreateConcentratedPoolDetails extends MsgBaseDetails {
  denom0: string;
  denom1: string;
  sender: BechAddr;
  spread_factor: string;
  tick_spacing: string;
}
// osmosis/concentratedliquidity
export interface MsgCreatePositionDetails extends MsgBaseDetails {
  lower_tick: string;
  pool_id: string;
  sender: BechAddr;
  token_min_amount0: string;
  token_min_amount1: string;
  tokens_provided: Coin[];
  upper_tick: string;
}
export interface MsgWithdrawPositionDetails extends MsgBaseDetails {
  liquidity_amount: string;
  position_id: string;
  sender: BechAddr;
}

// osmosis/cosmwasmpool
export interface MsgCreateCosmWasmPoolDetails extends MsgBaseDetails {
  code_id: string;
  instantiate_msg: string;
  sender: string;
}

export type MsgReturnType<T extends TypeUrl> =
  T extends "/initia.move.v1.MsgExecute"
    ? MsgExecuteModuleDetails
    : T extends "/cosmwasm.wasm.v1.MsgStoreCode"
      ? MsgStoreCodeDetails
      : T extends "/cosmwasm.wasm.v1.MsgInstantiateContract"
        ? MsgInstantiateDetails
        : T extends "/cosmwasm.wasm.v1.MsgInstantiateContract2"
          ? MsgInstantiate2Details
          : T extends "/cosmwasm.wasm.v1.MsgExecuteContract"
            ? MsgExecuteDetails
            : T extends "/cosmwasm.wasm.v1.MsgMigrateContract"
              ? MsgMigrateDetails
              : T extends "/cosmwasm.wasm.v1.MsgUpdateAdmin"
                ? MsgUpdateAdminDetails
                : T extends "/cosmwasm.wasm.v1.MsgClearAdmin"
                  ? MsgClearAdminDetails
                  : T extends "/cosmos.bank.v1beta1.MsgSend"
                    ? MsgSendDetails
                    : T extends "/cosmos.bank.v1beta1.MsgMultiSend"
                      ? MsgMultiSendDetails
                      : T extends "/cosmos.authz.v1beta1.MsgGrant"
                        ? MsgGrantDetails
                        : T extends "/cosmos.authz.v1beta1.MsgRevoke"
                          ? MsgRevokeDetails
                          : T extends "/cosmos.authz.v1beta1.MsgExec"
                            ? MsgExecDetails
                            : T extends "/cosmos.crisis.v1beta1.MsgVerifyInvariant"
                              ? MsgVerifyInvariantDetails
                              : T extends "/cosmos.distribution.v1beta1.MsgSetWithdrawAddress"
                                ? MsgSetWithdrawAddressDetails
                                : T extends "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward"
                                  ? MsgWithdrawDelegatorRewardDetails
                                  : T extends "/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission"
                                    ? MsgWithdrawValidatorCommissionDetails
                                    : T extends "/cosmos.distribution.v1beta1.MsgFundCommunityPool"
                                      ? MsgFundCommunityPoolDetails
                                      : T extends "/cosmos.evidence.v1beta1.MsgSubmitEvidence"
                                        ? MsgSubmitEvidenceDetails
                                        : T extends "/cosmos.feegrant.v1beta1.MsgGrantAllowance"
                                          ? MsgGrantAllowanceDetails
                                          : T extends "/cosmos.feegrant.v1beta1.MsgRevokeAllowance"
                                            ? MsgRevokeAllowanceDetails
                                            : T extends "/cosmos.gov.v1beta1.MsgSubmitProposal"
                                              ? MsgSubmitProposalDetails
                                              : T extends "/cosmos.gov.v1beta1.MsgVote"
                                                ? MsgVoteDetails
                                                : T extends "/cosmos.gov.v1beta1.MsgVoteWeighted"
                                                  ? MsgVoteWeightedDetails
                                                  : T extends "/cosmos.gov.v1beta1.MsgDeposit"
                                                    ? MsgDepositDetails
                                                    : T extends "/cosmos.slashing.v1beta1.MsgUnjail"
                                                      ? MsgUnjailDetails
                                                      : T extends "/cosmos.staking.v1beta1.MsgCreateValidator"
                                                        ? MsgCreateValidatorDetails
                                                        : T extends "/cosmos.staking.v1beta1.MsgEditValidator"
                                                          ? MsgEditValidatorDetails
                                                          : T extends "/cosmos.staking.v1beta1.MsgDelegate"
                                                            ? MsgDelegateDetails
                                                            : T extends "/cosmos.staking.v1beta1.MsgUndelegate"
                                                              ? MsgUndelegateDetails
                                                              : T extends "/cosmos.staking.v1beta1.MsgBeginRedelegate"
                                                                ? MsgBeginRedelegateDetails
                                                                : T extends "/ibc.applications.transfer.v1.MsgTransfer"
                                                                  ? MsgTransferDetails
                                                                  : T extends "/ibc.core.client.v1.MsgCreateClient"
                                                                    ? MsgCreateClientDetails
                                                                    : T extends "/ibc.core.client.v1.MsgUpdateClient"
                                                                      ? MsgUpdateClientDetails
                                                                      : T extends "/ibc.core.client.v1.MsgUpgradeClient"
                                                                        ? MsgUpgradeClientDetails
                                                                        : T extends "/ibc.core.client.v1.MsgSubmitMisbehaviour"
                                                                          ? MsgSubmitMisbehaviourDetails
                                                                          : T extends "/ibc.core.connection.v1.MsgConnectionOpenInit"
                                                                            ? MsgConnectionOpenInitDetails
                                                                            : T extends "/ibc.core.connection.v1.MsgConnectionOpenTry"
                                                                              ? MsgConnectionOpenTryDetails
                                                                              : T extends "/ibc.core.connection.v1.MsgConnectionOpenAck"
                                                                                ? MsgConnectionOpenAckDetails
                                                                                : T extends "/ibc.core.connection.v1.MsgConnectionOpenConfirm"
                                                                                  ? MsgConnectionOpenConfirmDetails
                                                                                  : T extends "/ibc.core.channel.v1.MsgChannelOpenInit"
                                                                                    ? MsgChannelOpenInitDetails
                                                                                    : T extends "/ibc.core.channel.v1.MsgChannelOpenTry"
                                                                                      ? MsgChannelOpenTryDetails
                                                                                      : T extends "/ibc.core.channel.v1.MsgChannelOpenAck"
                                                                                        ? MsgChannelOpenAckDetails
                                                                                        : T extends "/ibc.core.channel.v1.MsgChannelOpenConfirm"
                                                                                          ? MsgChannelOpenConfirmDetails
                                                                                          : T extends "/ibc.core.channel.v1.MsgChannelCloseInit"
                                                                                            ? MsgChannelCloseInitDetails
                                                                                            : T extends "/ibc.core.channel.v1.MsgChannelCloseConfirm"
                                                                                              ? MsgChannelCloseConfirmDetails
                                                                                              : T extends "/ibc.core.channel.v1.MsgRecvPacket"
                                                                                                ? MsgRecvPacketDetails
                                                                                                : T extends "/ibc.core.channel.v1.MsgTimeout"
                                                                                                  ? MsgTimeoutDetails
                                                                                                  : T extends "/ibc.core.channel.v1.MsgTimeoutOnClose"
                                                                                                    ? MsgTimeoutOnCloseDetails
                                                                                                    : T extends "/ibc.core.channel.v1.MsgAcknowledgement"
                                                                                                      ? MsgAcknowledgementDetails
                                                                                                      : T extends "/osmosis.gamm.poolmodels.balancer.v1beta1.MsgCreateBalancerPool"
                                                                                                        ? MsgCreateBalancerPoolDetails
                                                                                                        : T extends "/osmosis.gamm.poolmodels.stableswap.v1beta1.MsgCreateStableswapPool"
                                                                                                          ? MsgCreateStableswapPoolDetails
                                                                                                          : T extends "/osmosis.gamm.poolmodels.stableswap.v1beta1.MsgStableSwapAdjustScalingFactors"
                                                                                                            ? MsgStableSwapAdjustScalingFactorsDetails
                                                                                                            : T extends "/osmosis.gamm.v1beta1.MsgJoinPool"
                                                                                                              ? MsgJoinPoolDetails
                                                                                                              : T extends "/osmosis.gamm.v1beta1.MsgExitPool"
                                                                                                                ? MsgExitPoolDetails
                                                                                                                : T extends
                                                                                                                      | "/osmosis.gamm.v1beta1.MsgSwapExactAmountIn"
                                                                                                                      | "/osmosis.poolmanager.v1beta1.MsgSwapExactAmountIn"
                                                                                                                  ? MsgSwapExactAmountInDetails
                                                                                                                  : T extends
                                                                                                                        | "/osmosis.gamm.v1beta1.MsgSwapExactAmountOut"
                                                                                                                        | "/osmosis.poolmanager.v1beta1.MsgSwapExactAmountOut"
                                                                                                                    ? MsgSwapExactAmountOutDetails
                                                                                                                    : T extends "/osmosis.poolmanager.v1beta1.MsgSplitRouteSwapExactAmountIn"
                                                                                                                      ? MsgSplitRouteSwapExactAmountInDetails
                                                                                                                      : T extends "/osmosis.poolmanager.v1beta1.MsgSplitRouteSwapExactAmountOut"
                                                                                                                        ? MsgSplitRouteSwapExactAmountOutDetails
                                                                                                                        : T extends "/osmosis.gamm.v1beta1.MsgJoinSwapExternAmountIn"
                                                                                                                          ? MsgJoinSwapExternAmountInDetails
                                                                                                                          : T extends "/osmosis.gamm.v1beta1.MsgJoinSwapShareAmountOut"
                                                                                                                            ? MsgJoinSwapShareAmountOutDetails
                                                                                                                            : T extends "/osmosis.gamm.v1beta1.MsgExitSwapShareAmountIn"
                                                                                                                              ? MsgExitSwapShareAmountInDetails
                                                                                                                              : T extends "/osmosis.gamm.v1beta1.MsgExitSwapExternAmountOut"
                                                                                                                                ? MsgExitSwapExternAmountOutDetails
                                                                                                                                : T extends "/osmosis.incentives.MsgCreateGauge"
                                                                                                                                  ? MsgCreateGaugeDetails
                                                                                                                                  : T extends "/osmosis.incentives.MsgAddToGauge"
                                                                                                                                    ? MsgAddToGaugeDetails
                                                                                                                                    : T extends "/osmosis.lockup.MsgLockTokens"
                                                                                                                                      ? MsgLockTokensDetails
                                                                                                                                      : T extends "/osmosis.lockup.MsgBeginUnlockingAll"
                                                                                                                                        ? MsgBeginUnlockingAllDetails
                                                                                                                                        : T extends "/osmosis.lockup.MsgBeginUnlocking"
                                                                                                                                          ? MsgBeginUnlockingDetails
                                                                                                                                          : T extends "/osmosis.lockup.MsgForceUnlock"
                                                                                                                                            ? MsgForceUnlockDetails
                                                                                                                                            : T extends "/osmosis.lockup.MsgExtendLockup"
                                                                                                                                              ? MsgExtendLockupDetails
                                                                                                                                              : T extends "/osmosis.lockup.MsgSetRewardReceiverAddress"
                                                                                                                                                ? MsgSetRewardReceiverAddressDetails
                                                                                                                                                : T extends "/osmosis.superfluid.MsgSuperfluidDelegate"
                                                                                                                                                  ? MsgSuperfluidDelegateDetails
                                                                                                                                                  : T extends "/osmosis.superfluid.MsgSuperfluidUndelegate"
                                                                                                                                                    ? MsgSuperfluidUndelegateDetails
                                                                                                                                                    : T extends "/osmosis.superfluid.MsgSuperfluidUnbondLock"
                                                                                                                                                      ? MsgSuperfluidUnbondLockDetails
                                                                                                                                                      : T extends "/osmosis.superfluid.MsgLockAndSuperfluidDelegate"
                                                                                                                                                        ? MsgLockAndSuperfluidDelegateDetails
                                                                                                                                                        : T extends "/osmosis.superfluid.MsgUnPoolWhitelistedPool"
                                                                                                                                                          ? MsgUnPoolWhitelistedPoolDetails
                                                                                                                                                          : T extends "/osmosis.superfluid.MsgSuperfluidUndelegateAndUnbondLock"
                                                                                                                                                            ? MsgSuperfluidUndelegateAndUnbondLockDetails
                                                                                                                                                            : T extends "/osmosis.superfluid.MsgCreateFullRangePositionAndSuperfluidDelegate"
                                                                                                                                                              ? MsgCreateFullRangePositionAndSuperfluidDelegateDetails
                                                                                                                                                              : T extends "/osmosis.superfluid.MsgUnlockAndMigrateSharesToFullRangeConcentratedPosition"
                                                                                                                                                                ? MsgUnlockAndMigrateSharesToFullRangeConcentratedPositionDetails
                                                                                                                                                                : T extends "/osmosis.superfluid.MsgAddToConcentratedLiquiditySuperfluidPosition"
                                                                                                                                                                  ? MsgAddToConcentratedLiquiditySuperfluidPositionDetails
                                                                                                                                                                  : T extends "/osmosis.superfluid.MsgLockExistingFullRangePositionAndSFStake"
                                                                                                                                                                    ? MsgLockExistingFullRangePositionAndSFStakeDetails
                                                                                                                                                                    : T extends "/osmosis.tokenfactory.v1beta1.MsgCreateDenom"
                                                                                                                                                                      ? MsgCreateDenomDetails
                                                                                                                                                                      : T extends "/osmosis.tokenfactory.v1beta1.MsgMint"
                                                                                                                                                                        ? MsgMintDetails
                                                                                                                                                                        : T extends "/osmosis.tokenfactory.v1beta1.MsgBurn"
                                                                                                                                                                          ? MsgBurnDetails
                                                                                                                                                                          : T extends "/osmosis.tokenfactory.v1beta1.MsgChangeAdmin"
                                                                                                                                                                            ? MsgChangeAdminDetails
                                                                                                                                                                            : T extends "/osmosis.tokenfactory.v1beta1.MsgSetDenomMetadata"
                                                                                                                                                                              ? MsgSetDenomMetadataDetails
                                                                                                                                                                              : T extends "/osmosis.tokenfactory.v1beta1.MsgForceTransfer"
                                                                                                                                                                                ? MsgForceTransferDetails
                                                                                                                                                                                : T extends "/osmosis.tokenfactory.v1beta1.MsgSetBeforeSendHook"
                                                                                                                                                                                  ? MsgSetBeforeSendHookDetails
                                                                                                                                                                                  : T extends "/osmosis.protorev.v1beta1.MsgSetHotRoutes"
                                                                                                                                                                                    ? MsgSetHotRoutesDetails
                                                                                                                                                                                    : T extends "/osmosis.protorev.v1beta1.MsgSetBaseDenoms"
                                                                                                                                                                                      ? MsgSetBaseDenomsDetails
                                                                                                                                                                                      : T extends "/osmosis.protorev.v1beta1.MsgSetDeveloperAccount"
                                                                                                                                                                                        ? MsgSetDeveloperAccountDetails
                                                                                                                                                                                        : T extends "/osmosis.protorev.v1beta1.MsgSetPoolWeights"
                                                                                                                                                                                          ? MsgSetPoolWeightsDetails
                                                                                                                                                                                          : T extends "/osmosis.protorev.v1beta1.MsgSetMaxPoolPointsPerTx"
                                                                                                                                                                                            ? MsgSetMaxPoolPointsPerTxDetails
                                                                                                                                                                                            : T extends "/osmosis.protorev.v1beta1.MsgSetMaxPoolPointsPerBlock"
                                                                                                                                                                                              ? MsgSetMaxPoolPointsPerBlockDetails
                                                                                                                                                                                              : T extends "/osmosis.valsetpref.v1beta1.MsgDelegateToValidatorSet"
                                                                                                                                                                                                ? MsgDelegateToValidatorSetDetails
                                                                                                                                                                                                : T extends "/osmosis.valsetpref.v1beta1.MsgUndelegateFromValidatorSet"
                                                                                                                                                                                                  ? MsgUndelegateFromValidatorSetDetails
                                                                                                                                                                                                  : T extends "/osmosis.valsetpref.v1beta1.MsgRedelegateValidatorSet"
                                                                                                                                                                                                    ? MsgRedelegateValidatorSetDetails
                                                                                                                                                                                                    : T extends "/osmosis.valsetpref.v1beta1.MsgWithdrawDelegationRewards"
                                                                                                                                                                                                      ? MsgWithdrawDelegationRewardsDetails
                                                                                                                                                                                                      : T extends "/osmosis.valsetpref.v1beta1.MsgDelegateBondedTokens"
                                                                                                                                                                                                        ? MsgDelegateBondedTokensDetails
                                                                                                                                                                                                        : T extends "/osmosis.valsetpref.v1beta1.MsgSetValidatorSetPreference"
                                                                                                                                                                                                          ? MsgSetValidatorSetPreferenceDetails
                                                                                                                                                                                                          : T extends "/osmosis.valsetpref.v1beta1.MsgCreatePosition"
                                                                                                                                                                                                            ? MsgCreatePositionDetails
                                                                                                                                                                                                            : T extends "/osmosis.valsetpref.v1beta1.MsgAddToPosition"
                                                                                                                                                                                                              ? MsgAddToPositionDetails
                                                                                                                                                                                                              : T extends "/osmosis.valsetpref.v1beta1.MsgWithdrawPosition"
                                                                                                                                                                                                                ? MsgWithdrawPositionDetails
                                                                                                                                                                                                                : T extends "/osmosis.valsetpref.v1beta1.MsgCollectSpreadRewards"
                                                                                                                                                                                                                  ? MsgCollectSpreadRewardsDetails
                                                                                                                                                                                                                  : T extends "/osmosis.valsetpref.v1beta1.MsgCollectIncentives"
                                                                                                                                                                                                                    ? MsgCollectIncentivesDetails
                                                                                                                                                                                                                    : T extends "/osmosis.concentratedliquidity.poolmodel.concentrated.v1beta1.MsgCreateConcentratedPool"
                                                                                                                                                                                                                      ? MsgCreateConcentratedPoolDetails
                                                                                                                                                                                                                      : T extends "/osmosis.cosmwasmpool.v1beta1.MsgCreateCosmWasmPool"
                                                                                                                                                                                                                        ? MsgCreateCosmWasmPoolDetails
                                                                                                                                                                                                                        : MsgBaseDetails;
