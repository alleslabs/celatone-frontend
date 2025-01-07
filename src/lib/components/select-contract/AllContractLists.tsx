import { Box, SimpleGrid } from "@chakra-ui/react";
import { useMemo, useState } from "react";

import InputWithIcon from "../InputWithIcon";
import { EmptyState } from "lib/components/state";
import type { ContractListInfo } from "lib/stores/contract";

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
        my={isReadOnly ? 4 : 0}
        size={{ base: "md", md: "lg" }}
        value={searchKeyword}
        amptrackSection="contract-list-search"
        onChange={(e) => setSearchKeyword(e.target.value)}
        placeholder="Search with List Name"
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
          pt={12}
          spacing={4}
          w="full"
          columns={{ lg: 3, md: 2, sm: 1 }}
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
