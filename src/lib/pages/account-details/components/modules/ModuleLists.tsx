import type { HexAddr, IndexedModule, Option } from "lib/types";

import { Box, Flex } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import { MobileTitle, ViewMore } from "lib/components/table";
import { useState } from "react";

import AccountSectionWrapper from "../AccountSectionWrapper";
import { ModuleListsBody } from "./ModuleListsBody";

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
          count={totalCount}
          title="Modules"
          onViewMore={onViewMore}
        />
      ) : (
        <AccountSectionWrapper
          title="Module instances"
          showCount={false}
          helperText="This account deployed the following modules"
          hasHelperText={!!modules?.length}
          helperText="This account deployed the following modules"
          showCount={false}
          title="Module Instances"
        >
          <Flex
            borderBottomColor="gray.700"
            borderBottomWidth={modules?.length ? "1px" : "0px"}
            borderStyle="solid"
            direction="column"
          >
            {!onViewMore && (
              <InputWithIcon
                placeholder="Search with module name"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            )}
            <ModuleListsBody
              address={address}
              isLoading={isLoading}
              keyword={keyword}
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
