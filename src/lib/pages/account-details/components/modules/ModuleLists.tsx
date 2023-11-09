import { Flex } from "@chakra-ui/react";
import { useState } from "react";

import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import InputWithIcon from "lib/components/InputWithIcon";
import { TableTitle, ViewMore } from "lib/components/table";
import { type IndexedModule } from "lib/services/move/moduleService";
import type { MoveAccountAddr, Option } from "lib/types";

import { ModuleListsBody } from "./ModuleListsBody";

interface ModuleListsProps {
  totalCount: Option<number>;
  selectedAddress: MoveAccountAddr;
  modules: Option<IndexedModule[]>;
  isLoading: boolean;
  onViewMore?: () => void;
}

export const ModuleLists = ({
  totalCount,
  selectedAddress,
  modules,
  isLoading,
  onViewMore,
}: ModuleListsProps) => {
  const [keyword, setKeyword] = useState("");
  const isMobile = useMobile();
  const isMobileOverview = isMobile && !!onViewMore;
  return isMobileOverview ? (
    <Flex
      justify="space-between"
      w="full"
      bg="gray.900"
      borderRadius="8px"
      p={4}
      onClick={onViewMore}
    >
      <TableTitle title="Modules" count={totalCount} mb={0} />
      <CustomIcon name="chevron-right" color="gray.600" />
    </Flex>
  ) : (
    <Flex
      direction="column"
      mt={{ base: 4, md: 8 }}
      mb={{ base: 0, md: 8 }}
      width="full"
      gap={6}
    >
      <TableTitle
        title="Module Instances"
        helperText="Modules are ‘smart contracts’ deployed by this account"
        count={totalCount}
        mb={0}
      />
      {!onViewMore && (
        <InputWithIcon
          placeholder="Search with Module Name..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          action="execute-message-search"
        />
      )}
      <ModuleListsBody
        selectedAddress={selectedAddress}
        keyword={keyword}
        modules={modules}
        isLoading={isLoading}
        onViewMore={onViewMore}
      />
      {onViewMore && totalCount && totalCount > 9 && (
        <ViewMore onClick={onViewMore} />
      )}
    </Flex>
  );
};
