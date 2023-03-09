/* eslint-disable sonarjs/max-switch-cases */
/* eslint-disable complexity */
import { Flex } from "@chakra-ui/react";
import { findAttribute } from "@cosmjs/stargate/build/logs";
import big from "big.js";

import type { TxMsgData } from "..";
import type { AddressReturnType } from "lib/app-provider";
import { CopyButton } from "lib/components/copy";
import { PermissionChip } from "lib/components/PermissionChip";
import { ViewPermissionAddresses } from "lib/components/ViewPermissionAddresses";
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
  { msgBody, log }: TxMsgData,
  getAddressType: (address: string) => AddressReturnType,
  assetInfos: Option<{ [key: string]: AssetInfo }>
): Option<TxReceipt>[] => {
  const { "@type": type, ...body } = msgBody;
  switch (type) {
    // cosmwasm/wasm
    case "/cosmwasm.wasm.v1.MsgStoreCode":
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
            value: body.sender,
            linkType: getAddressType(body.sender),
          }),
        },
        body.instantiate_permission && {
          title: "Instantiate Permission",
          html: (
            <Flex direction="column" gap={1}>
              <PermissionChip
                instantiatePermission={body.instantiate_permission.permission}
                permissionAddresses={
                  body.instantiate_permission.address ||
                  body.instantiate_permission.addresses
                }
              />
              <ViewPermissionAddresses
                permissionAddresses={
                  body.instantiate_permission.address ||
                  body.instantiate_permission.addresses
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
              {big(Buffer.from(body.wasm_byte_code).byteLength)
                .div(1024)
                .toFixed(1)}{" "}
              KB
              <CopyButton
                value={body.wasm_byte_code}
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
    case "/cosmwasm.wasm.v1.MsgInstantiateContract":
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
            value: body.code_id,
            linkType: "code_id",
          }),
        },
        {
          title: "Instantiated by",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.sender,
            linkType: getAddressType(body.sender),
          }),
        },
        {
          title: "Contract Admin",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.admin,
            linkType: getAddressType(body.admin),
            fallback: "No Admin",
          }),
        },
        {
          title: "Label",
          value: body.label,
        },
        attachFundsReceipt(body.funds, assetInfos),
        {
          title: "Instantiate Message",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.msg,
          }),
        },
      ];
    case "/cosmwasm.wasm.v1.MsgInstantiateContract2":
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
            value: body.code_id,
            linkType: "code_id",
          }),
        },
        {
          title: "Instantiated by",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.sender,
            linkType: getAddressType(body.sender),
          }),
        },
        {
          title: "Contract Admin",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.admin,
            linkType: getAddressType(body.admin),
            fallback: "No Admin",
          }),
        },
        {
          title: "Label",
          value: body.label,
        },
        attachFundsReceipt(body.funds, assetInfos),
        {
          title: "Instantiate Message",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.msg,
          }),
        },
        {
          title: "Salt",
          html: body.salt,
        },
        body.fix_msg && {
          title: "Fix Msg",
          value: body.fix_msg,
        },
      ];
    case "/cosmwasm.wasm.v1.MsgExecuteContract":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.sender,
            linkType: getAddressType(body.sender),
          }),
        },
        {
          title: "Contract",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.contract,
            linkType: "contract_address",
          }),
        },
        attachFundsReceipt(body.funds, assetInfos),
        {
          title: "Execute Message",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.msg,
          }),
        },
      ];
    case "/cosmwasm.wasm.v1.MsgMigrateContract":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.sender,
            linkType: getAddressType(body.sender),
          }),
        },
        {
          title: "Contract",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.contract,
            linkType: "contract_address",
          }),
        },
        {
          title: "Code ID",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.code_id,
            linkType: "code_id",
          }),
        },
        {
          title: "Msg",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.msg,
          }),
        },
      ];
    case "/cosmwasm.wasm.v1.MsgUpdateAdmin":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.sender,
            linkType: getAddressType(body.sender),
          }),
        },
        {
          title: "New Admin",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.new_admin,
            linkType: getAddressType(body.new_admin),
          }),
        },
        {
          title: "Contract",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.contract,
            linkType: "contract_address",
          }),
        },
      ];
    case "/cosmwasm.wasm.v1.MsgClearAdmin":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.sender,
            linkType: getAddressType(body.sender),
          }),
        },
        {
          title: "Contract",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.contract,
            linkType: "contract_address",
          }),
        },
      ];
    // x/bank
    case "/cosmos.bank.v1beta1.MsgSend":
      return [
        {
          title: "From Address",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.from_address,
            linkType: getAddressType(body.from_address),
          }),
        },
        {
          title: "To Address",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.to_address,
            linkType: getAddressType(body.to_address),
          }),
        },
        {
          title: "Amount",
          html: getCoinComponent(body.amount, assetInfos),
        },
      ];
    case "/cosmos.bank.v1beta1.MsgMultiSend":
      return [
        {
          title: "Inputs",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.inputs,
          }),
        },
        {
          title: "Outputs",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.outputs,
          }),
        },
      ];
    // x/authz
    case "/cosmos.authz.v1beta1.MsgGrant":
      return [
        {
          title: "Granter",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.granter,
            linkType: getAddressType(body.granter),
          }),
        },
        {
          title: "Grantee",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.grantee,
            linkType: getAddressType(body.grantee),
          }),
        },
        {
          title: "Grant",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.grant,
          }),
        },
      ];
    case "/cosmos.authz.v1beta1.MsgRevoke":
      return [
        {
          title: "Granter",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.granter,
            linkType: getAddressType(body.granter),
          }),
        },
        {
          title: "Grantee",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.grantee,
            linkType: getAddressType(body.grantee),
          }),
        },
        {
          title: "MsgTypeUrl",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.msg_type_url,
          }),
        },
      ];
    case "/cosmos.authz.v1beta1.MsgExec":
      return [
        {
          title: "Grantee",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.grantee,
            linkType: getAddressType(body.grantee),
          }),
        },
        {
          title: "Msgs",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.msgs,
          }),
        },
      ];
    // x/crisis
    case "/cosmos.crisis.v1beta1.MsgVerifyInvariant":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.sender,
            linkType: getAddressType(body.sender),
          }),
        },
        { title: "Invariant Module Name", value: body.invariant_module_name },
        { title: "Invariant Route", value: body.invariant_route },
      ];
    // x/distribution
    case "/cosmos.distribution.v1beta1.MsgSetWithdrawAddress":
      return [
        delegatorAddrReceipt(
          body.delegator_address,
          getAddressType(body.delegator_address)
        ),
        {
          title: "Withdraw Address",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.withdraw_address,
            linkType: getAddressType(body.withdraw_address),
          }),
        },
      ];
    case "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward":
      return [
        delegatorAddrReceipt(
          body.delegator_address,
          getAddressType(body.delegator_address)
        ),
        validatorAddrReceipt(body.validator_address),
      ];
    case "/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission":
      return [validatorAddrReceipt(body.validator_address)];
    case "/cosmos.distribution.v1beta1.MsgFundCommunityPool":
      return [
        {
          title: "Amount",
          html: getCoinComponent(body.amount, assetInfos),
        },
        {
          title: "Depositor",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.depositor,
            linkType: getAddressType(body.depositor),
          }),
        },
      ];
    // x/evidence
    case "/cosmos.evidence.v1beta1.MsgSubmitEvidence":
      return [
        {
          title: "Submitter",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.submitter,
            linkType: getAddressType(body.submitter),
          }),
        },
        {
          title: "Evidence",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.evidence,
          }),
        },
      ];
    //  x/feegrant
    case "/cosmos.feegrant.v1beta1.MsgGrantAllowance":
      return [
        {
          title: "Granter",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.granter,
            linkType: getAddressType(body.granter),
          }),
        },
        {
          title: "Grantee",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.grantee,
            linkType: getAddressType(body.grantee),
          }),
        },
        {
          title: "Allowance",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.allowance,
          }),
        },
      ];
    case "/cosmos.feegrant.v1beta1.MsgRevokeAllowance":
      return [
        {
          title: "Granter",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.granter,
            linkType: getAddressType(body.granter),
          }),
        },
        {
          title: "Grantee",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.grantee,
            linkType: getAddressType(body.grantee),
          }),
        },
      ];
    // x/gov
    case "/cosmos.gov.v1beta1.MsgSubmitProposal":
      return [
        {
          title: "Initial Deposit",
          html: getCoinComponent(body.initial_deposit, assetInfos),
        },
        {
          title: "Proposer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.proposer,
            linkType: getAddressType(body.proposer),
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
        { title: "Title", value: body.content.title },
      ];
    case "/cosmos.gov.v1beta1.MsgVote":
      return [
        proposalIdReceipt(body.proposal_id),
        {
          title: "Voter",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.voter,
            linkType: getAddressType(body.voter),
          }),
        },
        {
          title: "Option",
          value: voteOption[body.option as keyof typeof voteOption],
        },
      ];
    case "/cosmos.gov.v1beta1.MsgVoteWeighted":
      return [
        proposalIdReceipt(body.proposal_id),
        {
          title: "Voter",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.voter,
            linkType: getAddressType(body.voter),
          }),
        },
        {
          title: "Options",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.options,
          }),
        },
      ];
    case "/cosmos.gov.v1beta1.MsgDeposit":
      return [
        proposalIdReceipt(body.proposal_id),
        {
          title: "Depositor",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.depositor,
            linkType: getAddressType(body.depositor),
          }),
        },
        {
          title: "Amount",
          html: getCoinComponent(body.amount, assetInfos),
        },
      ];
    // x/slashing
    case "/cosmos.slashing.v1beta1.MsgUnjail":
      return [validatorAddrReceipt(body.validator_addr)];
    // x/staking
    case "/cosmos.staking.v1beta1.MsgCreateValidator":
      return [
        {
          title: "Description",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.description,
          }),
        },
        {
          title: "Commission",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.commission,
          }),
        },
        {
          title: "Min Self Delegation",
          value: body.min_self_delegation,
        },
        delegatorAddrReceipt(
          body.delegator_address,
          getAddressType(body.delegator_address)
        ),
        validatorAddrReceipt(body.validator_address),
        {
          title: "Public Key",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.pubkey,
          }),
        },
        {
          title: "Value",
          html: getCoinComponent(body.value, assetInfos),
        },
      ];
    case "/cosmos.staking.v1beta1.MsgEditValidator":
      return [
        {
          title: "Description",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.description,
          }),
        },
        validatorAddrReceipt(body.validator_address),
        {
          title: "Commission Rate",
          value: body.commission_rate,
        },
        {
          title: "Min Self Delegation",
          value: body.min_self_delegation,
        },
      ];
    case "/cosmos.staking.v1beta1.MsgDelegate":
    case "/cosmos.staking.v1beta1.MsgUndelegate":
      return [
        delegatorAddrReceipt(
          body.delegator_address,
          getAddressType(body.delegator_address)
        ),
        validatorAddrReceipt(body.validator_address),
        {
          title: "Amount",
          html: getCoinComponent(body.amount, assetInfos),
        },
      ];
    case "/cosmos.staking.v1beta1.MsgBeginRedelegate":
      return [
        delegatorAddrReceipt(
          body.delegator_address,
          getAddressType(body.delegator_address)
        ),
        {
          title: "Source Validator Address",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.validator_src_address,
            linkType: "validator_address",
          }),
        },
        {
          title: "Destination Validator Address",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.validator_dst_address,
            linkType: "validator_address",
          }),
        },
        {
          title: "Amount",
          html: getCoinComponent(body.amount, assetInfos),
        },
      ];
    // ibc/applications
    case "/ibc.applications.transfer.v1.MsgTransfer":
      return [
        {
          title: "Source Port",
          value: body.source_port,
        },
        {
          title: "Source Channel",
          value: body.source_channel,
        },
        {
          title: "Token",
          html: getCoinComponent(body.token, assetInfos),
        },
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.sender,
            linkType: getAddressType(body.sender),
          }),
        },
        {
          title: "Receiver",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.receiver,
            linkType: getAddressType(body.receiver),
          }),
        },
        body.timeout_height && {
          title: "Timeout Height",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.timeout_height,
          }),
        },
        body.timeout_timestamp && {
          title: "Timeout Timestamp",
          value: formatUTC(parseDate(body.timeout_timestamp)),
        },
        {
          title: "Memo",
          value: body.memo,
        },
      ];
    // ibc/core
    case "/ibc.core.client.v1.MsgCreateClient":
      return [
        clientStateReceipt(body.client_state),
        {
          title: "Consensus State",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.consensus_state,
          }),
        },
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.signer,
            linkType: getAddressType(body.signer),
          }),
        },
      ];
    case "/ibc.core.client.v1.MsgUpdateClient":
      return [
        {
          title: "Client ID",
          value: body.client_id,
        },
        {
          title: "Header",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.header,
          }),
        },
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.signer,
            linkType: getAddressType(body.signer),
          }),
        },
      ];
    case "/ibc.core.client.v1.MsgUpgradeClient":
      return [
        {
          title: "Client ID",
          value: body.client_id,
        },
        clientStateReceipt(body.client_state),
        {
          title: "Consensus State",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.consensus_state,
          }),
        },
        {
          title: "Proof Upgrade Client",
          value: body.proof_upgrade_client,
        },
        {
          title: "Proof Upgrade Consensus State",
          value: body.proof_upgrade_consensus_state,
        },
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.signer,
            linkType: getAddressType(body.signer),
          }),
        },
      ];
    case "/ibc.core.client.v1.MsgSubmitMisbehaviour":
      return [
        {
          title: "Client ID",
          value: body.client_id,
        },
        {
          title: "Misbehaviour",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.misbehaviour,
          }),
        },
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.signer,
            linkType: getAddressType(body.signer),
          }),
        },
      ];
    case "/ibc.core.connection.v1.MsgConnectionOpenInit":
      return [
        {
          title: "Client ID",
          value: body.client_id,
        },
        {
          title: "Counterparty",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.counterparty,
          }),
        },
        {
          title: "Version",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.version,
          }),
        },
        {
          title: "Delay Period",
          value: body.delay_period,
        },
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.signer,
            linkType: getAddressType(body.signer),
          }),
        },
      ];
    case "/ibc.core.connection.v1.MsgConnectionOpenTry":
      return [
        {
          title: "Client ID",
          value: body.client_id,
        },
        {
          title: "Previous Connection ID",
          value: body.previous_connection_id,
        },
        clientStateReceipt(body.client_state),
        {
          title: "Counterparty",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.counterparty,
          }),
        },
        {
          title: "Delay Period",
          value: body.delay_period,
        },
        {
          title: "Counterparty Versions",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.counterparty_versions,
          }),
        },
        proofHeightReceipt(body.proof_height),
        proofInitReceipt(body.proof_init),
        {
          title: "Proof Client",
          value: body.proof_client,
        },
        {
          title: "Proof Consensus",
          value: body.proof_consensus,
        },
        {
          title: "Consensus Height",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.consensus_height,
          }),
        },
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.signer,
            linkType: getAddressType(body.signer),
          }),
        },
      ];
    case "/ibc.core.connection.v1.MsgConnectionOpenAck":
      return [
        {
          title: "Connection ID",
          value: body.connection_id,
        },
        {
          title: "Counterparty Connection ID",
          value: body.counterparty_connection_id,
        },
        {
          title: "Version",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.version,
          }),
        },
        clientStateReceipt(body.client_state),
        proofHeightReceipt(body.proof_height),
        {
          title: "Proof Try",
          value: body.proof_try,
        },
        {
          title: "Proof Client",
          value: body.proof_client,
        },
        {
          title: "Proof Consensus",
          value: body.proof_consensus,
        },
        {
          title: "Consensus Height",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.consensus_height,
          }),
        },
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.signer,
            linkType: getAddressType(body.signer),
          }),
        },
      ];
    case "/ibc.core.connection.v1.MsgConnectionOpenConfirm":
      return [
        {
          title: "Connection ID",
          value: body.connection_id,
        },
        {
          title: "Proof Ack",
          value: body.proof_ack,
        },
        proofHeightReceipt(body.proof_height),
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.signer,
            linkType: getAddressType(body.signer),
          }),
        },
      ];
    case "/ibc.core.channel.v1.MsgChannelOpenInit":
      return [
        {
          title: "Port ID",
          value: body.port_id,
        },
        {
          title: "Channel",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.channel,
          }),
        },
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.signer,
            linkType: getAddressType(body.signer),
          }),
        },
      ];
    case "/ibc.core.channel.v1.MsgChannelOpenTry":
      return [
        {
          title: "Port ID",
          value: body.port_id,
        },
        {
          title: "Previous Channel ID",
          value: body.previous_channel_id,
        },
        {
          title: "Channel",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.channel,
          }),
        },
        {
          title: "Counterparty Version",
          value: body.counterparty_version,
        },
        proofInitReceipt(body.proof_init),
        proofHeightReceipt(body.proof_height),
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.signer,
            linkType: getAddressType(body.signer),
          }),
        },
      ];
    case "/ibc.core.channel.v1.MsgChannelOpenAck":
      return [
        {
          title: "Port ID",
          value: body.port_id,
        },
        channelIdReceipt(body.channel_id),
        {
          title: "Counterparty Channel ID",
          value: body.counterparty_channel_id,
        },
        {
          title: "Counterparty Version",
          value: body.counterparty_version,
        },
        {
          title: "Proof Try",
          value: body.proof_try,
        },
        proofHeightReceipt(body.proof_height),
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.signer,
            linkType: getAddressType(body.signer),
          }),
        },
      ];
    case "/ibc.core.channel.v1.MsgChannelOpenConfirm":
      return [
        {
          title: "Port ID",
          value: body.port_id,
        },
        channelIdReceipt(body.channel_id),
        {
          title: "Proof Ack",
          value: body.proofAck,
        },
        proofHeightReceipt(body.proof_height),
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.signer,
            linkType: getAddressType(body.signer),
          }),
        },
      ];
    case "/ibc.core.channel.v1.MsgChannelCloseInit":
      return [
        {
          title: "Port ID",
          value: body.port_id,
        },
        channelIdReceipt(body.channel_id),
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.signer,
            linkType: getAddressType(body.signer),
          }),
        },
      ];
    case "/ibc.core.channel.v1.MsgChannelCloseConfirm":
      return [
        {
          title: "Port ID",
          value: body.port_id,
        },
        channelIdReceipt(body.channel_id),
        proofInitReceipt(body.proof_init),
        proofHeightReceipt(body.proof_height),
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.signer,
            linkType: getAddressType(body.signer),
          }),
        },
      ];
    case "/ibc.core.channel.v1.MsgRecvPacket":
      return [
        {
          title: "Packet",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.packet,
          }),
        },
        {
          title: "Proof Commitment",
          value: body.proof_commitment,
        },
        proofHeightReceipt(body.proof_height),
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.signer,
            linkType: getAddressType(body.signer),
          }),
        },
      ];
    case "/ibc.core.channel.v1.MsgTimeout":
      return [
        {
          title: "Packet",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.packet,
          }),
        },
        {
          title: "Proof Unreceived",
          value: body.proof_unreceived,
        },
        proofHeightReceipt(body.proof_height),
        {
          title: "Next Sequence Recv",
          value: body.next_sequence_recv,
        },
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.signer,
            linkType: getAddressType(body.signer),
          }),
        },
      ];
    case "/ibc.core.channel.v1.MsgTimeoutOnClose":
      return [
        {
          title: "Packet",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.packet,
          }),
        },
        {
          title: "Proof Unreceived",
          value: body.proof_unreceived,
        },
        {
          title: "Proof Close",
          value: body.proof_close,
        },
        proofHeightReceipt(body.proof_height),
        {
          title: "Next Sequence Recv",
          value: body.next_sequence_recv,
        },
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.signer,
            linkType: getAddressType(body.signer),
          }),
        },
      ];
    case "/ibc.core.channel.v1.MsgAcknowledgement":
      return [
        {
          title: "Packet",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.packet,
          }),
        },
        {
          title: "Acknowledgement",
          value: body.acknowledgement,
        },
        {
          title: "Proof Acked",
          value: body.proof_acked,
        },
        proofHeightReceipt(body.proof_height),
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.signer,
            linkType: getAddressType(body.signer),
          }),
        },
      ];
    // osmosis/gamm
    case "/osmosis.gamm.poolmodels.balancer.v1beta1.MsgCreateBalancerPool":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.sender,
            linkType: getAddressType(body.sender),
          }),
        },
        {
          title: "Pool Params",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.pool_params,
          }),
        },
        {
          title: "Pool Assets",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.pool_assets,
          }),
        },
        {
          title: "Future Pool Governor",
          value: body.future_pool_governor,
        },
      ];
    case "/osmosis.gamm.poolmodels.stableswap.v1beta1.MsgCreateStableswapPool":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.sender,
            linkType: getAddressType(body.sender),
          }),
        },
        {
          title: "Pool Params",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.pool_params,
          }),
        },
        {
          title: "Initial Pool Liquidity",
          html: getCoinComponent(body.initial_pool_liquidity, assetInfos),
        },
        {
          title: "Scaling Factors",
          value: JSON.stringify(body.scaling_factors),
        },
        {
          title: "Future Pool Governor",
          value: body.future_pool_governor,
        },
        body.scaling_factor_controller && {
          title: "Scaling Factor Controller",
          value: body.scaling_factor_controller,
        },
      ];
    case "/osmosis.gamm.poolmodels.stableswap.v1beta1.MsgStableSwapAdjustScalingFactors":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.sender,
            linkType: getAddressType(body.sender),
          }),
        },
        {
          title: "Pool ID",
          value: body.pool_id,
        },
        {
          title: "Scaling Factors",
          value: JSON.stringify(body.scaling_factors),
        },
      ];
    case "/osmosis.gamm.v1beta1.MsgJoinPool":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.sender,
            linkType: getAddressType(body.sender),
          }),
        },
        {
          title: "Pool ID",
          value: body.pool_id,
        },
        {
          title: "Share Out Amount",
          value: body.share_out_amount,
        },
        {
          title: "Token In Maxs",
          html: getCoinComponent(body.token_in_maxs, assetInfos),
        },
      ];
    case "/osmosis.gamm.v1beta1.MsgExitPool":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.sender,
            linkType: getAddressType(body.sender),
          }),
        },
        {
          title: "Pool ID",
          value: body.pool_id,
        },
        {
          title: "Share In Amount",
          value: body.share_in_amount,
        },
        {
          title: "Token Out Mins",
          html: getCoinComponent(body.token_out_mins, assetInfos),
        },
      ];
    case "/osmosis.gamm.v1beta1.MsgSwapExactAmountIn":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.sender,
            linkType: getAddressType(body.sender),
          }),
        },
        {
          title: "Routes",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.routes,
          }),
        },
        {
          title: "Token In",
          html: getCoinComponent(body.token_in, assetInfos),
        },
        {
          title: "Token Out Min Amount",
          value: body.token_out_min_amount,
        },
      ];
    case "/osmosis.gamm.v1beta1.MsgSwapExactAmountOut":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.sender,
            linkType: getAddressType(body.sender),
          }),
        },
        {
          title: "Routes",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.routes,
          }),
        },
        {
          title: "Token In Max Amount",
          value: body.token_in_max_amount,
        },
        {
          title: "Token Out",
          html: getCoinComponent(body.token_out, assetInfos),
        },
      ];
    case "/osmosis.gamm.v1beta1.MsgJoinSwapExternAmountIn":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.sender,
            linkType: getAddressType(body.sender),
          }),
        },
        {
          title: "Pool ID",
          value: body.pool_id,
        },
        {
          title: "Token In",
          html: getCoinComponent(body.token_in, assetInfos),
        },
        {
          title: "Share Out Min Amount",
          value: body.share_out_min_amount,
        },
      ];
    case "/osmosis.gamm.v1beta1.MsgJoinSwapShareAmountOut":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.sender,
            linkType: getAddressType(body.sender),
          }),
        },
        {
          title: "Pool ID",
          value: body.pool_id,
        },
        {
          title: "Token In Denom",
          value: body.token_in_denom,
        },
        {
          title: "Share Out Amount",
          value: body.share_out_amount,
        },
        {
          title: "Token In Max Amount",
          value: body.token_in_max_amount,
        },
      ];
    case "/osmosis.gamm.v1beta1.MsgExitSwapShareAmountIn":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.sender,
            linkType: getAddressType(body.sender),
          }),
        },
        {
          title: "Pool ID",
          value: body.pool_id,
        },
        {
          title: "Token Out Denom",
          value: body.token_out_denom,
        },
        {
          title: "Share In Amount",
          value: body.share_in_amount,
        },
        {
          title: "Token Out Min Amount",
          value: body.token_out_min_amount,
        },
      ];
    case "/osmosis.gamm.v1beta1.MsgExitSwapExternAmountOut":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.sender,
            linkType: getAddressType(body.sender),
          }),
        },
        {
          title: "Pool ID",
          value: body.pool_id,
        },
        {
          title: "Token Out",
          html: getCoinComponent(body.token_out, assetInfos),
        },
        {
          title: "Share In Max Amount",
          value: body.share_in_max_amount,
        },
      ];
    // osmosis/incentives
    case "/osmosis.incentives.MsgCreateGauge":
      return [
        {
          title: "Is Perpetual",
          value: String(body.is_perpetual),
        },
        {
          title: "Owner",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.owner,
            linkType: getAddressType(body.owner),
          }),
        },
        {
          title: "Distribute To",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.distribute_to,
          }),
        },
        {
          title: "Coins",
          html: getCoinComponent(body.coins, assetInfos),
        },
        {
          title: "Start Time",
          value: formatUTC(parseDate(body.start_time)),
        },
        {
          title: "Num Epochs Paid Over",
          value: body.num_epochs_paid_over,
        },
      ];
    case "/osmosis.incentives.MsgAddToGauge":
      return [
        {
          title: "Owner",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.owner,
            linkType: getAddressType(body.owner),
          }),
        },
        {
          title: "Gauge ID",
          value: body.gauge_id,
        },
        {
          title: "Rewards",
          html: getCoinComponent(body.rewards, assetInfos),
        },
      ];
    // osmosis/lockup
    case "/osmosis.lockup.MsgLockTokens":
      return [
        {
          title: "Owner",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.owner,
            linkType: getAddressType(body.owner),
          }),
        },
        {
          title: "Duration",
          value: body.duration,
        },
        {
          title: "Coins",
          html: getCoinComponent(body.coins, assetInfos),
        },
      ];
    case "/osmosis.lockup.MsgBeginUnlockingAll":
      return [
        {
          title: "Owner",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.owner,
            linkType: getAddressType(body.owner),
          }),
        },
      ];
    case "/osmosis.lockup.MsgBeginUnlocking":
    case "/osmosis.lockup.MsgForceUnlock":
      return [
        {
          title: "Owner",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.owner,
            linkType: getAddressType(body.owner),
          }),
        },
        {
          title: "ID",
          value: body.ID,
        },
        {
          title: "Coins",
          html: getCoinComponent(body.coins, assetInfos),
        },
      ];
    // ** No example
    case "/osmosis.lockup.MsgExtendLockup":
      return [
        {
          title: "Owner",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.owner,
            linkType: getAddressType(body.owner),
          }),
        },
        {
          title: "ID",
          value: body.ID,
        },
        {
          title: "Duration",
          value: formatUTC(parseDate(body.duration)),
        },
      ];
    // osmosis/superfluid
    case "/osmosis.superfluid.MsgSuperfluidDelegate":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.sender,
            linkType: getAddressType(body.sender),
          }),
        },
        {
          title: "Lock ID",
          value: body.lock_id,
        },
        validatorAddrReceipt(body.val_addr),
      ];
    case "/osmosis.superfluid.MsgSuperfluidUndelegate":
    case "/osmosis.superfluid.MsgSuperfluidUnbondLock":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.sender,
            linkType: getAddressType(body.sender),
          }),
        },
        {
          title: "Lock ID",
          value: body.lock_id,
        },
      ];
    case "/osmosis.superfluid.MsgLockAndSuperfluidDelegate":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.sender,
            linkType: getAddressType(body.sender),
          }),
        },
        {
          title: "Coins",
          html: getCoinComponent(body.coins, assetInfos),
        },
        validatorAddrReceipt(body.val_addr),
      ];
    case "/osmosis.superfluid.MsgUnPoolWhitelistedPool":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.sender,
            linkType: getAddressType(body.sender),
          }),
        },
        {
          title: "Pool ID",
          value: body.pool_id,
        },
      ];
    // osmosis/tokenfactory
    case "/osmosis.tokenfactory.v1beta1.MsgCreateDenom":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.sender,
            linkType: getAddressType(body.sender),
          }),
        },
        {
          title: "Subdenom",
          value: body.subdenom,
        },
      ];
    case "/osmosis.tokenfactory.v1beta1.MsgMint":
    case "/osmosis.tokenfactory.v1beta1.MsgBurn":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.sender,
            linkType: getAddressType(body.sender),
          }),
        },
        {
          title: "Amount",
          html: getCoinComponent(body.amount, assetInfos),
        },
      ];
    case "/osmosis.tokenfactory.v1beta1.MsgChangeAdmin":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.sender,
            linkType: getAddressType(body.sender),
          }),
        },
        {
          title: "Denom",
          value: body.denom,
        },
        {
          title: "New Admin",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.new_admin,
            linkType: getAddressType(body.new_admin),
          }),
        },
      ];
    // **No example
    case "/osmosis.tokenfactory.v1beta1.MsgSetDenomMetadata":
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: body.sender,
            linkType: getAddressType(body.sender),
          }),
        },
        {
          title: "Metadata",
          html: getCommonReceiptHtml({
            type: "json",
            value: body.metadata,
          }),
        },
      ];
    default:
      return Object.entries<string | object>(body).map((entry) =>
        getGenericValueEntry(entry, getAddressType)
      );
  }
};
