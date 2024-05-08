import { Box } from "@chakra-ui/react";
import { useState } from "react";

import { useMobile } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import { MobileTitle, TableTitle, ViewMore } from "lib/components/table";
import type { BechAddr, IndexedModule, Option } from "lib/types";

import { ModuleListsBody } from "./ModuleListsBody";

interface ModuleListsProps {
  address: BechAddr;
  totalCount: Option<number>;
  modules: Option<IndexedModule[]>;
  isLoading: boolean;
  onViewMore?: () => void;
}

export const ModuleLists = ({
  address,
  totalCount,
  modules,
  isLoading,
  onViewMore,
}: ModuleListsProps) => {
  const [keyword, setKeyword] = useState("");
  const isMobile = useMobile();
  const isMobileOverview = isMobile && !!onViewMore;
  return (
    <Box mt={{ base: 4, md: 8 }}>
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
              placeholder="Search with Module Name"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              size={{ base: "md", md: "lg" }}
              my={4}
              amptrackSection="account-detail-module-name-search"
            />
          )}
          <ModuleListsBody
            address={address}
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
