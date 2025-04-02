import { Box, SimpleGrid } from "@chakra-ui/react";
import { useMemo, useState } from "react";

import { EmptyState } from "lib/components/state";
import type { ContractListInfo } from "lib/stores/contract";

import { ContractListCard } from "./ContractListCard";
import InputWithIcon from "../InputWithIcon";

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
        placeholder="Search with list name"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        size={{ base: "md", md: "lg" }}
        my={isReadOnly ? 4 : 0}
        amptrackSection="contract-list-search"
      />
      {filteredContractLists.length === 0 ? (
        <EmptyState
          message="No matching lists found.
        Make sure you are searching with list name."
          imageVariant="not-found"
          withBorder
        />
      ) : (
        <SimpleGrid
          columns={{ sm: 1, md: 2, lg: 3 }}
          spacing={4}
          w="full"
          pt={12}
        >
          {filteredContractLists.map((item) => (
            <ContractListCard
              key={item.slug}
              item={item}
              handleListSelect={handleListSelect}
              isReadOnly={isReadOnly}
            />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};
