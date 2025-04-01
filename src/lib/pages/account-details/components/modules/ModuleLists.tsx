import { Box, Flex } from "@chakra-ui/react";
import { useState } from "react";

import { useMobile } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import { MobileTitle, ViewMore } from "lib/components/table";
import type { HexAddr, IndexedModule, Option } from "lib/types";

import { ModuleListsBody } from "./ModuleListsBody";
import AccountSectionWrapper from "../AccountSectionWrapper";

interface ModuleListsProps {
  address: HexAddr;
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
        <AccountSectionWrapper
          title="Module instances"
          showCount={false}
          helperText="This account deployed the following modules"
          hasHelperText={!!modules?.length}
        >
          <Flex
            direction="column"
            borderBottom={modules?.length ? "1px solid" : "0px"}
            borderBottomColor="gray.700"
          >
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
          </Flex>
        </AccountSectionWrapper>
      )}
    </Box>
  );
};
