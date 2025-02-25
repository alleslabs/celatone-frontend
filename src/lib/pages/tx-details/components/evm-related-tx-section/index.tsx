import { Flex, Heading } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { EvmToCell } from "lib/components/evm-to-cell";
import { EvmMethodChip } from "lib/components/EvmMethodChip";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import { useEvmTxDataJsonRpc } from "lib/services/tx";
import { formatEvmTxHash, getEvmToAddress } from "lib/utils";

import { EvmRelatedField } from "./EvmRelatedField";

interface EvmRelatedTxSectionProps {
  evmTxHash: string;
}

const EvmRelatedTxSectionBody = ({ evmTxHash }: EvmRelatedTxSectionProps) => {
  const isMobile = useMobile();
  const { data, isLoading } = useEvmTxDataJsonRpc(evmTxHash);

  if (isLoading) return <Loading my={0} py={0} />;
  if (!data)
    return (
      <EmptyState
        message="Error fetching data from Json RPC. Please try again later."
        my={3}
        py={1}
      />
    );

  const toAddress = getEvmToAddress(data);
  return (
    <>
      <EvmRelatedField label={isMobile ? "Tx Hash" : "Transaction Hash"}>
        <ExplorerLink
          type="evm_tx_hash"
          value={formatEvmTxHash(evmTxHash)}
          showCopyOnHover
        />
      </EvmRelatedField>
      <EvmRelatedField label="Method">
        <EvmMethodChip txInput={data.tx.input} txTo={data.tx.to} width={36} />
      </EvmRelatedField>
      <EvmRelatedField label="Sender">
        <ExplorerLink
          type="user_address"
          value={data.tx.from}
          showCopyOnHover
        />
      </EvmRelatedField>
      <CustomIcon
        name="arrow-right"
        boxSize={5}
        color="gray.600"
        display={{ base: "none", xl: "block" }}
        flex={0.3}
        mt={5}
      />
      <EvmRelatedField label="To">
        <EvmToCell toAddress={toAddress} />
      </EvmRelatedField>
    </>
  );
};

export const EvmRelatedTxSection = ({
  evmTxHash,
}: EvmRelatedTxSectionProps) => (
  <Flex direction="column" gap={4} mb={8} minW="330px">
    <Heading as="h6" variant="h6">
      Related EVM Transaction
    </Heading>
    <Flex
      direction={{ base: "column", xl: "row" }}
      gap={4}
      border="1px solid var(--chakra-colors-gray-700)"
      borderRadius="8px"
      p={4}
      sx={{ "& > div:last-child": { flex: 2, maxW: "unset" } }}
    >
      <EvmRelatedTxSectionBody evmTxHash={evmTxHash} />
    </Flex>
  </Flex>
);
