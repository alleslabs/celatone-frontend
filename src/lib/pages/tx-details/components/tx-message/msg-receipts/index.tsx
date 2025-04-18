/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/max-switch-cases */
/* eslint-disable complexity */
import { Flex } from "@chakra-ui/react";

import type { AddressReturnType } from "lib/app-provider";
import { CopyButton } from "lib/components/copy";
import { PermissionChip } from "lib/components/PermissionChip";
import { ViewPermissionAddresses } from "lib/components/ViewPermissionAddresses";
import { big } from "lib/types";
import type { Option, TxReceipt } from "lib/types";
import type { VoteOption } from "lib/utils";
import {
  extractMsgType,
  extractTxDetails,
  formatUTC,
  parseDate,
  voteOption,
} from "lib/utils";

import { CoinsComponent } from "./CoinsComponent";
import {
  attachFundsReceipt,
  channelIdReceipt,
  clientStateReceipt,
  delegatorAddrReceipt,
  getCommonReceiptHtml,
  getGenericValueEntry,
  proofHeightReceipt,
  proofInitReceipt,
  proposalIdReceipt,
  validatorAddrReceipt,
} from "./renderUtils";
import type { TxMsgData } from "..";

export const generateReceipts = (
  { msgBody, log }: Omit<TxMsgData, "assetInfos">,
  getAddressType: (address: string) => AddressReturnType
  // eslint-disable-next-line sonarjs/cognitive-complexity
): Option<TxReceipt | null | false>[] => {
  const { "@type": type, ...body } = msgBody;

  switch (type) {
    // cosmwasm/wasm
    case "/cosmwasm.wasm.v1.MsgStoreCode": {
      const details = extractTxDetails(type, body, log);
      return [
        log && {
          title: "Stored code ID",
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
          title: "Instantiate permission",
          html: (
            <Flex direction="column" gap={1}>
              <PermissionChip
                instantiatePermission={
                  details.instantiate_permission.permission
                }
                permissionAddresses={
                  details.instantiate_permission.address
                    ? [details.instantiate_permission.address]
                    : (details.instantiate_permission.addresses ?? [])
                }
              />
              <ViewPermissionAddresses
                permissionAddresses={
                  details.instantiate_permission.address
                    ? [details.instantiate_permission.address]
                    : (details.instantiate_permission.addresses ?? [])
                }
                amptrackSection="tx_msg_receipts"
              />
            </Flex>
          ),
        },
        {
          title: "Wasm byte code",
          html: (
            <Flex gap={3} align="flex-start">
              Size:{" "}
              {big(Buffer.from(details.wasm_byte_code).byteLength)
                .div(1024)
                .toFixed(1)}{" "}
              KB
              <CopyButton
                value={details.wasm_byte_code}
                variant="ghost-primary"
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
          title: "Contract instance",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.contract_address,
            linkType: "contract_address",
          }),
        },

        {
          title: "From code ID",
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
          title: "Contract admin",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.admin,
            linkType: getAddressType(details.admin),
            fallback: "No admin",
          }),
        },
        {
          title: "Label",
          value: details.label,
        },
        attachFundsReceipt(details.funds),
        {
          title: "Instantiate message",
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
          title: "Contract instance",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.contract_address,
            linkType: "contract_address",
          }),
        },
        {
          title: "From code ID",
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
          title: "Contract admin",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.admin,
            linkType: getAddressType(details.admin),
            fallback: "No admin",
          }),
        },
        {
          title: "Label",
          value: details.label,
        },
        attachFundsReceipt(details.funds),
        {
          title: "Instantiate message",
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
          title: "Fix msg",
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
        attachFundsReceipt(details.funds),
        {
          title: "Execute message",
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
          title: "New admin",
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
          title: "From address",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.from_address,
            linkType: getAddressType(details.from_address),
          }),
        },
        {
          title: "To address",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.to_address,
            linkType: getAddressType(details.to_address),
          }),
        },
        {
          title: "Amount",
          html: <CoinsComponent coins={details.amount} />,
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
          title: "Msg type URL",
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
          title: "Invariant module name",
          value: details.invariant_module_name,
        },
        { title: "Invariant route", value: details.invariant_route },
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
          title: "Withdraw address",
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
          html: <CoinsComponent coins={details.amount} />,
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
          title: "Initial deposit",
          html: <CoinsComponent coins={details.initial_deposit} />,
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
          title: "Proposal type",
          value:
            details.proposal_type ?? extractMsgType(details.content["@type"]),
        },
        {
          title: "Is expedited",
          value: String(details.is_expedited ?? false),
        },
        { title: "Title", value: details.content.title },
        {
          title: "Content",
          html: getCommonReceiptHtml({ type: "json", value: details.content }),
        },
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
          html: <CoinsComponent coins={details.amount} />,
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
          title: "Min self delegation",
          value: details.min_self_delegation,
        },
        delegatorAddrReceipt(
          details.delegator_address,
          getAddressType(details.delegator_address)
        ),
        validatorAddrReceipt(details.validator_address),
        {
          title: "Public key",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.pubkey,
          }),
        },
        {
          title: "Value",
          html: <CoinsComponent coins={[details.value]} />,
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
          title: "Commission rate",
          value: details.commission_rate,
        },
        {
          title: "Min self delegation",
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
          html: <CoinsComponent coins={[details.amount]} />,
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
          title: "Source validator address",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.validator_src_address,
            linkType: "validator_address",
          }),
        },
        {
          title: "Destination validator address",
          html: getCommonReceiptHtml({
            type: "explorer",
            value: details.validator_dst_address,
            linkType: "validator_address",
          }),
        },
        {
          title: "Amount",
          html: <CoinsComponent coins={[details.amount]} />,
        },
      ];
    }
    // ibc/applications
    case "/ibc.applications.transfer.v1.MsgTransfer": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Source port",
          value: details.source_port,
        },
        {
          title: "Source channel",
          value: details.source_channel,
        },
        {
          title: "Token",
          html: <CoinsComponent coins={[details.token]} />,
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
          title: "Timeout height",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.timeout_height,
          }),
        },
        !!details.timeout_timestamp && {
          title: "Timeout timestamp",
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
          title: "Consensus state",
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
        // newer version
        details.client_message && {
          title: "Client message",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.client_message,
          }),
        },
        // older version
        details.header && {
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
          title: "Consensus state",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.consensus_state,
          }),
        },
        {
          title: "Proof upgrade client",
          value: details.proof_upgrade_client,
        },
        {
          title: "Proof upgrade consensus state",
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
          title: "Delay period",
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
          title: "Previous connection ID",
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
          title: "Delay period",
          value: details.delay_period,
        },
        {
          title: "Counterparty versions",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.counterparty_versions,
          }),
        },
        proofHeightReceipt(details.proof_height),
        proofInitReceipt(details.proof_init),
        {
          title: "Proof client",
          value: details.proof_client,
        },
        {
          title: "Proof consensus",
          value: details.proof_consensus,
        },
        {
          title: "Consensus height",
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
          title: "Counterparty connection ID",
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
          title: "Proof try",
          value: details.proof_try,
        },
        {
          title: "Proof client",
          value: details.proof_client,
        },
        {
          title: "Proof consensus",
          value: details.proof_consensus,
        },
        {
          title: "Consensus height",
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
          title: "Proof ack",
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
          title: "Previous channel ID",
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
          title: "Counterparty version",
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
          title: "Counterparty channel ID",
          value: details.counterparty_channel_id,
        },
        {
          title: "Counterparty version",
          value: details.counterparty_version,
        },
        {
          title: "Proof try",
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
          title: "Proof ack",
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
          title: "Proof commitment",
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
          title: "Proof unreceived",
          value: details.proof_unreceived,
        },
        proofHeightReceipt(details.proof_height),
        {
          title: "Next sequence recv",
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
          title: "Proof unreceived",
          value: details.proof_unreceived,
        },
        {
          title: "Proof close",
          value: details.proof_close,
        },
        proofHeightReceipt(details.proof_height),
        {
          title: "Next sequence recv",
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
          title: "Proof acked",
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
          title: "Pool params",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.pool_params,
          }),
        },
        {
          title: "Pool assets",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.pool_assets,
          }),
        },
        {
          title: "Future pool governor",
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
          title: "Pool params",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.pool_params,
          }),
        },
        {
          title: "Initial pool liquidity",
          html: <CoinsComponent coins={details.initial_pool_liquidity} />,
        },
        {
          title: "Scaling factors",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.scaling_factors,
          }),
        },
        {
          title: "Future pool governor",
          value: details.future_pool_governor,
        },
        {
          title: "Scaling factor controller",
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
          title: "Scaling factors",
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
          title: "Share out amount",
          value: details.share_out_amount,
        },
        {
          title: "Token in maxs",
          html: <CoinsComponent coins={details.token_in_maxs ?? []} />,
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
          title: "Share in amount",
          value: details.share_in_amount,
        },
        {
          title: "Token out mins",
          html: <CoinsComponent coins={details.token_out_mins ?? []} />,
        },
      ];
    }
    case "/osmosis.gamm.v1beta1.MsgSwapExactAmountIn":
    case "/osmosis.poolmanager.v1beta1.MsgSwapExactAmountIn": {
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
          title: "Token in",
          html: <CoinsComponent coins={[details.token_in]} />,
        },
        {
          title: "Token out min amount",
          value: details.token_out_min_amount,
        },
      ];
    }
    case "/osmosis.gamm.v1beta1.MsgSwapExactAmountOut":
    case "/osmosis.poolmanager.v1beta1.MsgSwapExactAmountOut": {
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
          title: "Token in max amount",
          value: details.token_in_max_amount,
        },
        {
          title: "Token out",
          html: <CoinsComponent coins={[details.token_out]} />,
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
          title: "Token in",
          html: <CoinsComponent coins={[details.token_in]} />,
        },
        {
          title: "Share out min amount",
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
          title: "Token in denom",
          value: details.token_in_denom,
        },
        {
          title: "Share out amount",
          value: details.share_out_amount,
        },
        {
          title: "Token in max amount",
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
          title: "Token out denom",
          value: details.token_out_denom,
        },
        {
          title: "Share in amount",
          value: details.share_in_amount,
        },
        {
          title: "Token out min amount",
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
          title: "Token out",
          html: <CoinsComponent coins={[details.token_out]} />,
        },
        {
          title: "Share in max amount",
          value: details.share_in_max_amount,
        },
      ];
    }
    // osmosis/incentives
    case "/osmosis.incentives.MsgCreateGauge": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Is perpetual",
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
          title: "Distribute to",
          html: getCommonReceiptHtml({
            type: "json",
            value: details.distribute_to,
          }),
        },
        {
          title: "Coins",
          html: <CoinsComponent coins={details.coins} />,
        },
        {
          title: "Start time",
          value: formatUTC(parseDate(details.start_time)),
        },
        {
          title: "Num epochs paid over",
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
          html: <CoinsComponent coins={details.rewards} />,
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
          title: "Coin",
          html: <CoinsComponent coins={details.coins} />,
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
          html: <CoinsComponent coins={details.coins} />,
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
          html: <CoinsComponent coins={details.coins} />,
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
          html: <CoinsComponent coins={[details.coin]} />,
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
          html: <CoinsComponent coins={[details.amount]} />,
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
          title: "New admin",
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
          title: "Hot routes",
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
          title: "Hot routes",
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
          title: "Developer account",
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
          title: "Pool weights",
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
          title: "Max pool points per tx",
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
          title: "Max pool points per block",
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
          html: <CoinsComponent coins={[details.coin]} />,
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
      return Object.entries(body).map((entry) =>
        getGenericValueEntry(
          entry as [string, Record<string, unknown>],
          getAddressType
        )
      );
  }
};
