import { Flex } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { StoredCodeCard } from "lib/components/card/StoredCodeCard";
import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import { CodesTable } from "lib/components/table";
import type { CodeInfo, Option } from "lib/types";

interface StoredCodesBodyProps {
  codes: Option<CodeInfo[]>;
  isLoading: boolean;
  emptyState: JSX.Element;
  onRowSelect: (codeId: number) => void;
  onViewMore?: () => void;
}

export const StoredCodesBody = ({
  codes,
  isLoading,
  emptyState,
  onRowSelect,
  onViewMore,
}: StoredCodesBodyProps) => {
  const isMobile = useMobile();
  if (isLoading) return <Loading />;
  if (!codes?.length) return emptyState;
  if (isMobile && !onViewMore)
    return (
      <Flex direction="column" gap={4} w="full" mt={4}>
        {codes.map((code) => (
          <StoredCodeCard
            key={code.id + code.uploader + code.name}
            codeInfo={code}
          />
        ))}
      </Flex>
    );
  if (isMobile && onViewMore) return null;
  return (
    <CodesTable
      codes={codes}
      isLoading={isLoading}
      emptyState={<EmptyState message={emptyState} withBorder />}
      onRowSelect={onRowSelect}
    />
  );
};
