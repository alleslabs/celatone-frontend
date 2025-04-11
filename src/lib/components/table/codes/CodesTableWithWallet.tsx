import type { CodeInfo } from "lib/types";

import { useCurrentChain } from "lib/app-provider";
import { DisconnectedState } from "lib/components/state";

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
  const { address } = useCurrentChain();

  return !address ? (
    <DisconnectedState text={disconnectedMessage} />
  ) : (
    <CodesTable
      codes={codes}
      emptyState={emptyState}
      isLoading={isLoading}
      isReadOnly={isReadOnly}
      onRowSelect={onRowSelect}
    />
  );
};
