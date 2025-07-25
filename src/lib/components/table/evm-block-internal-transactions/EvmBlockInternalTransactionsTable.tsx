import { useDebugTraceBlockByNumber } from "lib/services/evm";

interface EvmInternalTransactionsTableProps {
  height: number;
}

export const EvmBlockInternalTransactionsTable = ({
  height,
}: EvmInternalTransactionsTableProps) => {
  const { data } = useDebugTraceBlockByNumber(height);

  // eslint-disable-next-line no-console
  console.log("hahahahaa: ", data);

  return <div>EvmBlockInternalTransactionsTable</div>;
};
