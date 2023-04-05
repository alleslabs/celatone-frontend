import { Box, SimpleGrid } from "@chakra-ui/react";
import { useMemo, useState } from "react";

import { TextInput } from "lib/components/forms";
import { EmptyState } from "lib/components/state";
import type { ContractListInfo } from "lib/stores/contract";

import { ContractListCard } from "./ContractListCard";

interface AllContractListsProps {
  contractLists: ContractListInfo[];
  handleListSelect: (value: string) => void;
  isReadOnly?: boolean;
  formLabelBgColor?: string;
}

export const AllContractLists = ({
  contractLists,
  isReadOnly,
  formLabelBgColor,
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
      <TextInput
        variant="floating"
        value={searchKeyword}
        setInputState={setSearchKeyword}
        placeholder="Search for your lists"
        labelBgColor={formLabelBgColor}
        size="md"
        mb={isReadOnly ? 4 : 12}
      />
      {filteredContractLists.length === 0 ? (
        <EmptyState
          message="None of your lists matches this search."
          imageVariant="not-found"
        />
      ) : (
        <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={4} w="full">
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
