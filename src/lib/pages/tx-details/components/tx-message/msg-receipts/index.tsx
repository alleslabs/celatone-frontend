/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/max-switch-cases */
/* eslint-disable complexity */
import { Flex } from "@chakra-ui/react";

import type { TxMsgData } from "..";
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

export const generateReceipts = (
  { log, msgBody }: Omit<TxMsgData, "assetInfos">,
  getAddressType: (address: string) => AddressReturnType
  // eslint-disable-next-line sonarjs/cognitive-complexity
): Option<false | null | TxReceipt>[] => {
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
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.msgs,
          }),
          title: "Msgs",
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
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.grantee),
            type: "explorer",
            value: details.grantee,
          }),
          title: "Grantee",
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.grant,
          }),
          title: "Grant",
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
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.grantee),
            type: "explorer",
            value: details.grantee,
          }),
          title: "Grantee",
        },
        {
          title: "Msg Type Url",
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
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.outputs,
          }),
          title: "Outputs",
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
          title: "From Address",
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.to_address),
            type: "explorer",
            value: details.to_address,
          }),
          title: "To Address",
        },
        {
          html: <CoinsComponent coins={details.amount} />,
          title: "Amount",
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
        },
        {
          title: "Invariant Module Name",
          value: details.invariant_module_name,
        },
        { title: "Invariant Route", value: details.invariant_route },
      ];
    }
    case "/cosmos.distribution.v1beta1.MsgFundCommunityPool": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: <CoinsComponent coins={details.amount} />,
          title: "Amount",
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.depositor),
            type: "explorer",
            value: details.depositor,
          }),
          title: "Depositor",
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
          title: "Withdraw Address",
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
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.evidence,
          }),
          title: "Evidence",
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
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.grantee),
            type: "explorer",
            value: details.grantee,
          }),
          title: "Grantee",
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.allowance,
          }),
          title: "Allowance",
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
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.grantee),
            type: "explorer",
            value: details.grantee,
          }),
          title: "Grantee",
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
        },
        {
          html: <CoinsComponent coins={details.amount} />,
          title: "Amount",
        },
      ];
    }
    // x/gov
    case "/cosmos.gov.v1beta1.MsgSubmitProposal": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: <CoinsComponent coins={details.initial_deposit} />,
          title: "Initial Deposit",
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.proposer),
            type: "explorer",
            value: details.proposer,
          }),
          title: "Proposer",
        },
        log && proposalIdReceipt(details.proposal_id),
        log && {
          title: "Proposal Type",
          value:
            details.proposal_type ?? extractMsgType(details.content["@type"]),
        },
        {
          title: "Is Expedited",
          value: String(details.is_expedited ?? false),
        },
        { title: "Title", value: details.content.title },
        {
          html: getCommonReceiptHtml({ type: "json", value: details.content }),
          title: "Content",
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
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.voter),
            type: "explorer",
            value: details.voter,
          }),
          title: "Voter",
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.options,
          }),
          title: "Options",
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
          title: "Source Validator Address",
        },
        {
          html: getCommonReceiptHtml({
            linkType: "validator_address",
            type: "explorer",
            value: details.validator_dst_address,
          }),
          title: "Destination Validator Address",
        },
        {
          html: <CoinsComponent coins={[details.amount]} />,
          title: "Amount",
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
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.commission,
          }),
          title: "Commission",
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
          html: getCommonReceiptHtml({
            type: "json",
            value: details.pubkey,
          }),
          title: "Public Key",
        },
        {
          html: <CoinsComponent coins={[details.value]} />,
          title: "Value",
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
        },
        {
          html: getCommonReceiptHtml({
            linkType: "contract_address",
            type: "explorer",
            value: details.contract,
          }),
          title: "Contract",
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
        },
        {
          html: getCommonReceiptHtml({
            linkType: "contract_address",
            type: "explorer",
            value: details.contract,
          }),
          title: "Contract",
        },
        attachFundsReceipt(details.funds),
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.msg,
          }),
          title: "Execute Message",
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
          title: "Contract Instance",
        },

        {
          html: getCommonReceiptHtml({
            linkType: "code_id",
            type: "explorer",
            value: details.code_id,
          }),
          title: "From Code ID",
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.sender),
            type: "explorer",
            value: details.sender,
          }),
          title: "Instantiated by",
        },
        {
          html: getCommonReceiptHtml({
            fallback: "No Admin",
            linkType: getAddressType(details.admin),
            type: "explorer",
            value: details.admin,
          }),
          title: "Contract Admin",
        },
        {
          title: "Label",
          value: details.label,
        },
        attachFundsReceipt(details.funds),
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.msg,
          }),
          title: "Instantiate Message",
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
          title: "Contract Instance",
        },
        {
          html: getCommonReceiptHtml({
            linkType: "code_id",
            type: "explorer",
            value: details.code_id,
          }),
          title: "From Code ID",
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.sender),
            type: "explorer",
            value: details.sender,
          }),
          title: "Instantiated by",
        },
        {
          html: getCommonReceiptHtml({
            fallback: "No Admin",
            linkType: getAddressType(details.admin),
            type: "explorer",
            value: details.admin,
          }),
          title: "Contract Admin",
        },
        {
          title: "Label",
          value: details.label,
        },
        attachFundsReceipt(details.funds),
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.msg,
          }),
          title: "Instantiate Message",
        },
        {
          html: details.salt,
          title: "Salt",
        },
        {
          title: "Fix Msg",
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
        },
        {
          html: getCommonReceiptHtml({
            linkType: "contract_address",
            type: "explorer",
            value: details.contract,
          }),
          title: "Contract",
        },
        {
          html: getCommonReceiptHtml({
            linkType: "code_id",
            type: "explorer",
            value: details.code_id,
          }),
          title: "Code ID",
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.msg,
          }),
          title: "Msg",
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
          title: "Stored Code ID",
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.sender),
            type: "explorer",
            value: details.sender,
          }),
          title: "Uploader",
        },
        details.instantiate_permission && {
          html: (
            <Flex gap={1} direction="column">
              <PermissionChip
                instantiatePermission={
                  details.instantiate_permission.permission
                }
                permissionAddresses={
                  details.instantiate_permission.address
                    ? [details.instantiate_permission.address]
                    : details.instantiate_permission.addresses ?? []
                }
              />
              <ViewPermissionAddresses
                amptrackSection="tx_msg_receipts"
                permissionAddresses={
                  details.instantiate_permission.address
                    ? [details.instantiate_permission.address]
                    : details.instantiate_permission.addresses ?? []
                }
              />
            </Flex>
          ),
          title: "Instantiate Permission",
        },
        {
          html: (
            <Flex align="flex-start" gap={3}>
              Size:{" "}
              {big(Buffer.from(details.wasm_byte_code).byteLength)
                .div(1024)
                .toFixed(1)}{" "}
              KB
              <CopyButton
                mt={-1}
                value={details.wasm_byte_code}
                variant="ghost-primary"
                amptrackSection="tx_msg_receipts_wasm_byte_code"
                buttonText="Click to Copy"
                hasIcon={false}
              />
            </Flex>
          ),
          title: "Wasm Byte Code",
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
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.new_admin),
            type: "explorer",
            value: details.new_admin,
          }),
          title: "New Admin",
        },
        {
          html: getCommonReceiptHtml({
            linkType: "contract_address",
            type: "explorer",
            value: details.contract,
          }),
          title: "Contract",
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
          html: <CoinsComponent coins={[details.token]} />,
          title: "Token",
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.sender),
            type: "explorer",
            value: details.sender,
          }),
          title: "Sender",
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.receiver),
            type: "explorer",
            value: details.receiver,
          }),
          title: "Receiver",
        },
        details.timeout_height && {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.timeout_height,
          }),
          title: "Timeout Height",
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
    case "/ibc.core.channel.v1.MsgAcknowledgement": {
      const details = extractTxDetails(type, body, log);
      return [
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.packet,
          }),
          title: "Packet",
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
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.signer),
            type: "explorer",
            value: details.signer,
          }),
          title: "Signer",
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
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.signer),
            type: "explorer",
            value: details.signer,
          }),
          title: "Signer",
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
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.signer),
            type: "explorer",
            value: details.signer,
          }),
          title: "Signer",
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
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.signer),
            type: "explorer",
            value: details.signer,
          }),
          title: "Signer",
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
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.signer),
            type: "explorer",
            value: details.signer,
          }),
          title: "Signer",
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
          html: getCommonReceiptHtml({
            type: "json",
            value: details.channel,
          }),
          title: "Channel",
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.signer),
            type: "explorer",
            value: details.signer,
          }),
          title: "Signer",
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
          html: getCommonReceiptHtml({
            type: "json",
            value: details.channel,
          }),
          title: "Channel",
        },
        {
          title: "Counterparty Version",
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
        },
        {
          title: "Proof Commitment",
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
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.signer),
            type: "explorer",
            value: details.signer,
          }),
          title: "Signer",
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
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.signer),
            type: "explorer",
            value: details.signer,
          }),
          title: "Signer",
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
          title: "Consensus State",
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.signer),
            type: "explorer",
            value: details.signer,
          }),
          title: "Signer",
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
          html: getCommonReceiptHtml({
            type: "json",
            value: details.misbehaviour,
          }),
          title: "Misbehaviour",
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.signer),
            type: "explorer",
            value: details.signer,
          }),
          title: "Signer",
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
          html: getCommonReceiptHtml({
            type: "json",
            value: details.client_message,
          }),
          title: "Client Message",
        },
        // older version
        details.header && {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.header,
          }),
          title: "Header",
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.signer),
            type: "explorer",
            value: details.signer,
          }),
          title: "Signer",
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
          html: getCommonReceiptHtml({
            type: "json",
            value: details.consensus_state,
          }),
          title: "Consensus State",
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
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.signer),
            type: "explorer",
            value: details.signer,
          }),
          title: "Signer",
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
          html: getCommonReceiptHtml({
            type: "json",
            value: details.version,
          }),
          title: "Version",
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
          html: getCommonReceiptHtml({
            type: "json",
            value: details.consensus_height,
          }),
          title: "Consensus Height",
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.signer),
            type: "explorer",
            value: details.signer,
          }),
          title: "Signer",
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
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.signer),
            type: "explorer",
            value: details.signer,
          }),
          title: "Signer",
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
          html: getCommonReceiptHtml({
            type: "json",
            value: details.counterparty,
          }),
          title: "Counterparty",
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.version,
          }),
          title: "Version",
        },
        {
          title: "Delay Period",
          value: details.delay_period,
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.signer),
            type: "explorer",
            value: details.signer,
          }),
          title: "Signer",
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
          html: getCommonReceiptHtml({
            type: "json",
            value: details.counterparty,
          }),
          title: "Counterparty",
        },
        {
          title: "Delay Period",
          value: details.delay_period,
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.counterparty_versions,
          }),
          title: "Counterparty Versions",
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
          html: getCommonReceiptHtml({
            type: "json",
            value: details.consensus_height,
          }),
          title: "Consensus Height",
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.signer),
            type: "explorer",
            value: details.signer,
          }),
          title: "Signer",
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
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.pool_params,
          }),
          title: "Pool Params",
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.pool_assets,
          }),
          title: "Pool Assets",
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
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.sender),
            type: "explorer",
            value: details.sender,
          }),
          title: "Sender",
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.pool_params,
          }),
          title: "Pool Params",
        },
        {
          html: <CoinsComponent coins={details.initial_pool_liquidity} />,
          title: "Initial Pool Liquidity",
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.scaling_factors,
          }),
          title: "Scaling Factors",
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
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.sender),
            type: "explorer",
            value: details.sender,
          }),
          title: "Sender",
        },
        {
          title: "Pool ID",
          value: details.pool_id,
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.scaling_factors,
          }),
          title: "Scaling Factors",
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
          html: <CoinsComponent coins={details.token_out_mins ?? []} />,
          title: "Token Out Mins",
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
        },
        {
          title: "Pool ID",
          value: details.pool_id,
        },
        {
          html: <CoinsComponent coins={[details.token_out]} />,
          title: "Token Out",
        },
        {
          title: "Share In Max Amount",
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
          html: <CoinsComponent coins={details.token_in_maxs ?? []} />,
          title: "Token In Maxs",
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
        },
        {
          title: "Pool ID",
          value: details.pool_id,
        },
        {
          html: <CoinsComponent coins={[details.token_in]} />,
          title: "Token In",
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
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.sender),
            type: "explorer",
            value: details.sender,
          }),
          title: "Sender",
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
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.routes,
          }),
          title: "Routes",
        },
        {
          html: <CoinsComponent coins={[details.token_in]} />,
          title: "Token In",
        },
        {
          title: "Token Out Min Amount",
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
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.routes,
          }),
          title: "Routes",
        },
        {
          title: "Token In Max Amount",
          value: details.token_in_max_amount,
        },
        {
          html: <CoinsComponent coins={[details.token_out]} />,
          title: "Token Out",
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
        },
        {
          title: "Gauge ID",
          value: details.gauge_id,
        },
        {
          html: <CoinsComponent coins={details.rewards} />,
          title: "Rewards",
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
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.owner),
            type: "explorer",
            value: details.owner,
          }),
          title: "Owner",
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.distribute_to,
          }),
          title: "Distribute To",
        },
        {
          html: <CoinsComponent coins={details.coins} />,
          title: "Coins",
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
        },
        {
          title: "ID",
          value: details.ID,
        },
        details.coins && {
          html: <CoinsComponent coins={details.coins} />,
          title: "Coins",
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
        },
        {
          title: "Duration",
          value: details.duration,
        },
        {
          html: <CoinsComponent coins={details.coins} />,
          title: "Coin",
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
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.base_denoms,
          }),
          title: "Hot Routes",
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
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.developer_account),
            type: "explorer",
            value: details.developer_account,
          }),
          title: "Developer Account",
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
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.hot_routes,
          }),
          title: "Hot Routes",
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
        },
        {
          title: "Max Pool Points Per Block",
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
        },
        {
          title: "Max Pool Points Per Tx",
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
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.pool_weights,
          }),
          title: "Pool Weights",
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
        },
        {
          html: <CoinsComponent coins={details.coins} />,
          title: "Coins",
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
        },
        {
          title: "Lock ID",
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
        },
        {
          title: "Lock ID",
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
        },
        {
          title: "Lock ID",
          value: details.lock_id,
        },
        {
          html: <CoinsComponent coins={[details.coin]} />,
          title: "Coin",
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
        },
        {
          title: "Pool ID",
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
        },
        {
          html: <CoinsComponent coins={[details.amount]} />,
          title: "Amount",
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
        },
        {
          title: "Denom",
          value: details.denom,
        },
        {
          html: getCommonReceiptHtml({
            linkType: getAddressType(details.new_admin),
            type: "explorer",
            value: details.new_admin,
          }),
          title: "New Admin",
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
        },
        {
          title: "Subdenom",
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
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.metadata,
          }),
          title: "Metadata",
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
        },
        {
          title: "Lock ID",
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
        },
        {
          html: <CoinsComponent coins={[details.coin]} />,
          title: "Coin",
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
        },
        {
          html: getCommonReceiptHtml({
            type: "json",
            value: details.preferences,
          }),
          title: "Preferences",
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
