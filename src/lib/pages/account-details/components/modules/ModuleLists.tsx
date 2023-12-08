import { Box } from "@chakra-ui/react";
import { useState } from "react";

import { useMobile } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import { MobileTitle, TableTitle, ViewMore } from "lib/components/table";
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
  return (
    <Box mt={{ base: 4, md: 16 }}>
      {isMobileOverview ? (
        <MobileTitle
          title="Modules"
          count={totalCount}
          onViewMore={onViewMore}
        />
      ) : (
        <>
          <TableTitle
            title="Module Instances"
            helperText="Modules are ‘smart contracts’ deployed by this account"
            count={totalCount}
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
          {onViewMore && !!totalCount && totalCount > 9 && (
            <ViewMore onClick={onViewMore} />
          )}
        </>
      )}
    </Box>
  );
};
