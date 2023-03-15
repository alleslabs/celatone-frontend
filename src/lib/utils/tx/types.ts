import type { Coin } from "@cosmjs/stargate";

import type { TypeUrl } from "lib/services/tx";
import type {
  Addr,
  ContractAddr,
  InstantiatePermission,
  Option,
  ValidatorAddr,
} from "lib/types";

import type { VoteOption } from "./mapping";

export interface MsgUnknownDetails {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface InstantiatePermissionResponse {
  permission: InstantiatePermission;
  address: Addr;
  addresses: Addr[];
}

// cosmwasm/wasm
export interface MsgStoreCodeDetails extends MsgUnknownDetails {
  code_id: Option<string>;
  sender: Addr;
  wasm_byte_code: string; // base64
  instantiate_permission: InstantiatePermissionResponse | null;
}

export interface MsgInstantiateDetails extends MsgUnknownDetails {
  contract_address: Option<ContractAddr>;
  sender: Addr;
  admin: Addr;
  code_id: string;
  label: string;
  msg: object;
  funds: Coin[];
}

export interface MsgInstantiate2Details extends MsgInstantiateDetails {
  salt: string;
  fix_msg: boolean;
}

export interface MsgExecuteDetails extends MsgUnknownDetails {
  sender: Addr;
  contract: ContractAddr;
  msg: object;
  funds: Coin[];
}

export interface MsgMigrateDetails extends MsgUnknownDetails {
  sender: Addr;
  contract: ContractAddr;
  code_id: string;
  msg: object;
}

export interface MsgUpdateAdminDetails extends MsgUnknownDetails {
  sender: Addr;
  new_admin: Addr;
  contract: ContractAddr;
}

export interface MsgClearAdminDetails extends MsgUnknownDetails {
  sender: Addr;
  contract: ContractAddr;
}

// x/authz
export interface MsgGrantDetails extends MsgUnknownDetails {
  granter: Addr;
  grantee: Addr;
  grant: object;
}
export interface MsgRevokeDetails extends MsgUnknownDetails {
  granter: Addr;
  grantee: Addr;
  msg_type_url: string;
}
export interface MsgExecDetails extends MsgUnknownDetails {
  grantee: Addr;
  msgs: object[];
  msg_type_url: string;
}

// x/bank
export interface MsgSendDetails extends MsgUnknownDetails {
  from_address: Addr;
  to_address: Addr;
  amount: Coin[];
}
export interface MsgMultiSendDetails extends MsgUnknownDetails {
  inputs: object;
  outputs: object;
}

// x/crisis
export interface MsgVerifyInvariantDetails extends MsgUnknownDetails {
  sender: Addr;
  invariant_module_name: string;
  invariant_route: string;
}

// x/distribution
export interface MsgSetWithdrawAddressDetails extends MsgUnknownDetails {
  delegator_address: Addr;
  withdraw_address: Addr;
}
export interface MsgWithdrawDelegatorRewardDetails extends MsgUnknownDetails {
  delegator_address: Addr;
  validator_address: ValidatorAddr;
}
export interface MsgWithdrawValidatorCommissionDetails
  extends MsgUnknownDetails {
  validator_address: ValidatorAddr;
}
export interface MsgFundCommunityPoolDetails extends MsgUnknownDetails {
  amount: Coin[];
  depositor: Addr;
}

// x/evidence
export interface MsgSubmitEvidenceDetails extends MsgUnknownDetails {
  submitter: Addr;
  evidence: object;
}

// x/feegrant
export interface MsgGrantAllowanceDetails extends MsgUnknownDetails {
  granter: Addr;
  grantee: Addr;
  allowance: object;
}
export interface MsgRevokeAllowanceDetails extends MsgUnknownDetails {
  granter: Addr;
  grantee: Addr;
}

// x/gov
export interface MsgSubmitProposalDetails extends MsgUnknownDetails {
  initial_deposit: Coin[];
  proposer: Addr;
  proposal_id: Option<string>;
  proposal_type: Option<string>;
  title: string;
}
export interface MsgVoteDetails extends MsgUnknownDetails {
  proposal_id: string;
  voter: Addr;
  option: VoteOption;
}
export interface MsgVoteWeightedDetails extends MsgUnknownDetails {
  proposal_id: string;
  voter: Addr;
  options: { option: VoteOption; weight: string }[];
}
export interface MsgDepositDetails extends MsgUnknownDetails {
  proposal_id: string;
  depositor: Addr;
  amount: Coin[];
}

// x/slashing
export interface MsgUnjailDetails extends MsgUnknownDetails {
  validator_addr: ValidatorAddr;
}

// x/staking
export interface MsgCreateValidatorDetails extends MsgUnknownDetails {
  description: object;
  commission: object;
  min_self_delegation: string;
  delegator_address: Addr;
  validator_address: ValidatorAddr;
  pubkey: object;
  value: Coin;
}
export interface MsgEditValidatorDetails extends MsgUnknownDetails {
  description: object;
  validator_address: ValidatorAddr;
  commission_rate: string;
  min_self_delegation: string;
}
export interface MsgDelegateDetails extends MsgUnknownDetails {
  delegator_address: Addr;
  validator_address: ValidatorAddr;
  amount: Coin;
}
export interface MsgBeginRedelegateDetails extends MsgUnknownDetails {
  delegator_address: Addr;
  validator_src_address: ValidatorAddr;
  validator_dst_address: ValidatorAddr;
  amount: Coin;
}
export interface MsgUndelegateDetails extends MsgUnknownDetails {
  delegator_address: Addr;
  validator_address: ValidatorAddr;
  amount: Coin;
}

// ibc/applications
export interface MsgTransferDetails extends MsgUnknownDetails {
  source_port: string;
  source_channel: string;
  token: Coin;
  sender: Addr;
  receiver: Addr;
  timeout_height: object;
  timeout_timestamp: string;
  memo: string;
}

// ibc/core
export interface MsgCreateClientDetails extends MsgUnknownDetails {
  client_state: object;
  consensus_state: object;
  signer: Addr;
}
export interface MsgUpdateClientDetails extends MsgUnknownDetails {
  client_id: string;
  header: object;
  signer: Addr;
}
export interface MsgUpgradeClientDetails extends MsgUnknownDetails {
  client_id: string;
  client_state: object;
  consensus_state: object;
  proof_upgrade_client: string;
  proof_upgrade_consensus_state: string;
  signer: Addr;
}
export interface MsgSubmitMisbehaviourDetails extends MsgUnknownDetails {
  client_id: string;
  misbehaviour: object;
  signer: Addr;
}
export interface MsgConnectionOpenInitDetails extends MsgUnknownDetails {
  client_id: string;
  counterparty: object;
  version: object;
  delay_period: number;
  signer: Addr;
}
export interface MsgConnectionOpenTryDetails extends MsgUnknownDetails {
  client_id: string;
  previous_connection_id: string;
  client_state: object;
  counterparty: object;
  delay_period: number;
  counterparty_versions: object;
  proof_height: object;
  proof_init: string;
  proof_client: string;
  proof_consensus: string;
  consensus_height: object;
  signer: Addr;
}
export interface MsgConnectionOpenAckDetails extends MsgUnknownDetails {
  connection_id: string;
  counterparty_connection_id: string;
  version: object;
  client_state: object;
  proof_height: object;
  proof_try: string;
  proof_client: string;
  proof_consensus: string;
  consensus_height: object;
  signer: Addr;
}
export interface MsgConnectionOpenConfirmDetails extends MsgUnknownDetails {
  connection_id: string;
  proof_ack: string;
  proof_height: object;
  signer: Addr;
}
export interface MsgChannelOpenInitDetails extends MsgUnknownDetails {
  port_id: string;
  channel: object;
  signer: Addr;
}
export interface MsgChannelOpenTryDetails extends MsgUnknownDetails {
  port_id: string;
  previous_channel_id: string;
  channel: object;
  counterparty_version: string;
  proof_init: string;
  proof_height: object;
  signer: Addr;
}
export interface MsgChannelOpenAckDetails extends MsgUnknownDetails {
  port_id: string;
  channel_id: string;
  counterparty_channel_id: string;
  counterparty_version: string;
  proof_try: string;
  proof_height: object;
  signer: Addr;
}
export interface MsgChannelOpenConfirmDetails extends MsgUnknownDetails {
  port_id: string;
  channel_id: string;
  proof_ack: string;
  proof_height: object;
  signer: Addr;
}
export interface MsgChannelCloseInitDetails extends MsgUnknownDetails {
  port_id: string;
  channel_id: string;
  signer: Addr;
}
export interface MsgChannelCloseConfirmDetails extends MsgUnknownDetails {
  port_id: string;
  channel_id: string;
  proof_init: string;
  proof_height: object;
  signer: Addr;
}
export interface MsgRecvPacketDetails extends MsgUnknownDetails {
  packet: object;
  proof_commitment: string;
  proof_height: object;
  signer: Addr;
}
export interface MsgTimeoutDetails extends MsgUnknownDetails {
  packet: object;
  proof_unreceived: string;
  proof_height: object;
  next_sequence_recv: number;
  signer: Addr;
}
export interface MsgTimeoutOnCloseDetails extends MsgUnknownDetails {
  packet: object;
  proof_unreceived: string;
  proof_close: string;
  proof_height: object;
  next_sequence_recv: number;
  signer: Addr;
}
export interface MsgAcknowledgementDetails extends MsgUnknownDetails {
  packet: object;
  acknowledgement: string;
  proof_acked: string;
  proof_height: object;
  signer: Addr;
}

// osmosis/gamm
export interface MsgCreateBalancerPoolDetails extends MsgUnknownDetails {
  sender: Addr;
  pool_params: object;
  pool_assets: object;
  future_pool_governor: string;
}
export interface MsgCreateStableswapPoolDetails extends MsgUnknownDetails {
  sender: Addr;
  pool_params: object;
  initial_pool_liquidity: Coin[];
  scaling_factors: string[];
  future_pool_governor: string;
  scaling_factor_controller: string;
}
export interface MsgStableSwapAdjustScalingFactorsDetails
  extends MsgUnknownDetails {
  sender: Addr;
  pool_id: string;
  scaling_factors: string[];
}
export interface MsgJoinPoolDetails extends MsgUnknownDetails {
  sender: Addr;
  pool_id: string;
  share_out_amount: string;
  token_in_maxs: Coin[];
}
export interface MsgExitPoolDetails extends MsgUnknownDetails {
  sender: Addr;
  pool_id: string;
  share_in_amount: string;
  token_out_mins: Coin[];
}
export interface MsgSwapExactAmountInDetails extends MsgUnknownDetails {
  sender: Addr;
  routes: object;
  token_in: Coin;
  token_out_min_amount: string;
}
export interface MsgSwapExactAmountOutDetails extends MsgUnknownDetails {
  sender: Addr;
  routes: object;
  token_in_max_amount: string;
  token_out: Coin;
}
export interface MsgJoinSwapExternAmountInDetails extends MsgUnknownDetails {
  sender: Addr;
  pool_id: string;
  token_in: Coin;
  share_out_min_amount: string;
}
export interface MsgJoinSwapShareAmountOutDetails extends MsgUnknownDetails {
  sender: Addr;
  pool_id: string;
  token_in_denom: string;
  share_out_amount: string;
  token_in_max_amount: string;
}
export interface MsgExitSwapShareAmountInDetails extends MsgUnknownDetails {
  sender: Addr;
  pool_id: string;
  token_out_denom: string;
  share_in_amount: string;
  token_out_min_amount: string;
}
export interface MsgExitSwapExternAmountOutDetails extends MsgUnknownDetails {
  sender: Addr;
  pool_id: string;
  token_out: Coin;
  share_in_max_amount: string;
}

// osmosis/incentives
export interface MsgCreateGaugeDetails extends MsgUnknownDetails {
  is_perpetual: boolean;
  owner: Addr;
  distribute_to: object;
  coins: Coin[];
  start_time: string;
  num_epochs_paid_over: string;
}
export interface MsgAddToGaugeDetails extends MsgUnknownDetails {
  owner: Addr;
  gauge_id: string;
  rewards: Coin[];
}

// osmosis/lockup
export interface MsgLockTokensDetails extends MsgUnknownDetails {
  owner: Addr;
  duration: string;
  coins: Coin[];
}
export interface MsgBeginUnlockingAllDetails extends MsgUnknownDetails {
  owner: Addr;
}
export interface MsgBeginUnlockingDetails extends MsgUnknownDetails {
  owner: Addr;
  ID: string;
  coins: Coin[];
}
export interface MsgExtendLockupDetails extends MsgUnknownDetails {
  owner: Addr;
  ID: string;
  duration: string;
}
export interface MsgForceUnlockDetails extends MsgUnknownDetails {
  owner: Addr;
  ID: string;
  coins: Coin[];
}

// osmosis/superfluid
export interface MsgSuperfluidDelegateDetails extends MsgUnknownDetails {
  sender: Addr;
  lock_id: string;
  val_addr: ValidatorAddr;
}
export interface MsgSuperfluidUndelegateDetails extends MsgUnknownDetails {
  sender: Addr;
  lock_id: string;
}
export interface MsgSuperfluidUnbondLockDetails extends MsgUnknownDetails {
  sender: Addr;
  lock_id: string;
}
export interface MsgLockAndSuperfluidDelegateDetails extends MsgUnknownDetails {
  sender: Addr;
  coins: Coin[];
  val_addr: ValidatorAddr;
}
export interface MsgUnPoolWhitelistedPoolDetails extends MsgUnknownDetails {
  sender: Addr;
  pool_id: string;
}

// osmosis/tokenfactory
export interface MsgCreateDenomDetails extends MsgUnknownDetails {
  sender: Addr;
  subdenom: string;
}
export interface MsgMintDetails extends MsgUnknownDetails {
  sender: Addr;
  amount: Coin;
}
export interface MsgBurnDetails extends MsgUnknownDetails {
  sender: Addr;
  amount: Coin;
}
export interface MsgChangeAdminDetails extends MsgUnknownDetails {
  sender: Addr;
  denom: string;
  new_admin: Addr;
}
export interface MsgSetDenomMetadataDetails extends MsgUnknownDetails {
  sender: Addr;
  metadata: object;
}

export type MsgReturnType<T extends TypeUrl> =
  T extends "/cosmwasm.wasm.v1.MsgStoreCode"
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
    : T extends "/osmosis.gamm.v1beta1.MsgSwapExactAmountIn"
    ? MsgSwapExactAmountInDetails
    : T extends "/osmosis.gamm.v1beta1.MsgSwapExactAmountOut"
    ? MsgSwapExactAmountOutDetails
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
    : MsgUnknownDetails;
