import { Flex } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { MdSearch, MdSearchOff } from "react-icons/md";

import { Loading } from "lib/components/Loading";
import { DisconnectedState } from "lib/components/state/DisconnectedState";
import { EmptyState } from "lib/components/state/EmptyState";
import type { PastTransaction, Option } from "lib/types";

import { PastTxRow } from "./PastTxRow";
import { PastTxsTableHeader } from "./PastTxsTableHeader";

interface PastTxsContentProps {
  isLoading: boolean;
  txDataError: unknown;
  input: string;
  filterSelected: string[];
  txData: Option<PastTransaction[]>;
}
export const PastTxsContent = ({
  isLoading,
  txDataError,
  input,
  filterSelected,
  txData,
}: PastTxsContentProps) => {
  const { address } = useWallet();

  const templateColumnsStyle =
    "200px 70px minmax(360px, 1fr) max(300px) max(100px)  max(70px)";

  if (!address) {
    return (
      <Flex my="20" direction="column">
        <DisconnectedState
          text="to see your past transactions."
          helperText="Past transactions involving the Wasm module (storing wasm codes, contract interactions, etc.) will display here."
        />
      </Flex>
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  if (
    txDataError ||
    ((input !== "" || filterSelected.length !== 0) && !txData?.length)
  ) {
    return (
      <Flex my="20" direction="column">
        <EmptyState
          icon={MdSearchOff}
          message={`
        No past transaction matches found with your input.
        You can search with transaction hash, and contract address.
        `}
        />
      </Flex>
    );
  }

  if (!txData?.length) {
    return (
      <Flex my="20" direction="column">
        <EmptyState
          icon={MdSearch}
          message={`
        Past transactions involving with Wasm module
        such as Instantiate, Execute, or Upload Wasm file will display here.
        `}
        />
      </Flex>
    );
  }
  return (
    <Flex direction="column" overflowX="scroll" my="10">
      <PastTxsTableHeader templateColumns={templateColumnsStyle} />
      {txData.map((transaction) => (
        <PastTxRow
          key={transaction.hash}
          transaction={transaction}
          templateColumnsStyle={templateColumnsStyle}
        />
      ))}
    </Flex>
  );
};
