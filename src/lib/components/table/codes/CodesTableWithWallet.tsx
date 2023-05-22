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
  disconnectedMessage: string;
  isReadOnly?: boolean;
}

export const CodesTableWithWallet = ({
  codes,
  isLoading,
  emptyState,
  onRowSelect,
  disconnectedMessage,
  isReadOnly = false,
}: CodesTableWithWalletProps) => {
  const { address } = useWallet();
  return !address ? (
    <Flex
      direction="column"
      py="48px"
      borderY="1px solid"
      borderColor="gray.700"
    >
      <DisconnectedState text={disconnectedMessage} />
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
