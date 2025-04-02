import type { ContractListInfo } from "lib/stores/contract";

import { Box, SimpleGrid } from "@chakra-ui/react";
import { EmptyState } from "lib/components/state";
import { useMemo, useState } from "react";

import InputWithIcon from "../InputWithIcon";
import { ContractListCard } from "./ContractListCard";

interface AllContractListsProps {
  contractLists: ContractListInfo[];
  handleListSelect: (value: string) => void;
  isReadOnly: boolean;
}

export const AllContractLists = ({
  contractLists,
  handleListSelect,
  isReadOnly,
}: AllContractListsProps) => {
  const [searchKeyword, setSearchKeyword] = useState("");

  const filteredContractLists = useMemo(
    () =>
      contractLists.filter((item) =>
        item.name.toLowerCase().includes(searchKeyword.toLowerCase())
      ),
    [contractLists, searchKeyword]
  );

  return (
    <Box minH="xs" w="100%">
      <InputWithIcon
        amptrackSection="contract-list-search"
        my={isReadOnly ? 4 : 0}
        placeholder="Search with List Name"
        size={{ base: "md", md: "lg" }}
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
      />
      {filteredContractLists.length === 0 ? (
        <EmptyState
          imageVariant="not-found"
          message="No matching lists found.
        Make sure you are searching with list name."
          withBorder
        />
      ) : (
        <SimpleGrid
          columns={{ sm: 1, md: 2, lg: 3 }}
          pt={12}
          spacing={4}
          w="full"
        >
          {filteredContractLists.map((item) => (
            <ContractListCard
              key={item.slug}
              handleListSelect={handleListSelect}
              isReadOnly={isReadOnly}
              item={item}
            />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};
