import type { Log } from "@cosmjs/stargate/build/logs";
import type { DecodedEthereumTx } from "@initia/tx-decoder";
import type { Option } from "lib/types";

import { lazy } from "react";

// Lazy load all decode message components for better code splitting
const DecodeEvmMessageContractCreationHeader = lazy(() =>
  import("./decode-evm-message-contract-creation").then((m) => ({
    default: m.DecodeEvmMessageContractCreationHeader,
  }))
);

const DecodeEvmMessageContractCreationBody = lazy(() =>
  import("./decode-evm-message-contract-creation").then((m) => ({
    default: m.DecodeEvmMessageContractCreationBody,
  }))
);

const DecodeEvmMessageErc20ApproveHeader = lazy(() =>
  import("./decode-evm-message-erc20-approve").then((m) => ({
    default: m.DecodeEvmMessageErc20ApproveHeader,
  }))
);

const DecodeEvmMessageErc20ApproveBody = lazy(() =>
  import("./decode-evm-message-erc20-approve").then((m) => ({
    default: m.DecodeEvmMessageErc20ApproveBody,
  }))
);

const DecodeEvmMessageErc20TransferHeader = lazy(() =>
  import("./decode-evm-message-erc20-transfer").then((m) => ({
    default: m.DecodeEvmMessageErc20TransferHeader,
  }))
);

const DecodeEvmMessageErc20TransferBody = lazy(() =>
  import("./decode-evm-message-erc20-transfer").then((m) => ({
    default: m.DecodeEvmMessageErc20TransferBody,
  }))
);

const DecodeEvmMessageErc20TransferFromHeader = lazy(() =>
  import("./decode-evm-message-erc20-transfer-from").then((m) => ({
    default: m.DecodeEvmMessageErc20TransferFromHeader,
  }))
);

const DecodeEvmMessageErc20TransferFromBody = lazy(() =>
  import("./decode-evm-message-erc20-transfer-from").then((m) => ({
    default: m.DecodeEvmMessageErc20TransferFromBody,
  }))
);

const DecodeEvmMessageErc721ApproveHeader = lazy(() =>
  import("./decode-evm-message-erc721-approve").then((m) => ({
    default: m.DecodeEvmMessageErc721ApproveHeader,
  }))
);

const DecodeEvmMessageErc721ApproveBody = lazy(() =>
  import("./decode-evm-message-erc721-approve").then((m) => ({
    default: m.DecodeEvmMessageErc721ApproveBody,
  }))
);

const DecodeEvmMessageErc721SafeTransferFromHeader = lazy(() =>
  import("./decode-evm-message-erc721-safe-transfer-from").then((m) => ({
    default: m.DecodeEvmMessageErc721SafeTransferFromHeader,
  }))
);

const DecodeEvmMessageErc721SafeTransferFromBody = lazy(() =>
  import("./decode-evm-message-erc721-safe-transfer-from").then((m) => ({
    default: m.DecodeEvmMessageErc721SafeTransferFromBody,
  }))
);

const DecodeEvmMessageErc721TransferFromHeader = lazy(() =>
  import("./decode-evm-message-erc721-transfer-from").then((m) => ({
    default: m.DecodeEvmMessageErc721TransferFromHeader,
  }))
);

const DecodeEvmMessageErc721TransferFromBody = lazy(() =>
  import("./decode-evm-message-erc721-transfer-from").then((m) => ({
    default: m.DecodeEvmMessageErc721TransferFromBody,
  }))
);

const DecodeEvmMessageEthTransferHeader = lazy(() =>
  import("./decode-evm-message-eth-transfer").then((m) => ({
    default: m.DecodeEvmMessageEthTransferHeader,
  }))
);

const DecodeEvmMessageEthTransferBody = lazy(() =>
  import("./decode-evm-message-eth-transfer").then((m) => ({
    default: m.DecodeEvmMessageEthTransferBody,
  }))
);

const DecodeEvmMessageNotSupportedHeader = lazy(() =>
  import("./decode-evm-message-not-supported").then((m) => ({
    default: m.DecodeEvmMessageNotSupportedHeader,
  }))
);

const DecodeEvmMessageNotSupportedBody = lazy(() =>
  import("./decode-evm-message-not-supported").then((m) => ({
    default: m.DecodeEvmMessageNotSupportedBody,
  }))
);

const DecodeEvmMessageCosmosMirrorHeader = lazy(() =>
  import("./decode-evm-message-cosmos-mirror").then((m) => ({
    default: m.DecodeEvmMessageCosmosMirrorHeader,
  }))
);

const DecodeEvmMessageCosmosMirrorBody = lazy(() =>
  import("./decode-evm-message-cosmos-mirror").then((m) => ({
    default: m.DecodeEvmMessageCosmosMirrorBody,
  }))
);

const DecodeEvmMessageKami721PublicMintHeader = lazy(() =>
  import("./decode-evm-message-kami721-public-mint").then((m) => ({
    default: m.DecodeEvmMessageKami721PublicMintHeader,
  }))
);

const DecodeEvmMessageKami721PublicMintBody = lazy(() =>
  import("./decode-evm-message-kami721-public-mint").then((m) => ({
    default: m.DecodeEvmMessageKami721PublicMintBody,
  }))
);

interface DecodeCosmosEvmMessageProps {
  compact: boolean;
  evmDecodedMessage: DecodedEthereumTx;
  log: Option<Log>;
  msgCount: number;
}

export const DecodeCosmosEvmMessageHeader = ({
  evmDecodedMessage,
  ...props
}: DecodeCosmosEvmMessageProps) => {
  const { decodedTransaction } = evmDecodedMessage;

  if (decodedTransaction.action === "contract_creation") {
    return (
      <DecodeEvmMessageContractCreationHeader
        decodedTransaction={decodedTransaction}
        {...props}
      />
    );
  }

  if (decodedTransaction.action === "erc20_approve") {
    return (
      <DecodeEvmMessageErc20ApproveHeader
        decodedTransaction={decodedTransaction}
        {...props}
      />
    );
  }

  if (decodedTransaction.action === "erc20_transfer") {
    return (
      <DecodeEvmMessageErc20TransferHeader
        decodedTransaction={decodedTransaction}
        {...props}
      />
    );
  }

  if (decodedTransaction.action === "erc20_transfer_from") {
    return (
      <DecodeEvmMessageErc20TransferFromHeader
        decodedTransaction={decodedTransaction}
        {...props}
      />
    );
  }

  if (decodedTransaction.action === "erc721_approve") {
    return (
      <DecodeEvmMessageErc721ApproveHeader
        decodedTransaction={decodedTransaction}
        {...props}
      />
    );
  }

  if (decodedTransaction.action === "erc721_safe_transfer_from") {
    return (
      <DecodeEvmMessageErc721SafeTransferFromHeader
        decodedTransaction={decodedTransaction}
        {...props}
      />
    );
  }

  if (decodedTransaction.action === "erc721_transfer_from") {
    return (
      <DecodeEvmMessageErc721TransferFromHeader
        decodedTransaction={decodedTransaction}
        {...props}
      />
    );
  }

  if (decodedTransaction.action === "eth_transfer") {
    return (
      <DecodeEvmMessageEthTransferHeader
        decodedTransaction={decodedTransaction}
        {...props}
      />
    );
  }

  if (decodedTransaction.action === "not_supported") {
    return (
      <DecodeEvmMessageNotSupportedHeader
        decodedTransaction={decodedTransaction}
        {...props}
      />
    );
  }

  if (decodedTransaction.action === "cosmos_mirror") {
    return (
      <DecodeEvmMessageCosmosMirrorHeader
        decodedTransaction={decodedTransaction}
        {...props}
      />
    );
  }

  if (decodedTransaction.action === "kami721_public_mint") {
    return (
      <DecodeEvmMessageKami721PublicMintHeader
        decodedTransaction={decodedTransaction}
        {...props}
      />
    );
  }

  return null;
};

export const DecodeCosmosEvmMessageBody = ({
  evmDecodedMessage,
  ...props
}: DecodeCosmosEvmMessageProps) => {
  const { decodedTransaction } = evmDecodedMessage;

  if (decodedTransaction.action === "contract_creation") {
    return (
      <DecodeEvmMessageContractCreationBody
        decodedTransaction={decodedTransaction}
        {...props}
      />
    );
  }

  if (decodedTransaction.action === "erc20_approve") {
    return (
      <DecodeEvmMessageErc20ApproveBody
        decodedTransaction={decodedTransaction}
        {...props}
      />
    );
  }

  if (decodedTransaction.action === "erc20_transfer") {
    return (
      <DecodeEvmMessageErc20TransferBody
        decodedTransaction={decodedTransaction}
        {...props}
      />
    );
  }

  if (decodedTransaction.action === "erc20_transfer_from") {
    return (
      <DecodeEvmMessageErc20TransferFromBody
        decodedTransaction={decodedTransaction}
        {...props}
      />
    );
  }

  if (decodedTransaction.action === "erc721_approve") {
    return (
      <DecodeEvmMessageErc721ApproveBody
        decodedTransaction={decodedTransaction}
        {...props}
      />
    );
  }

  if (decodedTransaction.action === "erc721_safe_transfer_from") {
    return (
      <DecodeEvmMessageErc721SafeTransferFromBody
        decodedTransaction={decodedTransaction}
        {...props}
      />
    );
  }

  if (decodedTransaction.action === "erc721_transfer_from") {
    return (
      <DecodeEvmMessageErc721TransferFromBody
        decodedTransaction={decodedTransaction}
        {...props}
      />
    );
  }

  if (decodedTransaction.action === "eth_transfer") {
    return (
      <DecodeEvmMessageEthTransferBody
        decodedTransaction={decodedTransaction}
        {...props}
      />
    );
  }

  if (decodedTransaction.action === "not_supported") {
    return (
      <DecodeEvmMessageNotSupportedBody
        decodedTransaction={decodedTransaction}
        {...props}
      />
    );
  }

  if (decodedTransaction.action === "cosmos_mirror") {
    return (
      <DecodeEvmMessageCosmosMirrorBody
        decodedTransaction={decodedTransaction}
        {...props}
      />
    );
  }

  if (decodedTransaction.action === "kami721_public_mint") {
    return (
      <DecodeEvmMessageKami721PublicMintBody
        decodedTransaction={decodedTransaction}
        {...props}
      />
    );
  }

  return null;
};
