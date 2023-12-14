import { Box, SimpleGrid } from "@chakra-ui/react";
import { useMemo, useState } from "react";

import InputWithIcon from "../InputWithIcon";
import { EmptyState } from "lib/components/state";
import type { ContractListInfo } from "lib/stores/contract";

import { ContractListCard } from "./ContractListCard";

interface AllContractListsProps {
  contractLists: ContractListInfo[];
  handleListSelect: (value: string) => void;
  isReadOnly?: boolean;
}

export const AllContractLists = ({
  contractLists,
  isReadOnly,

  handleListSelect,
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
        placeholder="Search with List Name"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        size={{ base: "md", md: "lg" }}
        my={isReadOnly ? 4 : 0}
        action="contract-list-search"
      />
      {filteredContractLists.length === 0 ? (
        <EmptyState
          message="None of your lists matches this search."
          imageVariant="not-found"
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
              isReadOnly={isReadOnly || !item.isInfoEditable}
            />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};
