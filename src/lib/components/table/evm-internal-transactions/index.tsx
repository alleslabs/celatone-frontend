import type { EvmCallFrame, EvmDebugTraceResponse } from "lib/services/types";
import type { HexAddr20 } from "lib/types";

import { Accordion, Flex, Spinner } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { useAssetInfos } from "lib/services/assetService";
import { useEvmParams } from "lib/services/evm";
import { useEvmVerifyInfos } from "lib/services/verification/evm";
import { zHexAddr20 } from "lib/types";
import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";

import { TableContainer } from "../tableComponents";
import { EvmInternalTransactionsTableHeader } from "./EvmInternalTransactionsTableHeader";
import { EvmInternalTransactionTableRow } from "./EvmInternalTransactionsTableRow";

interface EvmInternalTransactionsTableProps {
  internalTxs: EvmDebugTraceResponse;
  showParentHash?: boolean;
}

const flattenCalls = (
  calls: EvmCallFrame[],
  depth: number,
  txHash: string
): { depth: number; result: EvmCallFrame; txHash: string }[] =>
  calls.flatMap((call) => [
    { depth, result: call, txHash },
    ...(call.calls ? flattenCalls(call.calls, depth + 1, txHash) : []),
  ]);

const flattenTransactions = (data: EvmDebugTraceResponse) =>
  data.flatMap(({ result, txHash }) => [
    { depth: 0, result, txHash },
    ...(result.calls ? flattenCalls(result.calls, 1, txHash) : []),
  ]);

export const EvmInternalTransactionsTable = ({
  internalTxs,
  showParentHash = true,
}: EvmInternalTransactionsTableProps) => {
  const isMobile = useMobile();
  const { data: evmParams, isLoading: isEvmParamsLoading } = useEvmParams();
  const { data: assetInfos } = useAssetInfos({ withPrices: true });

  const flatInternalTxs = useMemo(
    () => flattenTransactions(internalTxs),
    [internalTxs]
  );

  const verifiedTxHashes = useMemo(() => {
    return flatInternalTxs.reduce((acc, { result }) => {
      const parsedContractFrom = zHexAddr20.safeParse(result.from);
      if (parsedContractFrom.success) {
        acc.add(parsedContractFrom.data);
      }
      const parsedContractTo = zHexAddr20.safeParse(result.to);
      if (parsedContractTo.success) {
        acc.add(parsedContractTo.data);
      }
      return acc;
    }, new Set<HexAddr20>());
  }, [flatInternalTxs]);

  const { data: evmVerifyInfos, isLoading: isEvmVerifyInfosLoading } =
    useEvmVerifyInfos(Array.from(verifiedTxHashes));

  const [visibleCount, setVisibleCount] = useState(10);
  const { inView, ref } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && visibleCount < flatInternalTxs.length) {
      setVisibleCount((prev) => Math.min(prev + 10, flatInternalTxs.length));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  const templateColumns = [
    showParentHash ? "180px" : "",
    "200px",
    "40px",
    "200px",
    "minmax(200px, 1fr)",
    "120px",
    "100px",
    "60px",
  ].join(" ");

  if (isEvmParamsLoading || isEvmVerifyInfosLoading) return <Loading />;

  return isMobile ? null : (
    <TableContainer>
      <EvmInternalTransactionsTableHeader
        showParentHash={showParentHash}
        templateColumns={templateColumns}
      />

      <Accordion allowToggle variant="transparent">
        {flatInternalTxs.slice(0, visibleCount).map((result, index) => (
          <EvmInternalTransactionTableRow
            key={`${result.txHash ?? "nested"}-${index}`}
            assetInfos={assetInfos}
            evmDenom={evmParams?.params.feeDenom}
            evmVerifyInfos={evmVerifyInfos}
            result={result.result}
            showParentHash={showParentHash}
            templateColumns={templateColumns}
            txHash={result.txHash}
          />
        ))}
      </Accordion>

      {visibleCount < flatInternalTxs.length && (
        <Flex align="center" justify="center" mt={4} ref={ref}>
          <Spinner />
        </Flex>
      )}
    </TableContainer>
  );
};
