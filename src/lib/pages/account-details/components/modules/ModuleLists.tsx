import { Box, Flex } from "@chakra-ui/react";
import { useState } from "react";

import AccountSectionWrapper from "../AccountSectionWrapper";
import { useMobile } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import { MobileTitle, ViewMore } from "lib/components/table";
import type { BechAddr, IndexedModule, Option } from "lib/types";

import { ModuleListsBody } from "./ModuleListsBody";

interface ModuleListsProps {
  address: BechAddr;
  isLoading: boolean;
  modules: Option<IndexedModule[]>;
  onViewMore?: () => void;
  totalCount: Option<number>;
}

export const ModuleLists = ({
  address,
  isLoading,
  modules,
  onViewMore,
  totalCount,
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
        <AccountSectionWrapper
          hasHelperText={!!modules?.length}
          helperText="This account deployed the following modules"
          title="Module Instances"
          showCount={false}
        >
          <Flex
            borderBottom={modules?.length ? "1px solid" : "0px"}
            borderBottomColor="gray.700"
            direction="column"
          >
            {!onViewMore && (
              <InputWithIcon
                my={4}
                size={{ base: "md", md: "lg" }}
                value={keyword}
                amptrackSection="account-detail-module-name-search"
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search with Module Name"
              />
            )}
            <ModuleListsBody
              keyword={keyword}
              address={address}
              isLoading={isLoading}
              modules={modules}
              onViewMore={onViewMore}
            />
            {onViewMore && !!totalCount && totalCount > 9 && (
              <ViewMore onClick={onViewMore} />
            )}
          </Flex>
        </AccountSectionWrapper>
      )}
    </Box>
  );
};
