import type { EvmInternalTxSequencer } from "lib/services/types";
import type { ReactNode } from "react";

import { Accordion, Flex, Spinner } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { useAssetInfos } from "lib/services/assetService";
import { useEvmParams } from "lib/services/evm";
import { useEvmVerifyInfos } from "lib/services/verification/evm";
import { isHex20Bytes } from "lib/utils/validate";
import { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";

// Calculate nesting levels for internal transactions
const calculateNestingLevels = (
  transactions: EvmInternalTxSequencer[]
): Map<number, number> => {
  const levels = new Map<number, number>();

  transactions.forEach((tx) => {
    if (tx.parentIndex === -1) {
      // Root transaction
      levels.set(tx.index, 1);
    } else {
      // Child transaction - get parent's level and add 1
      const parentLevel = levels.get(tx.parentIndex) ?? 1;
      levels.set(tx.index, parentLevel + 1);
    }
  });

  return levels;
};

import { MobileTableContainer, TableContainer } from "../tableComponents";
import { EvmInternalTransactionMobileCard } from "./EvmInternalTransactionMobileCard";
import { EvmInternalTransactionsTableHeader } from "./EvmInternalTransactionsTableHeader";
import { EvmInternalTransactionTableRow } from "./EvmInternalTransactionsTableRow";

interface EvmInternalTransactionsTableProps {
  disableInfiniteLoad?: boolean;
  emptyState: ReactNode;
  fetchNextPage: () => void;
  internalTxs: EvmInternalTxSequencer[];
  isFetchingNextPage: boolean;
  isLoading: boolean;
  showParentHash?: boolean;
  totalCount: number;
}

export const EvmInternalTransactionsTable = ({
  disableInfiniteLoad,
  emptyState,
  fetchNextPage,
  internalTxs,
  isFetchingNextPage,
  isLoading,
  showParentHash = true,
  totalCount,
}: EvmInternalTransactionsTableProps) => {
  const isMobile = useMobile();
  const { data: evmParams, isLoading: isEvmParamsLoading } = useEvmParams();
  const { data: assetInfos } = useAssetInfos({ withPrices: true });

  // Collect and filter valid addresses from both 'from' and 'to' fields
  const validAddresses = useMemo(() => {
    const addresses = internalTxs.flatMap((tx) => [tx.from, tx.to]);
    return Array.from(new Set(addresses.filter(isHex20Bytes)));
  }, [internalTxs]);

  const { data: evmVerifyInfos } = useEvmVerifyInfos(validAddresses);

  // Calculate nesting levels for all transactions
  const nestingLevels = useMemo(
    () => calculateNestingLevels(internalTxs),
    [internalTxs]
  );

  const { inView, ref } = useInView({ threshold: 0 });

  useEffect(() => {
    if (
      inView &&
      !disableInfiniteLoad &&
      !isFetchingNextPage &&
      internalTxs.length < totalCount
    ) {
      fetchNextPage();
    }
  }, [
    inView,
    disableInfiniteLoad,
    fetchNextPage,
    isFetchingNextPage,
    internalTxs.length,
    totalCount,
  ]);

  const templateColumns = [
    ...(showParentHash ? ["180px"] : []),
    "200px",
    "40px",
    "200px",
    "minmax(200px, 1fr)",
    "120px",
    "100px",
    "60px",
  ].join(" ");

  if (isLoading || isEvmParamsLoading) return <Loading />;
  if (!internalTxs?.length) return emptyState;

  return isMobile ? (
    <MobileTableContainer>
      {internalTxs.map((result, index) => (
        <EvmInternalTransactionMobileCard
          key={`${result.hash ?? "nested"}-${index}`}
          assetInfos={assetInfos}
          evmDenom={evmParams?.params.feeDenom}
          evmVerifyInfos={evmVerifyInfos}
          result={result}
          txHash={result.hash}
        />
      ))}
      {internalTxs.length < totalCount && (
        <Flex align="center" justify="center" mt={4} ref={ref}>
          {isFetchingNextPage ? <Spinner /> : null}
        </Flex>
      )}
    </MobileTableContainer>
  ) : (
    <TableContainer>
      <EvmInternalTransactionsTableHeader
        showParentHash={showParentHash}
        templateColumns={templateColumns}
      />

      <Accordion allowToggle variant="transparent">
        {internalTxs.map((result, index) => (
          <EvmInternalTransactionTableRow
            key={`${result.hash ?? "nested"}-${index}`}
            assetInfos={assetInfos}
            evmDenom={evmParams?.params.feeDenom}
            evmVerifyInfos={evmVerifyInfos}
            nestingLevel={nestingLevels.get(result.index) ?? 1}
            result={result}
            showParentHash={showParentHash}
            templateColumns={templateColumns}
            txHash={result.hash}
          />
        ))}
      </Accordion>

      {internalTxs.length < totalCount && (
        <Flex align="center" justify="center" mt={4} ref={ref}>
          {isFetchingNextPage ? <Spinner /> : null}
        </Flex>
      )}
    </TableContainer>
  );
};
