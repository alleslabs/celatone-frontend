import { Button, ButtonGroup, Flex, Heading } from "@chakra-ui/react";
import { saveAs } from "file-saver";
import { useEffect, useMemo, useState } from "react";

import InputWithIcon from "lib/components/InputWithIcon";
import { ErrorFetching } from "lib/pages/account-details/components/ErrorFetching";
import { useContractStates } from "lib/services/contractStateService";
import type { ContractAddr } from "lib/types";
import { groupByFirstIndex } from "lib/utils";

import { StateList } from "./StateList";
import { StateLoader } from "./StateLoader";

interface ContractStatesProps {
  contractAddress: ContractAddr;
}
export const ContractStates = ({ contractAddress }: ContractStatesProps) => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useContractStates(contractAddress);

  const [selectedNamespace, setSelectedNamespace] = useState("");
  const [keyword, setKeyword] = useState("");

  const { namespaces, rawStates, states, totalData, totalDataByNamespace } =
    useMemo(() => {
      if (!data || data?.pages.length === 0)
        return {
          namespaces: [],
          rawStates: [],
          states: [],
          totalData: 0,
          totalDataByNamespace: 0,
        };

      const flattenRaw = data.pages.flatMap((page) => page.rawStates);
      const flatten = data.pages.flatMap((page) => page.states);

      const grouped = groupByFirstIndex(flatten);

      const selected = grouped[selectedNamespace] ?? [];

      const filtered = selected.filter((state) => {
        if (state.key.type === "singleton")
          return state.key.value.toLowerCase().includes(keyword.toLowerCase());

        return state.key.values.some((value) =>
          value.toLowerCase().includes(keyword.toLowerCase())
        );
      });

      return {
        namespaces: Object.keys(grouped),
        rawStates: flattenRaw,
        states: filtered,
        totalData: flatten.length,
        totalDataByNamespace: filtered.length,
      };
    }, [data, keyword, selectedNamespace]);

  // Set current namespace to the first namespace when data is loaded
  useEffect(() => {
    setSelectedNamespace(namespaces[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namespaces.length > 0]);

  const handleDownload = () => {
    const jsonString = JSON.stringify(rawStates, null, 2);

    const blob = new Blob([jsonString], { type: "application/json" });

    saveAs(blob, "state.json");
  };

  if (error) return <ErrorFetching />;

  return (
    <Flex direction="column" gap={8}>
      <Flex direction="column" gap={6}>
        <Heading as="h6" variant="h6">
          Contract States
        </Heading>
        <StateLoader
          isLoading={isFetching || isFetchingNextPage}
          totalData={totalData}
          isCompleted={!hasNextPage}
          onLoadMore={fetchNextPage}
          onDownload={handleDownload}
        />
      </Flex>
      {/* Namespace filter */}
      <ButtonGroup
        flexWrap="wrap"
        rowGap={2}
        sx={{
          "> button": {
            marginInlineStart: "0 !important",
            marginInlineEnd: "1",
          },
        }}
      >
        {namespaces.map((namespace) => (
          <Button
            key={namespace}
            variant={
              namespace === selectedNamespace
                ? "accent-solid"
                : "outline-accent"
            }
            fontSize="14px"
            height="28px"
            borderRadius="16px"
            fontWeight={400}
            onClick={() => setSelectedNamespace(namespace)}
          >
            {namespace}
          </Button>
        ))}
      </ButtonGroup>

      {/* Searchbar */}
      <InputWithIcon
        placeholder="Search by Key"
        value={keyword}
        onChange={(e) => {
          const newVal = e.target.value;
          setKeyword(newVal);
        }}
      />

      {/* State List */}
      <StateList
        states={states}
        totalData={totalDataByNamespace}
        isLoading={isFetching}
        isSearching={keyword.trim().length !== 0}
      />
    </Flex>
  );
};
