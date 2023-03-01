/* eslint-disable sonarjs/max-switch-cases */
/* eslint-disable complexity */
import { Flex } from "@chakra-ui/react";
import { findAttribute } from "@cosmjs/stargate/build/logs";
import big from "big.js";

import type { TxMsgData } from "..";
import { CopyButton } from "lib/components/copy";
import { PermissionChip } from "lib/components/PermissionChip";
import { ViewPermissionAddresses } from "lib/components/ViewPermissionAddresses";
import type { AddressReturnType } from "lib/hooks";
import type { TxReceipt, Option, AssetInfo } from "lib/types";
import { formatUTC, parseDate } from "lib/utils";

import { voteOption } from "./mapping";
import {
  attachFundsReceipt,
  channelIdReceipt,
  clientStateReceipt,
  delegatorAddrReceipt,
  getCommonReceiptHtml,
  proofHeightReceipt,
  proofInitReceipt,
  proposalIdReceipt,
  validatorAddrReceipt,
  getGenericValueEntry,
  getCoinComponent,
} from "./renderUtils";

export const generateReceipts = (
  { type, value, log }: TxMsgData,
  getAddressType: (address: string) => AddressReturnType,
  assetInfos: Option<{ [key: string]: AssetInfo }>
): Option<TxReceipt>[] => {
  switch (type) {
    // cosmwasm/wasm
    case "wasm/MsgStoreCode":
      return [
        log && {
          title: "Stored Code ID",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: findAttribute([log], "store_code", "code_id").value,
            linkType: "code_id",
          }),
        },
        {
          title: "Uploader",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.sender,
            linkType: getAddressType(value.sender),
          }),
        },
        value.instantiatePermission && {
          title: "Instantiate Permission",
          html: (
            <Flex direction="column" gap={1}>
              <PermissionChip
                instantiatePermission={value.instantiatePermission.permission}
                permissionAddresses={
                  value.instantiatePermission.address ||
                  value.instantiatePermission.addresses
                }
              />
              <ViewPermissionAddresses
                permissionAddresses={
                  value.instantiatePermission.address ||
                  value.instantiatePermission.addresses
                }
              />
            </Flex>
          ),
        },
        {
          title: "Wasm Byte Code",
          html: (
            <Flex gap={3} align="flex-start">
              Size:{" "}
              {big(Buffer.from(value.wasmByteCode).byteLength)
                .div(1024)
                .toFixed(1)}{" "}
              KB
              <CopyButton
                value={value.wasmByteCode}
                variant="ghost-primary"
                tooltipBgColor="lilac.darker"
                buttonText="Click to Copy"
                hasIcon={false}
                mt={-1}
              />
            </Flex>
          ),
        },
      ];
    case "wasm/MsgInstantiateContract":
      return [
        log && {
          title: "Contract Instance",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: findAttribute([log], "instantiate", "_contract_address")
              .value,
            linkType: "contract_address",
          }),
        },

        {
          title: "From Code ID",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.codeId,
            linkType: "code_id",
          }),
        },
        {
          title: "Instantiated by",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.sender,
            linkType: getAddressType(value.sender),
          }),
        },
        {
          title: "Contract Admin",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.admin,
            linkType: getAddressType(value.admin),
            fallback: "No Admin",
          }),
        },
        {
          title: "Label",
          value: value.label,
        },
        attachFundsReceipt(value.funds, assetInfos),
        {
          title: "Instantiate Message",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.msg,
          }),
        },
      ];
    case "wasm/MsgInstantiateContract2":
      return [
        log && {
          title: "Contract Instance",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: findAttribute([log], "instantiate", "_contract_address")
              .value,
            linkType: "contract_address",
          }),
        },
        {
          title: "From Code ID",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.codeId,
            linkType: "code_id",
          }),
        },
        {
          title: "Instantiated by",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.sender,
            linkType: getAddressType(value.sender),
          }),
        },
        {
          title: "Contract Admin",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.admin,
            linkType: getAddressType(value.admin),
            fallback: "No Admin",
          }),
        },
        {
          title: "Label",
          value: value.label,
        },
        attachFundsReceipt(value.funds, assetInfos),
        {
          title: "Instantiate Message",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.msg,
          }),
        },
        {
          title: "Salt",
          html: value.salt,
        },
        value.fixMsg && {
          title: "Fix Msg",
          value: value.fixMsg,
        },
      ];
    case "wasm/MsgExecuteContract":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.sender,
            linkType: getAddressType(value.sender),
          }),
        },
        {
          title: "Contract",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.contract,
            linkType: "contract_address",
          }),
        },
        attachFundsReceipt(value.funds, assetInfos),
        {
          title: "Execute Message",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.msg,
          }),
        },
      ];
    case "wasm/MsgMigrateContract":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.sender,
            linkType: getAddressType(value.sender),
          }),
        },
        {
          title: "Contract",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.contract,
            linkType: "contract_address",
          }),
        },
        {
          title: "Code ID",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.codeId,
            linkType: "code_id",
          }),
        },
        {
          title: "Msg",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.msg,
          }),
        },
      ];
    case "wasm/MsgUpdateAdmin":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.sender,
            linkType: getAddressType(value.sender),
          }),
        },
        {
          title: "New Admin",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.newAdmin,
            linkType: getAddressType(value.newAdmin),
          }),
        },
        {
          title: "Contract",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.contract,
            linkType: "contract_address",
          }),
        },
      ];
    case "wasm/MsgClearAdmin":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.sender,
            linkType: getAddressType(value.sender),
          }),
        },
        {
          title: "Contract",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.contract,
            linkType: "contract_address",
          }),
        },
      ];
    // x/bank
    case "cosmos-sdk/MsgSend":
      return [
        {
          title: "From Address",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.fromAddress,
            linkType: getAddressType(value.fromAddress),
          }),
        },
        {
          title: "To Address",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.toAddress,
            linkType: getAddressType(value.toAddress),
          }),
        },
        {
          title: "Amount",
          html: getCoinComponent(value.amount, assetInfos),
        },
      ];
    case "cosmos-sdk/MsgMultiSend":
      return [
        {
          title: "Inputs",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.inputs,
          }),
        },
        {
          title: "Outputs",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.outputs,
          }),
        },
      ];
    // x/authz
    case "cosmos-sdk/MsgGrant":
      return [
        {
          title: "Granter",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.granter,
            linkType: getAddressType(value.granter),
          }),
        },
        {
          title: "Grantee",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.grantee,
            linkType: getAddressType(value.grantee),
          }),
        },
        {
          title: "Grant",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.grant,
          }),
        },
      ];
    case "cosmos-sdk/MsgRevoke":
      return [
        {
          title: "Granter",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.granter,
            linkType: getAddressType(value.granter),
          }),
        },
        {
          title: "Grantee",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.grantee,
            linkType: getAddressType(value.grantee),
          }),
        },
        {
          title: "Msg TypeUrl",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.msgTypeUrl,
          }),
        },
      ];
    case "cosmos-sdk/MsgExec":
      return [
        {
          title: "Grantee",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.grantee,
            linkType: getAddressType(value.grantee),
          }),
        },
        {
          title: "Msgs",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.msgs,
          }),
        },
      ];
    // x/crisis
    case "cosmos-sdk/MsgVerifyInvariant":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.sender,
            linkType: getAddressType(value.sender),
          }),
        },
        { title: "Invariant Module Name", value: value.invariantModuleName },
        { title: "Invariant Route", value: value.invariantRoute },
      ];
    // x/distribution
    case "cosmos-sdk/MsgSetWithdrawAddress":
    case "cosmos-sdk/MsgModifyWithdrawAddress":
      return [
        delegatorAddrReceipt(
          value.delegatorAddress,
          getAddressType(value.delegatorAddress)
        ),
        {
          title: "Withdraw Address",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.withdrawAddress,
            linkType: getAddressType(value.withdrawAddress),
          }),
        },
      ];
    case "cosmos-sdk/MsgWithdrawDelegatorReward":
    case "cosmos-sdk/MsgWithdrawDelegationReward":
      return [
        delegatorAddrReceipt(
          value.delegatorAddress,
          getAddressType(value.delegatorAddress)
        ),
        validatorAddrReceipt(value.validatorAddress),
      ];
    case "cosmos-sdk/MsgWithdrawValidatorCommission":
      return [validatorAddrReceipt(value.validatorAddress)];
    case "cosmos-sdk/MsgFundCommunityPool":
      return [
        {
          title: "Amount",
          html: getCoinComponent(value.amount, assetInfos),
        },
        {
          title: "Depositor",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.depositor,
            linkType: getAddressType(value.depositor),
          }),
        },
      ];
    // x/evidence
    case "cosmos-sdk/MsgSubmitEvidence":
      return [
        {
          title: "Submitter",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.submitter,
            linkType: getAddressType(value.submitter),
          }),
        },
        {
          title: "Evidence",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.evidence,
          }),
        },
      ];
    //  x/feegrant
    case "cosmos-sdk/MsgGrantAllowance":
      return [
        {
          title: "Granter",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.granter,
            linkType: getAddressType(value.granter),
          }),
        },
        {
          title: "Grantee",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.grantee,
            linkType: getAddressType(value.grantee),
          }),
        },
        {
          title: "Allowance",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.allowance,
          }),
        },
      ];
    case "cosmos-sdk/MsgRevokeAllowance":
      return [
        {
          title: "Granter",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.granter,
            linkType: getAddressType(value.granter),
          }),
        },
        {
          title: "Grantee",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.grantee,
            linkType: getAddressType(value.grantee),
          }),
        },
      ];
    // x/gov
    case "cosmos-sdk/MsgSubmitProposal":
      return [
        {
          title: "Initial Deposit",
          html: getCoinComponent(value.initialDeposit, assetInfos),
        },
        {
          title: "Proposer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.proposer,
            linkType: getAddressType(value.proposer),
          }),
        },
        ...(log
          ? [
              proposalIdReceipt(
                findAttribute([log], "submit_proposal", "proposal_id").value
              ),
              {
                title: "Proposal Type",
                value: findAttribute([log], "submit_proposal", "proposal_type")
                  .value,
              },
            ]
          : []),
        { title: "Title", value: value.content.title },
      ];
    case "cosmos-sdk/MsgVote":
      return [
        proposalIdReceipt(value.proposalId),
        {
          title: "Voter",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.voter,
            linkType: getAddressType(value.voter),
          }),
        },
        { title: "Option", value: voteOption[value.option as number] },
      ];
    case "cosmos-sdk/MsgVoteWeighted":
      return [
        proposalIdReceipt(value.proposalId),
        {
          title: "Voter",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.voter,
            linkType: getAddressType(value.voter),
          }),
        },
        {
          title: "Options",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.options,
          }),
        },
      ];
    case "cosmos-sdk/MsgDeposit":
      return [
        proposalIdReceipt(value.proposalId),
        {
          title: "Depositor",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.depositor,
            linkType: getAddressType(value.depositor),
          }),
        },
        {
          title: "Amount",
          html: getCoinComponent(value.amount, assetInfos),
        },
      ];
    // x/slashing
    case "cosmos-sdk/MsgUnjail":
      return [validatorAddrReceipt(value.address)];
    // x/staking
    case "cosmos-sdk/MsgCreateValidator":
      return [
        {
          title: "Description",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.description,
          }),
        },
        {
          title: "Commission",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.commission,
          }),
        },
        {
          title: "Min Self Delegation",
          value: value.minSelfDelegation,
        },
        delegatorAddrReceipt(
          value.delegatorAddress,
          getAddressType(value.delegatorAddress)
        ),
        validatorAddrReceipt(value.validatorAddress),
        {
          title: "Public Key",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.pubkey,
          }),
        },
        {
          title: "Value",
          html: getCoinComponent(value.value, assetInfos),
        },
      ];
    case "cosmos-sdk/MsgEditValidator":
      return [
        {
          title: "Description",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.description,
          }),
        },
        validatorAddrReceipt(value.validatorAddress),
        {
          title: "Commission Rate",
          value: value.commissionRate,
        },
        {
          title: "Min Self Delegation",
          value: value.minSelfDelegation,
        },
      ];
    case "cosmos-sdk/MsgDelegate":
    case "cosmos-sdk/MsgUndelegate":
      return [
        delegatorAddrReceipt(
          value.delegatorAddress,
          getAddressType(value.delegatorAddress)
        ),
        validatorAddrReceipt(value.validatorAddress),
        {
          title: "Amount",
          html: getCoinComponent(value.amount, assetInfos),
        },
      ];
    case "cosmos-sdk/MsgBeginRedelegate":
      return [
        delegatorAddrReceipt(
          value.delegatorAddress,
          getAddressType(value.delegatorAddress)
        ),
        {
          title: "Source Validator Address",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.validatorSrcAddress,
            linkType: "validator_address",
          }),
        },
        {
          title: "Destination Validator Address",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.validatorDstAddress,
            linkType: "validator_address",
          }),
        },
        {
          title: "Amount",
          html: getCoinComponent(value.amount, assetInfos),
        },
      ];
    // ibc/applications
    case "cosmos-sdk/MsgTransfer":
      return [
        {
          title: "Source Port",
          value: value.sourcePort,
        },
        {
          title: "Source Channel",
          value: value.sourceChannel,
        },
        {
          title: "Token",
          html: getCoinComponent(value.token, assetInfos),
        },
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.sender,
            linkType: getAddressType(value.sender),
          }),
        },
        {
          title: "Receiver",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.receiver,
            linkType: getAddressType(value.receiver),
          }),
        },
        value.timeoutHeight && {
          title: "Timeout Height",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.timeoutHeight,
          }),
        },
        value.timeoutTimestamp && {
          title: "Timeout Timestamp",
          value: formatUTC(parseDate(value.timeoutTimestamp)),
        },
        {
          title: "Memo",
          value: value.memo,
        },
      ];
    // ibc/core
    case "cosmos-sdk/MsgCreateClient":
      return [
        clientStateReceipt(value.clientState),
        {
          title: "Consensus State",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.consensusState,
          }),
        },
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.signer,
            linkType: getAddressType(value.signer),
          }),
        },
      ];
    case "cosmos-sdk/MsgUpdateClient":
      return [
        {
          title: "Client ID",
          value: value.clientId,
        },
        {
          title: "Header",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.header,
          }),
        },
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.signer,
            linkType: getAddressType(value.signer),
          }),
        },
      ];
    case "cosmos-sdk/MsgUpgradeClient":
      return [
        {
          title: "Client ID",
          value: value.clientId,
        },
        clientStateReceipt(value.clientState),
        {
          title: "Consensus State",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.consensusState,
          }),
        },
        {
          title: "Proof Upgrade Client",
          value: value.proofUpgradeClient,
        },
        {
          title: "Proof Upgrade Consensus State",
          value: value.proofUpgradeConsensusState,
        },
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.signer,
            linkType: getAddressType(value.signer),
          }),
        },
      ];
    case "cosmos-sdk/MsgSubmitMisbehaviour":
      return [
        {
          title: "Client ID",
          value: value.clientId,
        },
        {
          title: "Misbehaviour",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.misbehaviour,
          }),
        },
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.signer,
            linkType: getAddressType(value.signer),
          }),
        },
      ];
    case "cosmos-sdk/MsgConnectionOpenInit":
      return [
        {
          title: "Client ID",
          value: value.clientId,
        },
        {
          title: "Counterparty",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.counterparty,
          }),
        },
        {
          title: "Version",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.version,
          }),
        },
        {
          title: "Delay Period",
          value: value.delayPeriod,
        },
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.signer,
            linkType: getAddressType(value.signer),
          }),
        },
      ];
    case "cosmos-sdk/MsgConnectionOpenTry":
      return [
        {
          title: "Client ID",
          value: value.clientId,
        },
        {
          title: "Previous Connection ID",
          value: value.previousConnectionId,
        },
        clientStateReceipt(value.clientState),
        {
          title: "Counterparty",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.counterparty,
          }),
        },
        {
          title: "Delay Period",
          value: value.delayPeriod,
        },
        {
          title: "Counterparty Versions",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.counterpartyVersions,
          }),
        },
        proofHeightReceipt(value.proofHeight),
        proofInitReceipt(value.proofInit),
        {
          title: "Proof Client",
          value: value.proofClient,
        },
        {
          title: "Proof Consensus",
          value: value.proofConsensus,
        },
        {
          title: "Consensus Height",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.consensusHeight,
          }),
        },
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.signer,
            linkType: getAddressType(value.signer),
          }),
        },
      ];
    case "cosmos-sdk/MsgConnectionOpenAck":
      return [
        {
          title: "Connection ID",
          value: value.connectionId,
        },
        {
          title: "Counterparty Connection ID",
          value: value.counterpartyConnectionId,
        },
        {
          title: "Version",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.version,
          }),
        },
        clientStateReceipt(value.clientState),
        proofHeightReceipt(value.proofHeight),
        {
          title: "Proof Try",
          value: value.proofTry,
        },
        {
          title: "Proof Client",
          value: value.proofClient,
        },
        {
          title: "Proof Consensus",
          value: value.proofConsensus,
        },
        {
          title: "Consensus Height",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.consensusHeight,
          }),
        },
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.signer,
            linkType: getAddressType(value.signer),
          }),
        },
      ];
    case "cosmos-sdk/MsgConnectionOpenConfirm":
      return [
        {
          title: "Connection ID",
          value: value.connectionId,
        },
        {
          title: "Proof Ack",
          value: value.proofAck,
        },
        proofHeightReceipt(value.proofHeight),
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.signer,
            linkType: getAddressType(value.signer),
          }),
        },
      ];
    case "cosmos-sdk/MsgChannelOpenInit":
      return [
        {
          title: "Port ID",
          value: value.portId,
        },
        {
          title: "Channel",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.channel,
          }),
        },
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.signer,
            linkType: getAddressType(value.signer),
          }),
        },
      ];
    case "cosmos-sdk/MsgChannelOpenTry":
      return [
        {
          title: "Port ID",
          value: value.portId,
        },
        {
          title: "Previous Channel ID",
          value: value.previousChannelId,
        },
        {
          title: "Channel",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.channel,
          }),
        },
        {
          title: "Counterparty Version",
          value: value.counterpartyVersion,
        },
        proofInitReceipt(value.proofInit),
        proofHeightReceipt(value.proofHeight),
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.signer,
            linkType: getAddressType(value.signer),
          }),
        },
      ];
    case "cosmos-sdk/MsgChannelOpenAck":
      return [
        {
          title: "Port ID",
          value: value.portId,
        },
        channelIdReceipt(value.channelId),
        {
          title: "Counterparty Channel ID",
          value: value.counterpartyChannelId,
        },
        {
          title: "Counterparty Version",
          value: value.counterpartyVersion,
        },
        {
          title: "Proof Try",
          value: value.proofTry,
        },
        proofHeightReceipt(value.proofHeight),
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.signer,
            linkType: getAddressType(value.signer),
          }),
        },
      ];
    case "cosmos-sdk/MsgChannelOpenConfirm":
      return [
        {
          title: "Port ID",
          value: value.portId,
        },
        channelIdReceipt(value.channelId),
        {
          title: "Proof Ack",
          value: value.proofAck,
        },
        proofHeightReceipt(value.proofHeight),
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.signer,
            linkType: getAddressType(value.signer),
          }),
        },
      ];
    case "cosmos-sdk/MsgChannelCloseInit":
      return [
        {
          title: "Port ID",
          value: value.portId,
        },
        channelIdReceipt(value.channelId),
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.signer,
            linkType: getAddressType(value.signer),
          }),
        },
      ];
    case "cosmos-sdk/MsgChannelCloseConfirm":
      return [
        {
          title: "Port ID",
          value: value.portId,
        },
        channelIdReceipt(value.channelId),
        proofInitReceipt(value.proofInit),
        proofHeightReceipt(value.proofHeight),
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.signer,
            linkType: getAddressType(value.signer),
          }),
        },
      ];
    case "cosmos-sdk/MsgRecvPacket":
      return [
        {
          title: "Packet",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.packet,
          }),
        },
        {
          title: "Proof Commitment",
          value: value.proofCommitment,
        },
        proofHeightReceipt(value.proofHeight),
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.signer,
            linkType: getAddressType(value.signer),
          }),
        },
      ];
    case "cosmos-sdk/MsgTimeout":
      return [
        {
          title: "Packet",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.packet,
          }),
        },
        {
          title: "Proof Unreceived",
          value: value.proofUnreceived,
        },
        proofHeightReceipt(value.proofHeight),
        {
          title: "Next Sequence Recv",
          value: value.nextSequenceRecv,
        },
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.signer,
            linkType: getAddressType(value.signer),
          }),
        },
      ];
    case "cosmos-sdk/MsgTimeoutOnClose":
      return [
        {
          title: "Packet",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.packet,
          }),
        },
        {
          title: "Proof Unreceived",
          value: value.proofUnreceived,
        },
        {
          title: "Proof Close",
          value: value.proofClose,
        },
        proofHeightReceipt(value.proofHeight),
        {
          title: "Next Sequence Recv",
          value: value.nextSequenceRecv,
        },
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.signer,
            linkType: getAddressType(value.signer),
          }),
        },
      ];
    case "cosmos-sdk/MsgAcknowledgement":
      return [
        {
          title: "Packet",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.packet,
          }),
        },
        {
          title: "Acknowledgement",
          value: value.acknowledgement,
        },
        {
          title: "Proof Acked",
          value: value.proofAcked,
        },
        proofHeightReceipt(value.proofHeight),
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.signer,
            linkType: getAddressType(value.signer),
          }),
        },
      ];
    // osmosis/gamm
    case "osmosis/gamm/create-balancer-pool":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.sender,
            linkType: getAddressType(value.sender),
          }),
        },
        {
          title: "Pool Params",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.poolParams,
          }),
        },
        {
          title: "Pool assets",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.poolAssets,
          }),
        },
        {
          title: "Future Pool Governor",
          value: value.futurePoolGovernor,
        },
      ];
    case "osmosis/gamm/create-stableswap-pool":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.sender,
            linkType: getAddressType(value.sender),
          }),
        },
        {
          title: "Pool Params",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.poolParams,
          }),
        },
        {
          title: "Initial Pool Liquidity",
          html: getCoinComponent(value.initialPoolLiquidity, assetInfos),
        },
        {
          title: "Scaling Factors",
          value: JSON.stringify(value.scalingFactors),
        },
        {
          title: "Future Pool Governor",
          value: value.futurePoolGovernor,
        },
        value.scalingFactorController && {
          title: "Scaling Factor Controller",
          value: value.scalingFactorController,
        },
      ];
    case "osmosis/gamm/stableswap-adjust-scaling-factors":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.sender,
            linkType: getAddressType(value.sender),
          }),
        },
        {
          title: "Pool ID",
          value: value.poolId,
        },
        {
          title: "Scaling Factors",
          value: JSON.stringify(value.scalingFactors),
        },
      ];
    case "osmosis/gamm/join-pool":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.sender,
            linkType: getAddressType(value.sender),
          }),
        },
        {
          title: "Pool ID",
          value: value.poolId,
        },
        {
          title: "Share Out Amount",
          value: value.shareOutAmount,
        },
        {
          title: "Token In Maxs",
          html: getCoinComponent(value.tokenInMaxs, assetInfos),
        },
      ];
    case "osmosis/gamm/exit-pool":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.sender,
            linkType: getAddressType(value.sender),
          }),
        },
        {
          title: "Pool ID",
          value: value.poolId,
        },
        {
          title: "Share In Amount",
          value: value.shareInAmount,
        },
        {
          title: "Token Out Mins",
          html: getCoinComponent(value.tokenOutMins, assetInfos),
        },
      ];
    case "osmosis/gamm/swap-exact-amount-in":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.sender,
            linkType: getAddressType(value.sender),
          }),
        },
        {
          title: "Routes",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.routes,
          }),
        },
        {
          title: "Token In",
          html: getCoinComponent(value.tokenIn, assetInfos),
        },
        {
          title: "Token Out Min Amount",
          value: value.tokenOutMinAmount,
        },
      ];
    case "osmosis/gamm/swap-exact-amount-out":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.sender,
            linkType: getAddressType(value.sender),
          }),
        },
        {
          title: "Routes",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.routes,
          }),
        },
        {
          title: "Token In Max Amount",
          value: value.tokenInMaxAmount,
        },
        {
          title: "Token Out",
          html: getCoinComponent(value.tokenOut, assetInfos),
        },
      ];
    case "osmosis/gamm/join-swap-extern-amount-in":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.sender,
            linkType: getAddressType(value.sender),
          }),
        },
        {
          title: "Pool ID",
          value: value.poolId,
        },
        {
          title: "Token In",
          html: getCoinComponent(value.tokenIn, assetInfos),
        },
        {
          title: "Share Out Min Amount",
          value: value.shareOutMinAmount,
        },
      ];
    case "osmosis/gamm/join-swap-share-amount-out":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.sender,
            linkType: getAddressType(value.sender),
          }),
        },
        {
          title: "Pool ID",
          value: value.poolId,
        },
        {
          title: "Token In Denom",
          value: value.tokenInDenom,
        },
        {
          title: "Share Out Amount",
          value: value.shareOutAmount,
        },
        {
          title: "Token In Max Amount",
          value: value.tokenInMaxAmount,
        },
      ];
    case "osmosis/gamm/exit-swap-share-amount-in":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.sender,
            linkType: getAddressType(value.sender),
          }),
        },
        {
          title: "Pool ID",
          value: value.poolId,
        },
        {
          title: "Token Out Denom",
          value: value.tokenOutDenom,
        },
        {
          title: "Share In Amount",
          value: value.shareInAmount,
        },
        {
          title: "Token Out Min Amount",
          value: value.tokenOutMinAmount,
        },
      ];
    case "osmosis/gamm/exit-swap-extern-amount-out":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.sender,
            linkType: getAddressType(value.sender),
          }),
        },
        {
          title: "Pool ID",
          value: value.poolId,
        },
        {
          title: "Token Out",
          html: getCoinComponent(value.poolId, assetInfos),
        },
        {
          title: "Share In Max Amount",
          value: value.shareInMaxAmount,
        },
      ];
    // osmosis/incentives
    case "osmosis/incentives/create-gauge":
      return [
        {
          title: "Is Perpetual",
          value: value.isPerpetual,
        },
        {
          title: "Owner",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.owner,
            linkType: getAddressType(value.owner),
          }),
        },
        {
          title: "Distribute To",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.distributeTo,
          }),
        },
        {
          title: "Coins",
          html: getCoinComponent(value.coins, assetInfos),
        },
        {
          title: "Start Time",
          value: formatUTC(parseDate(value.startTime)),
        },
        {
          title: "Num Epochs Paid Over",
          value: value.numEpochsPaidOver,
        },
      ];
    case "osmosis/incentives/add-to-gauge":
      return [
        {
          title: "Owner",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.owner,
            linkType: getAddressType(value.owner),
          }),
        },
        {
          title: "Gauge ID",
          value: value.gaugeId,
        },
        {
          title: "Rewards",
          html: getCoinComponent(value.rewards, assetInfos),
        },
      ];
    // osmosis/lockup
    case "osmosis/lockup/lock-tokens":
      return [
        {
          title: "Owner",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.owner,
            linkType: getAddressType(value.owner),
          }),
        },
        {
          title: "Duration",
          value: formatUTC(parseDate(value.duration)),
        },
        {
          title: "Coins",
          html: getCoinComponent(value.coins, assetInfos),
        },
      ];
    case "osmosis/lockup/begin-unlock-tokens":
      return [
        {
          title: "Owner",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.owner,
            linkType: getAddressType(value.owner),
          }),
        },
      ];
    case "osmosis/lockup/begin-unlock-period-lock":
    case "osmosis/lockup/force-unlock":
      // **Example hash doesnt work for force-unlock
      return [
        {
          title: "Owner",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.owner,
            linkType: getAddressType(value.owner),
          }),
        },
        {
          title: "ID",
          value: value.ID,
        },
        {
          title: "Coins",
          html: getCoinComponent(value.coins, assetInfos),
        },
      ];
    // ** No example
    case "osmosis/lockup/extend-lockup":
      return [
        {
          title: "Owner",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.owner,
            linkType: getAddressType(value.owner),
          }),
        },
        {
          title: "ID",
          value: value.ID,
        },
        {
          title: "Duration",
          value: formatUTC(parseDate(value.duration)),
        },
      ];
    // osmosis/superfluid
    case "osmosis/superfluid-delegate":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.sender,
            linkType: getAddressType(value.sender),
          }),
        },
        {
          title: "Lock ID",
          value: value.lockId,
        },
        validatorAddrReceipt(value.valAddr),
      ];
    case "osmosis/superfluid-undelegate":
    case "osmosis/superfluid-unbond-lock":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.sender,
            linkType: getAddressType(value.sender),
          }),
        },
        {
          title: "Lock ID",
          value: value.lockId,
        },
      ];
    // **Hash doesnt work
    case "osmosis/lock-and-superfluid-delegate":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.sender,
            linkType: getAddressType(value.sender),
          }),
        },
        {
          title: "Coins",
          html: getCoinComponent(value.coins, assetInfos),
        },
        validatorAddrReceipt(value.valAddr),
      ];
    case "osmosis/unpool-whitelisted-pool":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.sender,
            linkType: getAddressType(value.sender),
          }),
        },
        {
          title: "Pool ID",
          value: value.poolId,
        },
      ];
    // osmosis/tokenfactory
    case "osmosis/tokenfactory/create-denom":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.sender,
            linkType: getAddressType(value.sender),
          }),
        },
        {
          title: "Subdenom",
          value: value.subdenom,
        },
      ];
    case "osmosis/tokenfactory/mint":
    case "osmosis/tokenfactory/burn":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.sender,
            linkType: getAddressType(value.sender),
          }),
        },
        {
          title: "Amount",
          html: getCoinComponent(value.amount, assetInfos),
        },
      ];
    case "osmosis/tokenfactory/change-admin":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.sender,
            linkType: getAddressType(value.sender),
          }),
        },
        {
          title: "Denom",
          value: value.denom,
        },
        {
          title: "New Admin",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.newAdmin,
            linkType: getAddressType(value.newAdmin),
          }),
        },
      ];
    // **No example
    case "osmosis/tokenfactory/set-denom-metadata":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: value.sender,
            linkType: getAddressType(value.sender),
          }),
        },
        {
          title: "Metadata",
          html: getCommonReceiptHtml({
            type: "json",
            value: value.metadata,
          }),
        },
      ];
    default:
      return Object.entries<string | object>(value).map((entry) =>
        getGenericValueEntry(entry, getAddressType)
      );
  }
};
