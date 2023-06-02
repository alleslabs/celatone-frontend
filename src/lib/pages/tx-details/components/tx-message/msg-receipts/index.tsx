/* eslint-disable sonarjs/max-switch-cases */
/* eslint-disable complexity */
import { Flex } from "@chakra-ui/react";
import big from "big.js";

import type { TxMsgData } from "..";
import type { AddressReturnType } from "lib/app-provider";
import { CopyButton } from "lib/components/copy";
import { PermissionChip } from "lib/components/PermissionChip";
import { ViewPermissionAddresses } from "lib/components/ViewPermissionAddresses";
import type { TxReceipt, Option, AssetInfo } from "lib/types";
import type { VoteOption } from "lib/utils";
import { voteOption, extractTxDetails, formatUTC, parseDate } from "lib/utils";

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
  { msgBody, log }: Omit<TxMsgData, "assetInfos">,
  getAddressType: (address: string) => AddressReturnType,
  assetInfos: Option<{ [key: string]: AssetInfo }>
): Option<TxReceipt | null | false>[] => {
  const { "@type": type, ...body } = msgBody;

  switch (type) {
    // cosmwasm/wasm
    case "/cosmwasm.wasm.v1.MsgStoreCode": {
      const details = extractTxDetails(type, body, log);
      return [
        log && {
          title: "Stored Code ID",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.code_id,
            linkType: "code_id",
          }),
        },
        {
          title: "Uploader",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.sender,
            linkType: getAddressType(details.sender),
          }),
        },
        details.instantiate_permission && {
          title: "Instantiate Permission",
          html: (
            <Flex direction="column" gap={1}>
              <PermissionChip
                instantiatePermission={
                  details.instantiate_permission.permission
                }
                permissionAddresses={
                  details.instantiate_permission.address
                    ? [details.instantiate_permission.address]
                    : details.instantiate_permission.addresses
                }
              />
              <ViewPermissionAddresses
                permissionAddresses={
                  details.instantiate_permission.address
                    ? [details.instantiate_permission.address]
                    : details.instantiate_permission.addresses
                }
                amptrackSection="tx_msg_receipts"
              />
            </Flex>
          ),
        },
        {
          title: "Wasm Byte Code",
          html: (
            <Flex gap={3} align="flex-start">
              Size:{" "}
              {big(Buffer.from(details.wasm_byte_code).byteLength)
                .div(1024)
                .toFixed(1)}{" "}
              KB
              <CopyButton
                value={details.wasm_byte_code}
                variant="ghost-secondary"
                buttonText="Click to Copy"
                hasIcon={false}
                mt={-1}
                amptrackSection="tx_msg_receipts_wasm_byte_code"
              />
            </Flex>
          ),
        },
      ];
    }
    case "/cosmwasm.wasm.v1.MsgInstantiateContract": {
      const details = extractTxDetails(type, body, log);
      return [
        log && {
          title: "Contract Instance",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.contract_address,
            linkType: "contract_address",
          }),
        },

        {
          title: "From Code ID",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.code_id,
            linkType: "code_id",
          }),
        },
        {
          title: "Instantiated by",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.sender,
            linkType: getAddressType(details.sender),
          }),
        },
        {
          title: "Contract Admin",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.admin,
            linkType: getAddressType(details.admin),
            fallback: "No Admin",
          }),
        },
        {
          title: "Label",
          value: details.label,
        },
        attachFundsReceipt(details.funds, assetInfos),
        {
          title: "Instantiate Message",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.msg,
          }),
        },
      ];
    }
    case "/cosmwasm.wasm.v1.MsgInstantiateContract2": {
      const details = extractTxDetails(type, body, log);
      return [
        log && {
          title: "Contract Instance",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.contract_address,
            linkType: "contract_address",
          }),
        },
        {
          title: "From Code ID",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.code_id,
            linkType: "code_id",
          }),
        },
        {
          title: "Instantiated by",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.sender,
            linkType: getAddressType(details.sender),
          }),
        },
        {
          title: "Contract Admin",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.admin,
            linkType: getAddressType(details.admin),
            fallback: "No Admin",
          }),
        },
        {
          title: "Label",
          value: details.label,
        },
        attachFundsReceipt(details.funds, assetInfos),
        {
          title: "Instantiate Message",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.msg,
          }),
        },
        {
          title: "Salt",
          html: details.salt,
        },
        {
          title: "Fix Msg",
          value: String(details.fix_msg),
        },
      ];
    }
    case "/cosmwasm.wasm.v1.MsgExecuteContract": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.sender,
            linkType: getAddressType(details.sender),
          }),
        },
        {
          title: "Contract",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.contract,
            linkType: "contract_address",
          }),
        },
        attachFundsReceipt(details.funds, assetInfos),
        {
          title: "Execute Message",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.msg,
          }),
        },
      ];
    }
    case "/cosmwasm.wasm.v1.MsgMigrateContract": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.sender,
            linkType: getAddressType(details.sender),
          }),
        },
        {
          title: "Contract",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.contract,
            linkType: "contract_address",
          }),
        },
        {
          title: "Code ID",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.code_id,
            linkType: "code_id",
          }),
        },
        {
          title: "Msg",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.msg,
          }),
        },
      ];
    }
    case "/cosmwasm.wasm.v1.MsgUpdateAdmin": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.sender,
            linkType: getAddressType(details.sender),
          }),
        },
        {
          title: "New Admin",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.new_admin,
            linkType: getAddressType(details.new_admin),
          }),
        },
        {
          title: "Contract",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.contract,
            linkType: "contract_address",
          }),
        },
      ];
    }
    case "/cosmwasm.wasm.v1.MsgClearAdmin": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.sender,
            linkType: getAddressType(details.sender),
          }),
        },
        {
          title: "Contract",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.contract,
            linkType: "contract_address",
          }),
        },
      ];
    }
    // x/bank
    case "/cosmos.bank.v1beta1.MsgSend": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "From Address",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.from_address,
            linkType: getAddressType(details.from_address),
          }),
        },
        {
          title: "To Address",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.to_address,
            linkType: getAddressType(details.to_address),
          }),
        },
        {
          title: "Amount",
          html: getCoinComponent(details.amount, assetInfos),
        },
      ];
    }
    case "/cosmos.bank.v1beta1.MsgMultiSend": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Inputs",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.inputs,
          }),
        },
        {
          title: "Outputs",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.outputs,
          }),
        },
      ];
    }
    // x/authz
    case "/cosmos.authz.v1beta1.MsgGrant": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Granter",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.granter,
            linkType: getAddressType(details.granter),
          }),
        },
        {
          title: "Grantee",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.grantee,
            linkType: getAddressType(details.grantee),
          }),
        },
        {
          title: "Grant",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.grant,
          }),
        },
      ];
    }
    case "/cosmos.authz.v1beta1.MsgRevoke": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Granter",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.granter,
            linkType: getAddressType(details.granter),
          }),
        },
        {
          title: "Grantee",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.grantee,
            linkType: getAddressType(details.grantee),
          }),
        },
        {
          title: "Msg Type Url",
          value: details.msg_type_url,
        },
      ];
    }
    case "/cosmos.authz.v1beta1.MsgExec": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Grantee",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.grantee,
            linkType: getAddressType(details.grantee),
          }),
        },
        {
          title: "Msgs",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.msgs,
          }),
        },
      ];
    }
    // x/crisis
    case "/cosmos.crisis.v1beta1.MsgVerifyInvariant": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.sender,
            linkType: getAddressType(details.sender),
          }),
        },
        {
          title: "Invariant Module Name",
          value: details.invariant_module_name,
        },
        { title: "Invariant Route", value: details.invariant_route },
      ];
    }
    // x/distribution
    case "/cosmos.distribution.v1beta1.MsgSetWithdrawAddress": {
      const details = extractTxDetails(type, body, log);
      return [
        delegatorAddrReceipt(
          details.delegator_address,
          getAddressType(details.delegator_address)
        ),
        {
          title: "Withdraw Address",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.withdraw_address,
            linkType: getAddressType(details.withdraw_address),
          }),
        },
      ];
    }
    case "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward": {
      const details = extractTxDetails(type, body, log);
      return [
        delegatorAddrReceipt(
          details.delegator_address,
          getAddressType(details.delegator_address)
        ),
        validatorAddrReceipt(details.validator_address),
      ];
    }
    case "/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission": {
      const details = extractTxDetails(type, body, log);
      return [validatorAddrReceipt(details.validator_address)];
    }
    case "/cosmos.distribution.v1beta1.MsgFundCommunityPool": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Amount",
          html: getCoinComponent(details.amount, assetInfos),
        },
        {
          title: "Depositor",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.depositor,
            linkType: getAddressType(details.depositor),
          }),
        },
      ];
    }
    // x/evidence
    case "/cosmos.evidence.v1beta1.MsgSubmitEvidence": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Submitter",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.submitter,
            linkType: getAddressType(details.submitter),
          }),
        },
        {
          title: "Evidence",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.evidence,
          }),
        },
      ];
    }
    //  x/feegrant
    case "/cosmos.feegrant.v1beta1.MsgGrantAllowance": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Granter",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.granter,
            linkType: getAddressType(details.granter),
          }),
        },
        {
          title: "Grantee",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.grantee,
            linkType: getAddressType(details.grantee),
          }),
        },
        {
          title: "Allowance",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.allowance,
          }),
        },
      ];
    }
    case "/cosmos.feegrant.v1beta1.MsgRevokeAllowance": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Granter",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.granter,
            linkType: getAddressType(details.granter),
          }),
        },
        {
          title: "Grantee",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.grantee,
            linkType: getAddressType(details.grantee),
          }),
        },
      ];
    }
    // x/gov
    case "/cosmos.gov.v1beta1.MsgSubmitProposal": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Initial Deposit",
          html: getCoinComponent(details.initial_deposit, assetInfos),
        },
        {
          title: "Proposer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.proposer,
            linkType: getAddressType(details.proposer),
          }),
        },
        log && proposalIdReceipt(details.proposal_id),
        log && {
          title: "Proposal Type",
          value: details.proposal_type,
        },
        {
          title: "Is Expedited",
          value: String(details.is_expedited ?? false),
        },
        { title: "Title", value: details.content.title },
      ];
    }
    case "/cosmos.gov.v1beta1.MsgVote": {
      const details = extractTxDetails(type, body, log);
      return [
        proposalIdReceipt(details.proposal_id),
        {
          title: "Voter",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.voter,
            linkType: getAddressType(details.voter),
          }),
        },
        {
          title: "Option",
          value: voteOption[details.option as VoteOption],
        },
      ];
    }
    case "/cosmos.gov.v1beta1.MsgVoteWeighted": {
      const details = extractTxDetails(type, body, log);
      return [
        proposalIdReceipt(details.proposal_id),
        {
          title: "Voter",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.voter,
            linkType: getAddressType(details.voter),
          }),
        },
        {
          title: "Options",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.options,
          }),
        },
      ];
    }
    case "/cosmos.gov.v1beta1.MsgDeposit": {
      const details = extractTxDetails(type, body, log);
      return [
        proposalIdReceipt(details.proposal_id),
        {
          title: "Depositor",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.depositor,
            linkType: getAddressType(details.depositor),
          }),
        },
        {
          title: "Amount",
          html: getCoinComponent(details.amount, assetInfos),
        },
      ];
    }
    // x/slashing
    case "/cosmos.slashing.v1beta1.MsgUnjail": {
      const details = extractTxDetails(type, body, log);
      return [validatorAddrReceipt(details.validator_addr)];
    }
    // x/staking
    case "/cosmos.staking.v1beta1.MsgCreateValidator": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Description",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.description,
          }),
        },
        {
          title: "Commission",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.commission,
          }),
        },
        {
          title: "Min Self Delegation",
          value: details.min_self_delegation,
        },
        delegatorAddrReceipt(
          details.delegator_address,
          getAddressType(details.delegator_address)
        ),
        validatorAddrReceipt(details.validator_address),
        {
          title: "Public Key",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.pubkey,
          }),
        },
        {
          title: "Value",
          html: getCoinComponent(details.value, assetInfos),
        },
      ];
    }
    case "/cosmos.staking.v1beta1.MsgEditValidator": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Description",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.description,
          }),
        },
        validatorAddrReceipt(details.validator_address),
        {
          title: "Commission Rate",
          value: details.commission_rate,
        },
        {
          title: "Min Self Delegation",
          value: details.min_self_delegation,
        },
      ];
    }
    case "/cosmos.staking.v1beta1.MsgDelegate":
    case "/cosmos.staking.v1beta1.MsgUndelegate": {
      const details = extractTxDetails(type, body, log);
      return [
        delegatorAddrReceipt(
          details.delegator_address,
          getAddressType(details.delegator_address)
        ),
        validatorAddrReceipt(details.validator_address),
        {
          title: "Amount",
          html: getCoinComponent(details.amount, assetInfos),
        },
      ];
    }
    case "/cosmos.staking.v1beta1.MsgBeginRedelegate": {
      const details = extractTxDetails(type, body, log);
      return [
        delegatorAddrReceipt(
          details.delegator_address,
          getAddressType(details.delegator_address)
        ),
        {
          title: "Source Validator Address",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.validator_src_address,
            linkType: "validator_address",
          }),
        },
        {
          title: "Destination Validator Address",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.validator_dst_address,
            linkType: "validator_address",
          }),
        },
        {
          title: "Amount",
          html: getCoinComponent(details.amount, assetInfos),
        },
      ];
    }
    // ibc/applications
    case "/ibc.applications.transfer.v1.MsgTransfer": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Source Port",
          value: details.source_port,
        },
        {
          title: "Source Channel",
          value: details.source_channel,
        },
        {
          title: "Token",
          html: getCoinComponent(details.token, assetInfos),
        },
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.sender,
            linkType: getAddressType(details.sender),
          }),
        },
        {
          title: "Receiver",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.receiver,
            linkType: getAddressType(details.receiver),
          }),
        },
        details.timeout_height && {
          title: "Timeout Height",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.timeout_height,
          }),
        },
        !!details.timeout_timestamp && {
          title: "Timeout Timestamp",
          value: formatUTC(parseDate(details.timeout_timestamp)),
        },
        {
          title: "Memo",
          value: details.memo,
        },
      ];
    }
    // ibc/core
    case "/ibc.core.client.v1.MsgCreateClient": {
      const details = extractTxDetails(type, body, log);
      return [
        clientStateReceipt(details.client_state),
        {
          title: "Consensus State",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.consensus_state,
          }),
        },
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.signer,
            linkType: getAddressType(details.signer),
          }),
        },
      ];
    }
    case "/ibc.core.client.v1.MsgUpdateClient": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Client ID",
          value: details.client_id,
        },
        {
          title: "Header",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.header,
          }),
        },
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.signer,
            linkType: getAddressType(details.signer),
          }),
        },
      ];
    }
    case "/ibc.core.client.v1.MsgUpgradeClient": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Client ID",
          value: details.client_id,
        },
        clientStateReceipt(details.client_state),
        {
          title: "Consensus State",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.consensus_state,
          }),
        },
        {
          title: "Proof Upgrade Client",
          value: details.proof_upgrade_client,
        },
        {
          title: "Proof Upgrade Consensus State",
          value: details.proof_upgrade_consensus_state,
        },
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.signer,
            linkType: getAddressType(details.signer),
          }),
        },
      ];
    }
    case "/ibc.core.client.v1.MsgSubmitMisbehaviour": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Client ID",
          value: details.client_id,
        },
        {
          title: "Misbehaviour",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.misbehaviour,
          }),
        },
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.signer,
            linkType: getAddressType(details.signer),
          }),
        },
      ];
    }
    case "/ibc.core.connection.v1.MsgConnectionOpenInit": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Client ID",
          value: details.client_id,
        },
        {
          title: "Counterparty",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.counterparty,
          }),
        },
        {
          title: "Version",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.version,
          }),
        },
        {
          title: "Delay Period",
          value: details.delay_period,
        },
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.signer,
            linkType: getAddressType(details.signer),
          }),
        },
      ];
    }
    case "/ibc.core.connection.v1.MsgConnectionOpenTry": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Client ID",
          value: details.client_id,
        },
        {
          title: "Previous Connection ID",
          value: details.previous_connection_id,
        },
        clientStateReceipt(details.client_state),
        {
          title: "Counterparty",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.counterparty,
          }),
        },
        {
          title: "Delay Period",
          value: details.delay_period,
        },
        {
          title: "Counterparty Versions",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.counterparty_versions,
          }),
        },
        proofHeightReceipt(details.proof_height),
        proofInitReceipt(details.proof_init),
        {
          title: "Proof Client",
          value: details.proof_client,
        },
        {
          title: "Proof Consensus",
          value: details.proof_consensus,
        },
        {
          title: "Consensus Height",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.consensus_height,
          }),
        },
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.signer,
            linkType: getAddressType(details.signer),
          }),
        },
      ];
    }
    case "/ibc.core.connection.v1.MsgConnectionOpenAck": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Connection ID",
          value: details.connection_id,
        },
        {
          title: "Counterparty Connection ID",
          value: details.counterparty_connection_id,
        },
        {
          title: "Version",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.version,
          }),
        },
        clientStateReceipt(details.client_state),
        proofHeightReceipt(details.proof_height),
        {
          title: "Proof Try",
          value: details.proof_try,
        },
        {
          title: "Proof Client",
          value: details.proof_client,
        },
        {
          title: "Proof Consensus",
          value: details.proof_consensus,
        },
        {
          title: "Consensus Height",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.consensus_height,
          }),
        },
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.signer,
            linkType: getAddressType(details.signer),
          }),
        },
      ];
    }
    case "/ibc.core.connection.v1.MsgConnectionOpenConfirm": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Connection ID",
          value: details.connection_id,
        },
        {
          title: "Proof Ack",
          value: details.proof_ack,
        },
        proofHeightReceipt(details.proof_height),
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.signer,
            linkType: getAddressType(details.signer),
          }),
        },
      ];
    }
    case "/ibc.core.channel.v1.MsgChannelOpenInit": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Port ID",
          value: details.port_id,
        },
        {
          title: "Channel",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.channel,
          }),
        },
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.signer,
            linkType: getAddressType(details.signer),
          }),
        },
      ];
    }
    case "/ibc.core.channel.v1.MsgChannelOpenTry": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Port ID",
          value: details.port_id,
        },
        {
          title: "Previous Channel ID",
          value: details.previous_channel_id,
        },
        {
          title: "Channel",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.channel,
          }),
        },
        {
          title: "Counterparty Version",
          value: details.counterparty_version,
        },
        proofInitReceipt(details.proof_init),
        proofHeightReceipt(details.proof_height),
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.signer,
            linkType: getAddressType(details.signer),
          }),
        },
      ];
    }
    case "/ibc.core.channel.v1.MsgChannelOpenAck": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Port ID",
          value: details.port_id,
        },
        channelIdReceipt(details.channel_id),
        {
          title: "Counterparty Channel ID",
          value: details.counterparty_channel_id,
        },
        {
          title: "Counterparty Version",
          value: details.counterparty_version,
        },
        {
          title: "Proof Try",
          value: details.proof_try,
        },
        proofHeightReceipt(details.proof_height),
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.signer,
            linkType: getAddressType(details.signer),
          }),
        },
      ];
    }
    case "/ibc.core.channel.v1.MsgChannelOpenConfirm": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Port ID",
          value: details.port_id,
        },
        channelIdReceipt(details.channel_id),
        {
          title: "Proof Ack",
          value: details.proof_ack,
        },
        proofHeightReceipt(details.proof_height),
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.signer,
            linkType: getAddressType(details.signer),
          }),
        },
      ];
    }
    case "/ibc.core.channel.v1.MsgChannelCloseInit": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Port ID",
          value: details.port_id,
        },
        channelIdReceipt(details.channel_id),
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.signer,
            linkType: getAddressType(details.signer),
          }),
        },
      ];
    }
    case "/ibc.core.channel.v1.MsgChannelCloseConfirm": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Port ID",
          value: details.port_id,
        },
        channelIdReceipt(details.channel_id),
        proofInitReceipt(details.proof_init),
        proofHeightReceipt(details.proof_height),
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.signer,
            linkType: getAddressType(details.signer),
          }),
        },
      ];
    }
    case "/ibc.core.channel.v1.MsgRecvPacket": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Packet",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.packet,
          }),
        },
        {
          title: "Proof Commitment",
          value: details.proof_commitment,
        },
        proofHeightReceipt(details.proof_height),
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.signer,
            linkType: getAddressType(details.signer),
          }),
        },
      ];
    }
    case "/ibc.core.channel.v1.MsgTimeout": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Packet",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.packet,
          }),
        },
        {
          title: "Proof Unreceived",
          value: details.proof_unreceived,
        },
        proofHeightReceipt(details.proof_height),
        {
          title: "Next Sequence Recv",
          value: details.next_sequence_recv,
        },
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.signer,
            linkType: getAddressType(details.signer),
          }),
        },
      ];
    }
    case "/ibc.core.channel.v1.MsgTimeoutOnClose": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Packet",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.packet,
          }),
        },
        {
          title: "Proof Unreceived",
          value: details.proof_unreceived,
        },
        {
          title: "Proof Close",
          value: details.proof_close,
        },
        proofHeightReceipt(details.proof_height),
        {
          title: "Next Sequence Recv",
          value: details.next_sequence_recv,
        },
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.signer,
            linkType: getAddressType(details.signer),
          }),
        },
      ];
    }
    case "/ibc.core.channel.v1.MsgAcknowledgement": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Packet",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.packet,
          }),
        },
        {
          title: "Acknowledgement",
          value: details.acknowledgement,
        },
        {
          title: "Proof Acked",
          value: details.proof_acked,
        },
        proofHeightReceipt(details.proof_height),
        {
          title: "Signer",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.signer,
            linkType: getAddressType(details.signer),
          }),
        },
      ];
    }
    // osmosis/gamm
    case "/osmosis.gamm.poolmodels.balancer.v1beta1.MsgCreateBalancerPool": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.sender,
            linkType: getAddressType(details.sender),
          }),
        },
        {
          title: "Pool Params",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.pool_params,
          }),
        },
        {
          title: "Pool Assets",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.pool_assets,
          }),
        },
        {
          title: "Future Pool Governor",
          value: details.future_pool_governor,
        },
      ];
    }
    case "/osmosis.gamm.poolmodels.stableswap.v1beta1.MsgCreateStableswapPool": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.sender,
            linkType: getAddressType(details.sender),
          }),
        },
        {
          title: "Pool Params",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.pool_params,
          }),
        },
        {
          title: "Initial Pool Liquidity",
          html: getCoinComponent(details.initial_pool_liquidity, assetInfos),
        },
        {
          title: "Scaling Factors",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.scaling_factors,
          }),
        },
        {
          title: "Future Pool Governor",
          value: details.future_pool_governor,
        },
        {
          title: "Scaling Factor Controller",
          value: details.scaling_factor_controller,
        },
      ];
    }
    case "/osmosis.gamm.poolmodels.stableswap.v1beta1.MsgStableSwapAdjustScalingFactors": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.sender,
            linkType: getAddressType(details.sender),
          }),
        },
        {
          title: "Pool ID",
          value: details.pool_id,
        },
        {
          title: "Scaling Factors",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.scaling_factors,
          }),
        },
      ];
    }
    case "/osmosis.gamm.v1beta1.MsgJoinPool": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.sender,
            linkType: getAddressType(details.sender),
          }),
        },
        {
          title: "Pool ID",
          value: details.pool_id,
        },
        {
          title: "Share Out Amount",
          value: details.share_out_amount,
        },
        {
          title: "Token In Maxs",
          html: getCoinComponent(details.token_in_maxs, assetInfos),
        },
      ];
    }
    case "/osmosis.gamm.v1beta1.MsgExitPool": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.sender,
            linkType: getAddressType(details.sender),
          }),
        },
        {
          title: "Pool ID",
          value: details.pool_id,
        },
        {
          title: "Share In Amount",
          value: details.share_in_amount,
        },
        {
          title: "Token Out Mins",
          html: getCoinComponent(details.token_out_mins, assetInfos),
        },
      ];
    }
    case "/osmosis.gamm.v1beta1.MsgSwapExactAmountIn": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.sender,
            linkType: getAddressType(details.sender),
          }),
        },
        {
          title: "Routes",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.routes,
          }),
        },
        {
          title: "Token In",
          html: getCoinComponent(details.token_in, assetInfos),
        },
        {
          title: "Token Out Min Amount",
          value: details.token_out_min_amount,
        },
      ];
    }
    case "/osmosis.gamm.v1beta1.MsgSwapExactAmountOut": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.sender,
            linkType: getAddressType(details.sender),
          }),
        },
        {
          title: "Routes",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.routes,
          }),
        },
        {
          title: "Token In Max Amount",
          value: details.token_in_max_amount,
        },
        {
          title: "Token Out",
          html: getCoinComponent(details.token_out, assetInfos),
        },
      ];
    }
    case "/osmosis.gamm.v1beta1.MsgJoinSwapExternAmountIn": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.sender,
            linkType: getAddressType(details.sender),
          }),
        },
        {
          title: "Pool ID",
          value: details.pool_id,
        },
        {
          title: "Token In",
          html: getCoinComponent(details.token_in, assetInfos),
        },
        {
          title: "Share Out Min Amount",
          value: details.share_out_min_amount,
        },
      ];
    }
    case "/osmosis.gamm.v1beta1.MsgJoinSwapShareAmountOut": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.sender,
            linkType: getAddressType(details.sender),
          }),
        },
        {
          title: "Pool ID",
          value: details.pool_id,
        },
        {
          title: "Token In Denom",
          value: details.token_in_denom,
        },
        {
          title: "Share Out Amount",
          value: details.share_out_amount,
        },
        {
          title: "Token In Max Amount",
          value: details.token_in_max_amount,
        },
      ];
    }
    case "/osmosis.gamm.v1beta1.MsgExitSwapShareAmountIn": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.sender,
            linkType: getAddressType(details.sender),
          }),
        },
        {
          title: "Pool ID",
          value: details.pool_id,
        },
        {
          title: "Token Out Denom",
          value: details.token_out_denom,
        },
        {
          title: "Share In Amount",
          value: details.share_in_amount,
        },
        {
          title: "Token Out Min Amount",
          value: details.token_out_min_amount,
        },
      ];
    }
    case "/osmosis.gamm.v1beta1.MsgExitSwapExternAmountOut": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.sender,
            linkType: getAddressType(details.sender),
          }),
        },
        {
          title: "Pool ID",
          value: details.pool_id,
        },
        {
          title: "Token Out",
          html: getCoinComponent(details.token_out, assetInfos),
        },
        {
          title: "Share In Max Amount",
          value: details.share_in_max_amount,
        },
      ];
    }
    // osmosis/incentives
    case "/osmosis.incentives.MsgCreateGauge": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Is Perpetual",
          value: String(details.is_perpetual),
        },
        {
          title: "Owner",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.owner,
            linkType: getAddressType(details.owner),
          }),
        },
        {
          title: "Distribute To",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.distribute_to,
          }),
        },
        {
          title: "Coins",
          html: getCoinComponent(details.coins, assetInfos),
        },
        {
          title: "Start Time",
          value: formatUTC(parseDate(details.start_time)),
        },
        {
          title: "Num Epochs Paid Over",
          value: details.num_epochs_paid_over,
        },
      ];
    }
    case "/osmosis.incentives.MsgAddToGauge": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Owner",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.owner,
            linkType: getAddressType(details.owner),
          }),
        },
        {
          title: "Gauge ID",
          value: details.gauge_id,
        },
        {
          title: "Rewards",
          html: getCoinComponent(details.rewards, assetInfos),
        },
      ];
    }
    // osmosis/lockup
    case "/osmosis.lockup.MsgLockTokens": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Owner",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.owner,
            linkType: getAddressType(details.owner),
          }),
        },
        {
          title: "Duration",
          value: details.duration,
        },
        {
          title: "Coins",
          html: getCoinComponent(details.coins, assetInfos),
        },
      ];
    }
    case "/osmosis.lockup.MsgBeginUnlockingAll": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Owner",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.owner,
            linkType: getAddressType(details.owner),
          }),
        },
      ];
    }
    case "/osmosis.lockup.MsgBeginUnlocking":
    case "/osmosis.lockup.MsgForceUnlock": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Owner",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.owner,
            linkType: getAddressType(details.owner),
          }),
        },
        {
          title: "ID",
          value: details.ID,
        },
        details.coins && {
          title: "Coins",
          html: getCoinComponent(details.coins, assetInfos),
        },
      ];
    }
    // ** No example
    case "/osmosis.lockup.MsgExtendLockup": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Owner",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.owner,
            linkType: getAddressType(details.owner),
          }),
        },
        {
          title: "ID",
          value: details.ID,
        },
        {
          title: "Duration",
          value: details.duration,
        },
      ];
    }
    // osmosis/superfluid
    case "/osmosis.superfluid.MsgSuperfluidDelegate": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.sender,
            linkType: getAddressType(details.sender),
          }),
        },
        {
          title: "Lock ID",
          value: details.lock_id,
        },
        validatorAddrReceipt(details.val_addr),
      ];
    }
    case "/osmosis.superfluid.MsgSuperfluidUndelegate":
    case "/osmosis.superfluid.MsgSuperfluidUnbondLock": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.sender,
            linkType: getAddressType(details.sender),
          }),
        },
        {
          title: "Lock ID",
          value: details.lock_id,
        },
      ];
    }
    case "/osmosis.superfluid.MsgLockAndSuperfluidDelegate": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.sender,
            linkType: getAddressType(details.sender),
          }),
        },
        {
          title: "Coins",
          html: getCoinComponent(details.coins, assetInfos),
        },
        validatorAddrReceipt(details.val_addr),
      ];
    }
    case "/osmosis.superfluid.MsgUnPoolWhitelistedPool": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.sender,
            linkType: getAddressType(details.sender),
          }),
        },
        {
          title: "Pool ID",
          value: details.pool_id,
        },
      ];
    }
    case "/osmosis.superfluid.MsgSuperfluidUndelegateAndUnbondLock": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.sender,
            linkType: getAddressType(details.sender),
          }),
        },
        {
          title: "Lock ID",
          value: details.lock_id,
        },
        {
          title: "Coin",
          html: getCoinComponent(details.coin, assetInfos),
        },
      ];
    }
    // osmosis/tokenfactory
    case "/osmosis.tokenfactory.v1beta1.MsgCreateDenom": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.sender,
            linkType: getAddressType(details.sender),
          }),
        },
        {
          title: "Subdenom",
          value: details.subdenom,
        },
      ];
    }
    case "/osmosis.tokenfactory.v1beta1.MsgMint":
    case "/osmosis.tokenfactory.v1beta1.MsgBurn": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.sender,
            linkType: getAddressType(details.sender),
          }),
        },
        {
          title: "Amount",
          html: getCoinComponent(details.amount, assetInfos),
        },
      ];
    }
    case "/osmosis.tokenfactory.v1beta1.MsgChangeAdmin": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.sender,
            linkType: getAddressType(details.sender),
          }),
        },
        {
          title: "Denom",
          value: details.denom,
        },
        {
          title: "New Admin",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.new_admin,
            linkType: getAddressType(details.new_admin),
          }),
        },
      ];
    }
    // **No example
    case "/osmosis.tokenfactory.v1beta1.MsgSetDenomMetadata": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Sender",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.sender,
            linkType: getAddressType(details.sender),
          }),
        },
        {
          title: "Metadata",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.metadata,
          }),
        },
      ];
    }
    // osmosis/protorev
    case "/osmosis.protorev.v1beta1.MsgSetHotRoutes": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Admin",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.admin,
            linkType: getAddressType(details.admin),
          }),
        },
        {
          title: "Hot Routes",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.hot_routes,
          }),
        },
      ];
    }
    case "/osmosis.protorev.v1beta1.MsgSetBaseDenoms": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Admin",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.admin,
            linkType: getAddressType(details.admin),
          }),
        },
        {
          title: "Hot Routes",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.base_denoms,
          }),
        },
      ];
    }
    case "/osmosis.protorev.v1beta1.MsgSetDeveloperAccount": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Admin",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.admin,
            linkType: getAddressType(details.admin),
          }),
        },
        {
          title: "Developer Account",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.developer_account,
            linkType: getAddressType(details.developer_account),
          }),
        },
      ];
    }
    case "/osmosis.protorev.v1beta1.MsgSetPoolWeights": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Admin",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.admin,
            linkType: getAddressType(details.admin),
          }),
        },
        {
          title: "Pool Weights",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.pool_weights,
          }),
        },
      ];
    }
    case "/osmosis.protorev.v1beta1.MsgSetMaxPoolPointsPerTx": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Admin",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.admin,
            linkType: getAddressType(details.admin),
          }),
        },
        {
          title: "Max Pool Points Per Tx",
          value: details.max_pool_points_per_tx,
        },
      ];
    }
    case "/osmosis.protorev.v1beta1.MsgSetMaxPoolPointsPerBlock": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Admin",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.admin,
            linkType: getAddressType(details.admin),
          }),
        },
        {
          title: "Max Pool Points Per Block",
          value: details.max_pool_points_per_block,
        },
      ];
    }
    // osmosis/valsetpref
    case "/osmosis.valsetpref.v1beta1.MsgDelegateToValidatorSet":
    case "/osmosis.valsetpref.v1beta1.MsgUndelegateFromValidatorSet": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Delegator",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.delegator,
            linkType: getAddressType(details.delegator),
          }),
        },
        {
          title: "Coin",
          html: getCoinComponent(details.coin, assetInfos),
        },
      ];
    }
    case "/osmosis.valsetpref.v1beta1.MsgRedelegateValidatorSet":
    case "/osmosis.valsetpref.v1beta1.MsgSetValidatorSetPreference": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Delegator",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.delegator,
            linkType: getAddressType(details.delegator),
          }),
        },
        {
          title: "Preferences",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.preferences,
          }),
        },
      ];
    }
    case "/osmosis.valsetpref.v1beta1.MsgWithdrawDelegationRewards": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Delegator",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.delegator,
            linkType: getAddressType(details.delegator),
          }),
        },
      ];
    }
    case "/osmosis.valsetpref.v1beta1.MsgDelegateBondedTokens": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Delegator",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.delegator,
            linkType: getAddressType(details.delegator),
          }),
        },
        {
          title: "Lock ID",
          value: details.lockID,
        },
      ];
    }
    default:
      return Object.entries<string | object>(body).map((entry) =>
        getGenericValueEntry(entry, getAddressType)
      );
  }
};
