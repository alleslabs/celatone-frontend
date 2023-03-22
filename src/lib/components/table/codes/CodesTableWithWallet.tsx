import { Flex } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";

import { DisconnectedState } from "lib/components/state";
import type { CodeInfo } from "lib/types";

import { CodesTable } from "./CodesTable";

interface CodesTableWithWalletProps {
  codes: CodeInfo[];
  isLoading: boolean;
  emptyState: JSX.Element;
  onRowSelect: (codeId: number) => void;
  disconnected: string;
  isReadOnly?: boolean;
}

export const CodesTableWithWallet = ({
  codes,
  isLoading,
  emptyState,
  onRowSelect,
  disconnected,
  isReadOnly = false,
}: CodesTableWithWalletProps) => {
  const { address } = useWallet();
  return !address ? (
    <Flex
      direction="column"
      py="48px"
      borderY="1px solid"
      borderColor="pebble.700"
    >
      <DisconnectedState text={disconnected} />
    </Flex>
  ) : (
    <CodesTable
      codes={codes}
      isLoading={isLoading}
      onRowSelect={onRowSelect}
      emptyState={emptyState}
      isReadOnly={isReadOnly}
    />
  );
};
