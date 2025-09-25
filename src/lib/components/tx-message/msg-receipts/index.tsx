import type { AddressReturnType } from "lib/app-provider";
import type { Option, TxReceipt } from "lib/types";
import type { VoteOption } from "lib/utils";

import { Flex } from "@chakra-ui/react";
import { CopyButton } from "lib/components/copy";
import { PermissionChip } from "lib/components/PermissionChip";
import { ViewPermissionAddresses } from "lib/components/ViewPermissionAddresses";
import { big } from "lib/types";
import {
  extractMsgType,
  extractTxDetails,
  formatUTC,
  parseDate,
  parseNanosecondsToDate,
  voteOption,
} from "lib/utils";

import type { TxMsgData } from "..";

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

export const generateReceipts = (
  { log, msgBody }: Omit<TxMsgData, "assetInfos">,
  getAddressType: (address: string) => AddressReturnType
): Option<TxReceipt>[] => {
  const { "@type": type, ...body } = msgBody;

  switch (type) {
    case "/cosmos.authz.v1beta1.MsgExec": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.grantee),
            type: "explorer",
            value: details.grantee,
          }),
          title: "Grantee",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.msgs,
          }),
          title: "Msgs",
          type: "standard",
        },
      ];
    }
    // x/authz
    case "/cosmos.authz.v1beta1.MsgGrant": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.granter),
            type: "explorer",
            value: details.granter,
          }),
          title: "Granter",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.grantee),
            type: "explorer",
            value: details.grantee,
          }),
          title: "Grantee",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.grant,
          }),
          title: "Grant",
          type: "standard",
        },
      ];
    }
    case "/cosmos.authz.v1beta1.MsgRevoke": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.granter),
            type: "explorer",
            value: details.granter,
          }),
          title: "Granter",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.grantee),
            type: "explorer",
            value: details.grantee,
          }),
          title: "Grantee",
          type: "standard",
        },
        {
          title: "Msg type URL",
          type: "standard",
          value: details.msg_type_url,
        },
      ];
    }
    case "/cosmos.bank.v1beta1.MsgMultiSend": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.inputs,
          }),
          title: "Inputs",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.outputs,
          }),
          title: "Outputs",
          type: "standard",
        },
      ];
    }
    // x/bank
    case "/cosmos.bank.v1beta1.MsgSend": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.from_address),
            type: "explorer",
            value: details.from_address,
          }),
          title: "From address",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.to_address),
            type: "explorer",
            value: details.to_address,
          }),
          title: "To address",
          type: "standard",
        },
        {
          html: <CoinsComponent coins={details.amount} />,
          title: "Amount",
          type: "standard",
        },
      ];
    }
    // x/crisis
    case "/cosmos.crisis.v1beta1.MsgVerifyInvariant": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.sender),
            type: "explorer",
            value: details.sender,
          }),
          title: "Sender",
          type: "standard",
        },
        {
          title: "Invariant module name",
          type: "standard",
          value: details.invariant_module_name,
        },
        {
          title: "Invariant route",
          type: "standard",
          value: details.invariant_route,
        },
      ];
    }
    case "/cosmos.distribution.v1beta1.MsgFundCommunityPool": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: <CoinsComponent coins={details.amount} />,
          title: "Amount",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.depositor),
            type: "explorer",
            value: details.depositor,
          }),
          title: "Depositor",
          type: "standard",
        },
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
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.withdraw_address),
            type: "explorer",
            value: details.withdraw_address,
          }),
          title: "Withdraw address",
          type: "standard",
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
    // x/evidence
    case "/cosmos.evidence.v1beta1.MsgSubmitEvidence": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.submitter),
            type: "explorer",
            value: details.submitter,
          }),
          title: "Submitter",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.evidence,
          }),
          title: "Evidence",
          type: "standard",
        },
      ];
    }
    //  x/feegrant
    case "/cosmos.feegrant.v1beta1.MsgGrantAllowance": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.granter),
            type: "explorer",
            value: details.granter,
          }),
          title: "Granter",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.grantee),
            type: "explorer",
            value: details.grantee,
          }),
          title: "Grantee",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.allowance,
          }),
          title: "Allowance",
          type: "standard",
        },
      ];
    }
    case "/cosmos.feegrant.v1beta1.MsgRevokeAllowance": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.granter),
            type: "explorer",
            value: details.granter,
          }),
          title: "Granter",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.grantee),
            type: "explorer",
            value: details.grantee,
          }),
          title: "Grantee",
          type: "standard",
        },
      ];
    }
    case "/cosmos.gov.v1beta1.MsgDeposit": {
      const details = extractTxDetails(type, body, log);
      return [
        proposalIdReceipt(details.proposal_id),
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.depositor),
            type: "explorer",
            value: details.depositor,
          }),
          title: "Depositor",
          type: "standard",
        },
        {
          html: <CoinsComponent coins={details.amount} />,
          title: "Amount",
          type: "standard",
        },
      ];
    }
    // x/gov
    case "/cosmos.gov.v1beta1.MsgSubmitProposal": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: <CoinsComponent coins={details.initial_deposit} />,
          title: "Initial deposit",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.proposer),
            type: "explorer",
            value: details.proposer,
          }),
          title: "Proposer",
          type: "standard",
        },
        log && proposalIdReceipt(details.proposal_id),
        log && {
          title: "Proposal type",
          type: "standard",
          value:
            details.proposal_type ?? extractMsgType(details.content["@type"]),
        },
        {
          title: "Is expedited",
          type: "standard",
          value: String(details.is_expedited ?? false),
        },
        { title: "Title", type: "standard", value: details.content.title },
        {
          html: getCommonReceiptHtml({ type: "json", value: details.content }),
          title: "Content",
          type: "standard",
        },
      ];
    }
    case "/cosmos.gov.v1beta1.MsgVote": {
      const details = extractTxDetails(type, body, log);
      return [
        proposalIdReceipt(details.proposal_id),
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.voter),
            type: "explorer",
            value: details.voter,
          }),
          title: "Voter",
          type: "standard",
        },
        {
          title: "Option",
          type: "standard",
          value: voteOption[details.option as VoteOption],
        },
      ];
    }
    case "/cosmos.gov.v1beta1.MsgVoteWeighted": {
      const details = extractTxDetails(type, body, log);
      return [
        proposalIdReceipt(details.proposal_id),
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.voter),
            type: "explorer",
            value: details.voter,
          }),
          title: "Voter",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.options,
          }),
          title: "Options",
          type: "standard",
        },
      ];
    }
    // x/slashing
    case "/cosmos.slashing.v1beta1.MsgUnjail": {
      const details = extractTxDetails(type, body, log);
      return [validatorAddrReceipt(details.validator_addr)];
    }
    case "/cosmos.staking.v1beta1.MsgBeginRedelegate": {
      const details = extractTxDetails(type, body, log);
      return [
        delegatorAddrReceipt(
          details.delegator_address,
          getAddressType(details.delegator_address)
        ),
        {
          html: getCommonReceiptHtml({
            linkType: "validator_address",
            type: "explorer",
            value: details.validator_src_address,
          }),
          title: "Source validator address",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            linkType: "validator_address",
            type: "explorer",
            value: details.validator_dst_address,
          }),
          title: "Destination validator address",
          type: "standard",
        },
        {
          html: <CoinsComponent coins={[details.amount]} />,
          title: "Amount",
          type: "standard",
        },
      ];
    }
    // x/staking
    case "/cosmos.staking.v1beta1.MsgCreateValidator": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.description,
          }),
          title: "Description",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.commission,
          }),
          title: "Commission",
          type: "standard",
        },
        {
          title: "Min self delegation",
          type: "standard",
          value: details.min_self_delegation,
        },
        delegatorAddrReceipt(
          details.delegator_address,
          getAddressType(details.delegator_address)
        ),
        validatorAddrReceipt(details.validator_address),
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.pubkey,
          }),
          title: "Public key",
          type: "standard",
        },
        {
          html: <CoinsComponent coins={[details.value]} />,
          title: "Value",
          type: "standard",
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
          html: <CoinsComponent coins={[details.amount]} />,
          title: "Amount",
          type: "standard",
        },
      ];
    }
    case "/cosmos.staking.v1beta1.MsgEditValidator": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.description,
          }),
          title: "Description",
          type: "standard",
        },
        validatorAddrReceipt(details.validator_address),
        {
          title: "Commission rate",
          type: "standard",
          value: details.commission_rate,
        },
        {
          title: "Min self delegation",
          type: "standard",
          value: details.min_self_delegation,
        },
      ];
    }
    case "/cosmwasm.wasm.v1.MsgClearAdmin": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.sender),
            type: "explorer",
            value: details.sender,
          }),
          title: "Sender",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            linkType: "contract_address",
            type: "explorer",
            value: details.contract,
          }),
          title: "Contract",
          type: "standard",
        },
      ];
    }
    case "/cosmwasm.wasm.v1.MsgExecuteContract": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.sender),
            type: "explorer",
            value: details.sender,
          }),
          title: "Sender",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            linkType: "contract_address",
            type: "explorer",
            value: details.contract,
          }),
          title: "Contract",
          type: "standard",
        },
        attachFundsReceipt(details.funds),
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.msg,
          }),
          title: "Execute message",
          type: "standard",
        },
      ];
    }
    case "/cosmwasm.wasm.v1.MsgInstantiateContract": {
      const details = extractTxDetails(type, body, log);
      return [
        log && {
          html: getCommonReceiptHtml({
            linkType: "contract_address",
            type: "explorer",
            value: details.contract_address,
          }),
          title: "Contract instance",
          type: "standard",
        },

        {
          html: getCommonReceiptHtml({
            linkType: "code_id",
            type: "explorer",
            value: details.code_id,
          }),
          title: "From code ID",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.sender),
            type: "explorer",
            value: details.sender,
          }),
          title: "Instantiated by",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            fallback: "No admin",
            linkType: getAddressType(details.admin),
            type: "explorer",
            value: details.admin,
          }),
          title: "Contract admin",
          type: "standard",
        },
        {
          title: "Label",
          type: "standard",
          value: details.label,
        },
        attachFundsReceipt(details.funds),
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.msg,
          }),
          title: "Instantiate message",
          type: "standard",
        },
      ];
    }
    case "/cosmwasm.wasm.v1.MsgInstantiateContract2": {
      const details = extractTxDetails(type, body, log);
      return [
        log && {
          html: getCommonReceiptHtml({
            linkType: "contract_address",
            type: "explorer",
            value: details.contract_address,
          }),
          title: "Contract instance",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            linkType: "code_id",
            type: "explorer",
            value: details.code_id,
          }),
          title: "From code ID",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.sender),
            type: "explorer",
            value: details.sender,
          }),
          title: "Instantiated by",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            fallback: "No admin",
            linkType: getAddressType(details.admin),
            type: "explorer",
            value: details.admin,
          }),
          title: "Contract admin",
          type: "standard",
        },
        {
          title: "Label",
          type: "standard",
          value: details.label,
        },
        attachFundsReceipt(details.funds),
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.msg,
          }),
          title: "Instantiate message",
          type: "standard",
        },
        {
          html: details.salt,
          title: "Salt",
          type: "standard",
        },
        {
          title: "Fix msg",
          type: "standard",
          value: String(details.fix_msg),
        },
      ];
    }
    case "/cosmwasm.wasm.v1.MsgMigrateContract": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.sender),
            type: "explorer",
            value: details.sender,
          }),
          title: "Sender",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            linkType: "contract_address",
            type: "explorer",
            value: details.contract,
          }),
          title: "Contract",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            linkType: "code_id",
            type: "explorer",
            value: details.code_id,
          }),
          title: "Code ID",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.msg,
          }),
          title: "Msg",
          type: "standard",
        },
      ];
    }
    // cosmwasm/wasm
    case "/cosmwasm.wasm.v1.MsgStoreCode": {
      const details = extractTxDetails(type, body, log);
      return [
        log && {
          html: getCommonReceiptHtml({
            linkType: "code_id",
            type: "explorer",
            value: details.code_id,
          }),
          title: "Stored code ID",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.sender),
            type: "explorer",
            value: details.sender,
          }),
          title: "Uploader",
          type: "standard",
        },
        details.instantiate_permission
          ? {
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
                    amptrackSection="tx_msg_receipts"
                    permissionAddresses={
                      details.instantiate_permission.address
                        ? [details.instantiate_permission.address]
                        : (details.instantiate_permission.addresses ?? [])
                    }
                  />
                </Flex>
              ),
              title: "Instantiate permission",
              type: "standard",
            }
          : undefined,
        {
          html: (
            <Flex align="flex-start" gap={3}>
              Size:{" "}
              {big(Buffer.from(details.wasm_byte_code).byteLength)
                .div(1024)
                .toFixed(1)}{" "}
              KB
              <CopyButton
                amptrackSection="tx_msg_receipts_wasm_byte_code"
                buttonText="Click to Copy"
                hasIcon={false}
                mt={-1}
                value={details.wasm_byte_code}
                variant="ghost-primary"
              />
            </Flex>
          ),
          title: "Wasm byte code",
          type: "standard",
        },
      ];
    }
    case "/cosmwasm.wasm.v1.MsgUpdateAdmin": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.sender),
            type: "explorer",
            value: details.sender,
          }),
          title: "Sender",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.new_admin),
            type: "explorer",
            value: details.new_admin,
          }),
          title: "New admin",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            linkType: "contract_address",
            type: "explorer",
            value: details.contract,
          }),
          title: "Contract",
          type: "standard",
        },
      ];
    }
    // ibc/applications
    case "/ibc.applications.transfer.v1.MsgTransfer": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Source port",
          type: "standard",
          value: details.source_port,
        },
        {
          title: "Source channel",
          type: "standard",
          value: details.source_channel,
        },
        {
          html: <CoinsComponent coins={[details.token]} />,
          title: "Token",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.sender),
            type: "explorer",
            value: details.sender,
          }),
          title: "Sender",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.receiver),
            type: "explorer",
            value: details.receiver,
          }),
          title: "Receiver",
          type: "standard",
        },
        details.timeout_height
          ? {
              html: getCommonReceiptHtml({
                type: "json",
                value: details.timeout_height,
              }),
              title: "Timeout height",
              type: "standard",
            }
          : undefined,
        details.timeout_timestamp
          ? {
              title: "Timeout timestamp",
              type: "standard",
              value: formatUTC(
                parseNanosecondsToDate(details.timeout_timestamp)
              ),
            }
          : undefined,
        {
          title: "Memo",
          type: "standard",
          value: details.memo,
        },
      ];
    }
    case "/ibc.core.channel.v1.MsgAcknowledgement": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.packet,
          }),
          title: "Packet",
          type: "standard",
        },
        {
          title: "Acknowledgement",
          type: "standard",
          value: details.acknowledgement,
        },
        {
          title: "Proof acked",
          type: "standard",
          value: details.proof_acked,
        },
        proofHeightReceipt(details.proof_height),
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.signer),
            type: "explorer",
            value: details.signer,
          }),
          title: "Signer",
          type: "standard",
        },
      ];
    }
    case "/ibc.core.channel.v1.MsgChannelCloseConfirm": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Port ID",
          type: "standard",
          value: details.port_id,
        },
        channelIdReceipt(details.channel_id),
        proofInitReceipt(details.proof_init),
        proofHeightReceipt(details.proof_height),
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.signer),
            type: "explorer",
            value: details.signer,
          }),
          title: "Signer",
          type: "standard",
        },
      ];
    }
    case "/ibc.core.channel.v1.MsgChannelCloseInit": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Port ID",
          type: "standard",
          value: details.port_id,
        },
        channelIdReceipt(details.channel_id),
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.signer),
            type: "explorer",
            value: details.signer,
          }),
          title: "Signer",
          type: "standard",
        },
      ];
    }
    case "/ibc.core.channel.v1.MsgChannelOpenAck": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Port ID",
          type: "standard",
          value: details.port_id,
        },
        channelIdReceipt(details.channel_id),
        {
          title: "Counterparty channel ID",
          type: "standard",
          value: details.counterparty_channel_id,
        },
        {
          title: "Counterparty version",
          type: "standard",
          value: details.counterparty_version,
        },
        {
          title: "Proof try",
          type: "standard",
          value: details.proof_try,
        },
        proofHeightReceipt(details.proof_height),
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.signer),
            type: "explorer",
            value: details.signer,
          }),
          title: "Signer",
          type: "standard",
        },
      ];
    }
    case "/ibc.core.channel.v1.MsgChannelOpenConfirm": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Port ID",
          type: "standard",
          value: details.port_id,
        },
        channelIdReceipt(details.channel_id),
        {
          title: "Proof ack",
          type: "standard",
          value: details.proof_ack,
        },
        proofHeightReceipt(details.proof_height),
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.signer),
            type: "explorer",
            value: details.signer,
          }),
          title: "Signer",
          type: "standard",
        },
      ];
    }
    case "/ibc.core.channel.v1.MsgChannelOpenInit": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Port ID",
          type: "standard",
          value: details.port_id,
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.channel,
          }),
          title: "Channel",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.signer),
            type: "explorer",
            value: details.signer,
          }),
          title: "Signer",
          type: "standard",
        },
      ];
    }
    case "/ibc.core.channel.v1.MsgChannelOpenTry": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Port ID",
          type: "standard",
          value: details.port_id,
        },
        {
          title: "Previous channel ID",
          type: "standard",
          value: details.previous_channel_id,
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.channel,
          }),
          title: "Channel",
          type: "standard",
        },
        {
          title: "Counterparty version",
          type: "standard",
          value: details.counterparty_version,
        },
        proofInitReceipt(details.proof_init),
        proofHeightReceipt(details.proof_height),
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.signer),
            type: "explorer",
            value: details.signer,
          }),
          title: "Signer",
          type: "standard",
        },
      ];
    }
    case "/ibc.core.channel.v1.MsgRecvPacket": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.packet,
          }),
          title: "Packet",
          type: "standard",
        },
        {
          title: "Proof commitment",
          type: "standard",
          value: details.proof_commitment,
        },
        proofHeightReceipt(details.proof_height),
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.signer),
            type: "explorer",
            value: details.signer,
          }),
          title: "Signer",
          type: "standard",
        },
      ];
    }
    case "/ibc.core.channel.v1.MsgTimeout": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.packet,
          }),
          title: "Packet",
          type: "standard",
        },
        {
          title: "Proof unreceived",
          type: "standard",
          value: details.proof_unreceived,
        },
        proofHeightReceipt(details.proof_height),
        {
          title: "Next sequence recv",
          type: "standard",
          value: details.next_sequence_recv,
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.signer),
            type: "explorer",
            value: details.signer,
          }),
          title: "Signer",
          type: "standard",
        },
      ];
    }
    case "/ibc.core.channel.v1.MsgTimeoutOnClose": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.packet,
          }),
          title: "Packet",
          type: "standard",
        },
        {
          title: "Proof unreceived",
          type: "standard",
          value: details.proof_unreceived,
        },
        {
          title: "Proof close",
          type: "standard",
          value: details.proof_close,
        },
        proofHeightReceipt(details.proof_height),
        {
          title: "Next sequence recv",
          type: "standard",
          value: details.next_sequence_recv,
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.signer),
            type: "explorer",
            value: details.signer,
          }),
          title: "Signer",
          type: "standard",
        },
      ];
    }
    // ibc/core
    case "/ibc.core.client.v1.MsgCreateClient": {
      const details = extractTxDetails(type, body, log);
      return [
        clientStateReceipt(details.client_state),
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.consensus_state,
          }),
          title: "Consensus state",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.signer),
            type: "explorer",
            value: details.signer,
          }),
          title: "Signer",
          type: "standard",
        },
      ];
    }
    case "/ibc.core.client.v1.MsgSubmitMisbehaviour": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Client ID",
          type: "standard",
          value: details.client_id,
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.misbehaviour,
          }),
          title: "Misbehaviour",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.signer),
            type: "explorer",
            value: details.signer,
          }),
          title: "Signer",
          type: "standard",
        },
      ];
    }
    case "/ibc.core.client.v1.MsgUpdateClient": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Client ID",
          type: "standard",
          value: details.client_id,
        },
        // newer version
        details.client_message && {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.client_message,
          }),
          title: "Client message",
          type: "standard",
        },
        // older version
        details.header && {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.header,
          }),
          title: "Header",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.signer),
            type: "explorer",
            value: details.signer,
          }),
          title: "Signer",
          type: "standard",
        },
      ];
    }
    case "/ibc.core.client.v1.MsgUpgradeClient": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Client ID",
          type: "standard",
          value: details.client_id,
        },
        clientStateReceipt(details.client_state),
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.consensus_state,
          }),
          title: "Consensus state",
          type: "standard",
        },
        {
          title: "Proof upgrade client",
          type: "standard",
          value: details.proof_upgrade_client,
        },
        {
          title: "Proof upgrade consensus state",
          type: "standard",
          value: details.proof_upgrade_consensus_state,
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.signer),
            type: "explorer",
            value: details.signer,
          }),
          title: "Signer",
          type: "standard",
        },
      ];
    }
    case "/ibc.core.connection.v1.MsgConnectionOpenAck": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Connection ID",
          type: "standard",
          value: details.connection_id,
        },
        {
          title: "Counterparty connection ID",
          type: "standard",
          value: details.counterparty_connection_id,
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.version,
          }),
          title: "Version",
          type: "standard",
        },
        clientStateReceipt(details.client_state),
        proofHeightReceipt(details.proof_height),
        {
          title: "Proof try",
          type: "standard",
          value: details.proof_try,
        },
        {
          title: "Proof client",
          type: "standard",
          value: details.proof_client,
        },
        {
          title: "Proof consensus",
          type: "standard",
          value: details.proof_consensus,
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.consensus_height,
          }),
          title: "Consensus height",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.signer),
            type: "explorer",
            value: details.signer,
          }),
          title: "Signer",
          type: "standard",
        },
      ];
    }
    case "/ibc.core.connection.v1.MsgConnectionOpenConfirm": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Connection ID",
          type: "standard",
          value: details.connection_id,
        },
        {
          title: "Proof ack",
          type: "standard",
          value: details.proof_ack,
        },
        proofHeightReceipt(details.proof_height),
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.signer),
            type: "explorer",
            value: details.signer,
          }),
          title: "Signer",
          type: "standard",
        },
      ];
    }
    case "/ibc.core.connection.v1.MsgConnectionOpenInit": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Client ID",
          type: "standard",
          value: details.client_id,
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.counterparty,
          }),
          title: "Counterparty",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.version,
          }),
          title: "Version",
          type: "standard",
        },
        {
          title: "Delay period",
          type: "standard",
          value: details.delay_period,
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.signer),
            type: "explorer",
            value: details.signer,
          }),
          title: "Signer",
          type: "standard",
        },
      ];
    }
    case "/ibc.core.connection.v1.MsgConnectionOpenTry": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Client ID",
          type: "standard",
          value: details.client_id,
        },
        {
          title: "Previous connection ID",
          type: "standard",
          value: details.previous_connection_id,
        },
        clientStateReceipt(details.client_state),
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.counterparty,
          }),
          title: "Counterparty",
          type: "standard",
        },
        {
          title: "Delay period",
          type: "standard",
          value: details.delay_period,
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.counterparty_versions,
          }),
          title: "Counterparty versions",
          type: "standard",
        },
        proofHeightReceipt(details.proof_height),
        proofInitReceipt(details.proof_init),
        {
          title: "Proof client",
          type: "standard",
          value: details.proof_client,
        },
        {
          title: "Proof consensus",
          type: "standard",
          value: details.proof_consensus,
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.consensus_height,
          }),
          title: "Consensus height",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.signer),
            type: "explorer",
            value: details.signer,
          }),
          title: "Signer",
          type: "standard",
        },
      ];
    }
    case "/initia.move.v1.MsgExecute":
    case "/initia.move.v1.MsgExecuteJSON": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: "contract_address",
            type: "explorer",
            value: details.module_address,
          }),
          title: "Module address",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            linkType: "module_name",
            textLabel: details.module_name,
            type: "explorer",
            value: `${details.module_address}/${details.module_name}`,
          }),
          title: "Module name",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            linkType: "function_name",
            queryParams: {
              address: details.module_address,
              functionName: details.function_name,
              moduleName: details.module_name,
            },
            textLabel: details.function_name,
            type: "explorer",
            value: undefined,
          }),
          title: "Function name",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.sender),
            type: "explorer",
            value: details.sender,
          }),
          title: "Sender",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.type_args,
          }),
          title: "Type args",
          type: "standard",
        },
        {
          isExecuteArgs: true,
          title: "Args",
          type: "executeArgs",
          value: details,
        },
      ];
    }
    // osmosis/gamm
    case "/osmosis.gamm.poolmodels.balancer.v1beta1.MsgCreateBalancerPool": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.sender),
            type: "explorer",
            value: details.sender,
          }),
          title: "Sender",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.pool_params,
          }),
          title: "Pool params",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.pool_assets,
          }),
          title: "Pool assets",
          type: "standard",
        },
        {
          title: "Future pool governor",
          type: "standard",
          value: details.future_pool_governor,
        },
      ];
    }
    case "/osmosis.gamm.poolmodels.stableswap.v1beta1.MsgCreateStableswapPool": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.sender),
            type: "explorer",
            value: details.sender,
          }),
          title: "Sender",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.pool_params,
          }),
          title: "Pool params",
          type: "standard",
        },
        {
          html: <CoinsComponent coins={details.initial_pool_liquidity} />,
          title: "Initial pool liquidity",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.scaling_factors,
          }),
          title: "Scaling factors",
          type: "standard",
        },
        {
          title: "Future pool governor",
          type: "standard",
          value: details.future_pool_governor,
        },
        {
          title: "Scaling factor controller",
          type: "standard",
          value: details.scaling_factor_controller,
        },
      ];
    }
    case "/osmosis.gamm.poolmodels.stableswap.v1beta1.MsgStableSwapAdjustScalingFactors": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.sender),
            type: "explorer",
            value: details.sender,
          }),
          title: "Sender",
          type: "standard",
        },
        {
          title: "Pool ID",
          type: "standard",
          value: details.pool_id,
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.scaling_factors,
          }),
          title: "Scaling factors",
          type: "standard",
        },
      ];
    }
    case "/osmosis.gamm.v1beta1.MsgExitPool": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.sender),
            type: "explorer",
            value: details.sender,
          }),
          title: "Sender",
          type: "standard",
        },
        {
          title: "Pool ID",
          type: "standard",
          value: details.pool_id,
        },
        {
          title: "Share in amount",
          type: "standard",
          value: details.share_in_amount,
        },
        {
          html: <CoinsComponent coins={details.token_out_mins ?? []} />,
          title: "Token out mins",
          type: "standard",
        },
      ];
    }
    case "/osmosis.gamm.v1beta1.MsgExitSwapExternAmountOut": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.sender),
            type: "explorer",
            value: details.sender,
          }),
          title: "Sender",
          type: "standard",
        },
        {
          title: "Pool ID",
          type: "standard",
          value: details.pool_id,
        },
        {
          html: <CoinsComponent coins={[details.token_out]} />,
          title: "Token out",
          type: "standard",
        },
        {
          title: "Share in max amount",
          type: "standard",
          value: details.share_in_max_amount,
        },
      ];
    }
    case "/osmosis.gamm.v1beta1.MsgExitSwapShareAmountIn": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.sender),
            type: "explorer",
            value: details.sender,
          }),
          title: "Sender",
          type: "standard",
        },
        {
          title: "Pool ID",
          type: "standard",
          value: details.pool_id,
        },
        {
          title: "Token out denom",
          type: "standard",
          value: details.token_out_denom,
        },
        {
          title: "Share in amount",
          type: "standard",
          value: details.share_in_amount,
        },
        {
          title: "Token out min amount",
          type: "standard",
          value: details.token_out_min_amount,
        },
      ];
    }
    case "/osmosis.gamm.v1beta1.MsgJoinPool": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.sender),
            type: "explorer",
            value: details.sender,
          }),
          title: "Sender",
          type: "standard",
        },
        {
          title: "Pool ID",
          type: "standard",
          value: details.pool_id,
        },
        {
          title: "Share out amount",
          type: "standard",
          value: details.share_out_amount,
        },
        {
          html: <CoinsComponent coins={details.token_in_maxs ?? []} />,
          title: "Token in maxs",
          type: "standard",
        },
      ];
    }
    case "/osmosis.gamm.v1beta1.MsgJoinSwapExternAmountIn": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.sender),
            type: "explorer",
            value: details.sender,
          }),
          title: "Sender",
          type: "standard",
        },
        {
          title: "Pool ID",
          type: "standard",
          value: details.pool_id,
        },
        {
          html: <CoinsComponent coins={[details.token_in]} />,
          title: "Token in",
          type: "standard",
        },
        {
          title: "Share out min amount",
          type: "standard",
          value: details.share_out_min_amount,
        },
      ];
    }
    case "/osmosis.gamm.v1beta1.MsgJoinSwapShareAmountOut": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.sender),
            type: "explorer",
            value: details.sender,
          }),
          title: "Sender",
          type: "standard",
        },
        {
          title: "Pool ID",
          type: "standard",
          value: details.pool_id,
        },
        {
          title: "Token in denom",
          type: "standard",
          value: details.token_in_denom,
        },
        {
          title: "Share out amount",
          type: "standard",
          value: details.share_out_amount,
        },
        {
          title: "Token in max amount",
          type: "standard",
          value: details.token_in_max_amount,
        },
      ];
    }
    case "/osmosis.gamm.v1beta1.MsgSwapExactAmountIn":
    case "/osmosis.poolmanager.v1beta1.MsgSwapExactAmountIn": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.sender),
            type: "explorer",
            value: details.sender,
          }),
          title: "Sender",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.routes,
          }),
          title: "Routes",
          type: "standard",
        },
        {
          html: <CoinsComponent coins={[details.token_in]} />,
          title: "Token in",
          type: "standard",
        },
        {
          title: "Token out min amount",
          type: "standard",
          value: details.token_out_min_amount,
        },
      ];
    }
    case "/osmosis.gamm.v1beta1.MsgSwapExactAmountOut":
    case "/osmosis.poolmanager.v1beta1.MsgSwapExactAmountOut": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.sender),
            type: "explorer",
            value: details.sender,
          }),
          title: "Sender",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.routes,
          }),
          title: "Routes",
          type: "standard",
        },
        {
          title: "Token in max amount",
          type: "standard",
          value: details.token_in_max_amount,
        },
        {
          html: <CoinsComponent coins={[details.token_out]} />,
          title: "Token out",
          type: "standard",
        },
      ];
    }
    case "/osmosis.incentives.MsgAddToGauge": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.owner),
            type: "explorer",
            value: details.owner,
          }),
          title: "Owner",
          type: "standard",
        },
        {
          title: "Gauge ID",
          type: "standard",
          value: details.gauge_id,
        },
        {
          html: <CoinsComponent coins={details.rewards} />,
          title: "Rewards",
          type: "standard",
        },
      ];
    }
    // osmosis/incentives
    case "/osmosis.incentives.MsgCreateGauge": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          title: "Is perpetual",
          type: "standard",
          value: String(details.is_perpetual),
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.owner),
            type: "explorer",
            value: details.owner,
          }),
          title: "Owner",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.distribute_to,
          }),
          title: "Distribute to",
          type: "standard",
        },
        {
          html: <CoinsComponent coins={details.coins} />,
          title: "Coins",
          type: "standard",
        },
        {
          title: "Start time",
          type: "standard",
          value: formatUTC(parseDate(details.start_time)),
        },
        {
          title: "Num epochs paid over",
          type: "standard",
          value: details.num_epochs_paid_over,
        },
      ];
    }
    case "/osmosis.lockup.MsgBeginUnlocking":
    case "/osmosis.lockup.MsgForceUnlock": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.owner),
            type: "explorer",
            value: details.owner,
          }),
          title: "Owner",
          type: "standard",
        },
        {
          title: "ID",
          type: "standard",
          value: details.ID,
        },
        details.coins && {
          html: <CoinsComponent coins={details.coins} />,
          title: "Coins",
          type: "standard",
        },
      ];
    }
    case "/osmosis.lockup.MsgBeginUnlockingAll": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.owner),
            type: "explorer",
            value: details.owner,
          }),
          title: "Owner",
          type: "standard",
        },
      ];
    }
    // ** No example
    case "/osmosis.lockup.MsgExtendLockup": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.owner),
            type: "explorer",
            value: details.owner,
          }),
          title: "Owner",
          type: "standard",
        },
        {
          title: "ID",
          type: "standard",
          value: details.ID,
        },
        {
          title: "Duration",
          type: "standard",
          value: details.duration,
        },
      ];
    }
    // osmosis/lockup
    case "/osmosis.lockup.MsgLockTokens": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.owner),
            type: "explorer",
            value: details.owner,
          }),
          title: "Owner",
          type: "standard",
        },
        {
          title: "Duration",
          type: "standard",
          value: details.duration,
        },
        {
          html: <CoinsComponent coins={details.coins} />,
          title: "Coin",
          type: "standard",
        },
      ];
    }
    case "/osmosis.protorev.v1beta1.MsgSetBaseDenoms": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.admin),
            type: "explorer",
            value: details.admin,
          }),
          title: "Admin",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.base_denoms,
          }),
          title: "Hot routes",
          type: "standard",
        },
      ];
    }
    case "/osmosis.protorev.v1beta1.MsgSetDeveloperAccount": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.admin),
            type: "explorer",
            value: details.admin,
          }),
          title: "Admin",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.developer_account),
            type: "explorer",
            value: details.developer_account,
          }),
          title: "Developer account",
          type: "standard",
        },
      ];
    }
    // osmosis/protorev
    case "/osmosis.protorev.v1beta1.MsgSetHotRoutes": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.admin),
            type: "explorer",
            value: details.admin,
          }),
          title: "Admin",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.hot_routes,
          }),
          title: "Hot routes",
          type: "standard",
        },
      ];
    }
    case "/osmosis.protorev.v1beta1.MsgSetMaxPoolPointsPerBlock": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.admin),
            type: "explorer",
            value: details.admin,
          }),
          title: "Admin",
          type: "standard",
        },
        {
          title: "Max pool points per block",
          type: "standard",
          value: details.max_pool_points_per_block,
        },
      ];
    }
    case "/osmosis.protorev.v1beta1.MsgSetMaxPoolPointsPerTx": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.admin),
            type: "explorer",
            value: details.admin,
          }),
          title: "Admin",
          type: "standard",
        },
        {
          title: "Max pool points per tx",
          type: "standard",
          value: details.max_pool_points_per_tx,
        },
      ];
    }
    case "/osmosis.protorev.v1beta1.MsgSetPoolWeights": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.admin),
            type: "explorer",
            value: details.admin,
          }),
          title: "Admin",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.pool_weights,
          }),
          title: "Pool weights",
          type: "standard",
        },
      ];
    }
    case "/osmosis.superfluid.MsgLockAndSuperfluidDelegate": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.sender),
            type: "explorer",
            value: details.sender,
          }),
          title: "Sender",
          type: "standard",
        },
        {
          html: <CoinsComponent coins={details.coins} />,
          title: "Coins",
          type: "standard",
        },
        validatorAddrReceipt(details.val_addr),
      ];
    }
    // osmosis/superfluid
    case "/osmosis.superfluid.MsgSuperfluidDelegate": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.sender),
            type: "explorer",
            value: details.sender,
          }),
          title: "Sender",
          type: "standard",
        },
        {
          title: "Lock ID",
          type: "standard",
          value: details.lock_id,
        },
        validatorAddrReceipt(details.val_addr),
      ];
    }
    case "/osmosis.superfluid.MsgSuperfluidUnbondLock":
    case "/osmosis.superfluid.MsgSuperfluidUndelegate": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.sender),
            type: "explorer",
            value: details.sender,
          }),
          title: "Sender",
          type: "standard",
        },
        {
          title: "Lock ID",
          type: "standard",
          value: details.lock_id,
        },
      ];
    }
    case "/osmosis.superfluid.MsgSuperfluidUndelegateAndUnbondLock": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.sender),
            type: "explorer",
            value: details.sender,
          }),
          title: "Sender",
          type: "standard",
        },
        {
          title: "Lock ID",
          type: "standard",
          value: details.lock_id,
        },
        {
          html: <CoinsComponent coins={[details.coin]} />,
          title: "Coin",
          type: "standard",
        },
      ];
    }
    case "/osmosis.superfluid.MsgUnPoolWhitelistedPool": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.sender),
            type: "explorer",
            value: details.sender,
          }),
          title: "Sender",
          type: "standard",
        },
        {
          title: "Pool ID",
          type: "standard",
          value: details.pool_id,
        },
      ];
    }
    case "/osmosis.tokenfactory.v1beta1.MsgBurn":
    case "/osmosis.tokenfactory.v1beta1.MsgMint": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.sender),
            type: "explorer",
            value: details.sender,
          }),
          title: "Sender",
          type: "standard",
        },
        {
          html: <CoinsComponent coins={[details.amount]} />,
          title: "Amount",
          type: "standard",
        },
      ];
    }
    case "/osmosis.tokenfactory.v1beta1.MsgChangeAdmin": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.sender),
            type: "explorer",
            value: details.sender,
          }),
          title: "Sender",
          type: "standard",
        },
        {
          title: "Denom",
          type: "standard",
          value: details.denom,
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.new_admin),
            type: "explorer",
            value: details.new_admin,
          }),
          title: "New admin",
          type: "standard",
        },
      ];
    }
    // osmosis/tokenfactory
    case "/osmosis.tokenfactory.v1beta1.MsgCreateDenom": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.sender),
            type: "explorer",
            value: details.sender,
          }),
          title: "Sender",
          type: "standard",
        },
        {
          title: "Subdenom",
          type: "standard",
          value: details.subdenom,
        },
      ];
    }
    // **No example
    case "/osmosis.tokenfactory.v1beta1.MsgSetDenomMetadata": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.sender),
            type: "explorer",
            value: details.sender,
          }),
          title: "Sender",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.metadata,
          }),
          title: "Metadata",
          type: "standard",
        },
      ];
    }
    case "/osmosis.valsetpref.v1beta1.MsgDelegateBondedTokens": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.delegator),
            type: "explorer",
            value: details.delegator,
          }),
          title: "Delegator",
          type: "standard",
        },
        {
          title: "Lock ID",
          type: "standard",
          value: details.lockID,
        },
      ];
    }
    // osmosis/valsetpref
    case "/osmosis.valsetpref.v1beta1.MsgDelegateToValidatorSet":
    case "/osmosis.valsetpref.v1beta1.MsgUndelegateFromValidatorSet": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.delegator),
            type: "explorer",
            value: details.delegator,
          }),
          title: "Delegator",
          type: "standard",
        },
        {
          html: <CoinsComponent coins={[details.coin]} />,
          title: "Coin",
          type: "standard",
        },
      ];
    }
    case "/osmosis.valsetpref.v1beta1.MsgRedelegateValidatorSet":
    case "/osmosis.valsetpref.v1beta1.MsgSetValidatorSetPreference": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.delegator),
            type: "explorer",
            value: details.delegator,
          }),
          title: "Delegator",
          type: "standard",
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.preferences,
          }),
          title: "Preferences",
          type: "standard",
        },
      ];
    }
    case "/osmosis.valsetpref.v1beta1.MsgWithdrawDelegationRewards": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.delegator),
            type: "explorer",
            value: details.delegator,
          }),
          title: "Delegator",
          type: "standard",
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
