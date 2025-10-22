import type { HexAddr20 } from "lib/types";

import { Flex, Heading } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { DecodeCosmosEvmMessageHeader } from "lib/components/decode-message/evm-message";
import { EvmToCell } from "lib/components/evm-to-cell";
import { EvmMethodChip } from "lib/components/EvmMethodChip";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import { useEvmTxDataJsonRpc } from "lib/services/tx";
import { useEvmVerifyInfos } from "lib/services/verification/evm";
import { formatEvmTxHash, getEvmToAddress } from "lib/utils";

import { EvmRelatedField } from "./EvmRelatedField";

interface EvmRelatedTxSectionProps {
  evmTxHash: string;
}

const EvmRelatedTxSectionBody = ({
  evmTxData,
  evmTxHash,
}: EvmRelatedTxSectionProps & {
  evmTxData: NonNullable<ReturnType<typeof useEvmTxDataJsonRpc>["data"]>;
}) => {
  const isMobile = useMobile();
  const { data: evmVerifyInfos } = useEvmVerifyInfos(
    evmTxData.tx.to
      ? [evmTxData.tx.to].filter((addr): addr is HexAddr20 => addr !== null)
      : []
  );

  const toAddress = getEvmToAddress(evmTxData);
  return (
    <>
      <EvmRelatedField label={isMobile ? "Tx hash" : "Transaction hash"}>
        <ExplorerLink
          showCopyOnHover
          type="evm_tx_hash"
          value={formatEvmTxHash(evmTxHash)}
        />
      </EvmRelatedField>
      <EvmRelatedField label="Method">
        {evmTxData.decodedTx ? (
          <DecodeCosmosEvmMessageHeader
            compact
            evmDecodedMessage={evmTxData.decodedTx}
            evmVerifyInfos={evmVerifyInfos}
            log={undefined}
            msgCount={1}
          />
        ) : (
          <EvmMethodChip
            txInput={evmTxData.tx.input}
            txTo={evmTxData.tx.to}
            width={36}
          />
        )}
      </EvmRelatedField>
      <EvmRelatedField label="Sender">
        <ExplorerLink
          showCopyOnHover
          type="user_address"
          value={evmTxData.tx.from}
        />
      </EvmRelatedField>
      <CustomIcon
        boxSize={5}
        color="gray.600"
        display={{ base: "none", xl: "block" }}
        flex={0.3}
        mt={5}
        name="arrow-right"
      />
      <EvmRelatedField label="To">
        <EvmToCell toAddress={toAddress} />
      </EvmRelatedField>
    </>
  );
};

export const EvmRelatedTxSection = ({
  evmTxHash,
}: EvmRelatedTxSectionProps) => {
  const { data, isLoading } = useEvmTxDataJsonRpc(evmTxHash);

  if (isLoading) return <Loading my={0} py={0} />;
  if (!data)
    return (
      <EmptyState
        message="Error fetching data from JSON RPC. Please try again later."
        my={3}
        py={1}
      />
    );

  // Don't show related EVM tx section if it's a cosmos_mirror transaction
  if (data.decodedTx?.decodedTransaction.action === "cosmos_mirror") {
    return null;
  }

  return (
    <Flex direction="column" gap={4} mb={8} minW="330px">
      <Heading as="h6" variant="h6">
        Related EVM transaction
      </Heading>
      <Flex
        border="1px solid var(--chakra-colors-gray-700)"
        borderRadius="8px"
        direction={{ base: "column", xl: "row" }}
        gap={4}
        p={4}
        sx={{ "& > div:last-child": { flex: 2, maxW: "unset" } }}
      >
        <EvmRelatedTxSectionBody evmTxData={data} evmTxHash={evmTxHash} />
      </Flex>
    </Flex>
  );
};
