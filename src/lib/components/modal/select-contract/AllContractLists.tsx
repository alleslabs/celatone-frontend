import { Box, SimpleGrid } from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";

import { TextInput } from "lib/components/forms";
import { EmptyState } from "lib/components/state/EmptyState";
import type { ContractListInfo } from "lib/stores/contract";

import { ListCard } from "./ListCard";

interface AllContractListsProps {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  contractLists: ContractListInfo[];
  handleListSelect: (value: string) => void;
  isReadOnly: boolean;
  formLabelBgColor?: string;
}

export const AllContractLists = ({
  search,
  setSearch,
  handleListSelect,
  contractLists,
  isReadOnly,
  formLabelBgColor,
}: AllContractListsProps) => {
  const filteredContractLists = contractLists.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box minH="xs" w="100%">
      <TextInput
        variant="floating"
        value={search}
        setInputState={setSearch}
        label="Search for your lists"
        labelBgColor={formLabelBgColor}
        size="md"
      />
      <Box my="18px" />
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={4} w="full">
        {filteredContractLists.map((item) => (
          <ListCard
            key={item.slug}
            item={item}
            handleListSelect={handleListSelect}
            isReadOnly={isReadOnly || !item.isInfoEditable}
            showLastUpdated={item.isContractRemovable}
          />
        ))}
      </SimpleGrid>
      {filteredContractLists.length === 0 && (
        <EmptyState message="None of your lists matches this search." />
      )}
    </Box>
  );
};
