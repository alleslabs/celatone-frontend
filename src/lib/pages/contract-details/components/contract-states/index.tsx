import type { BechAddr32 } from "lib/types";

import {
  Alert,
  AlertDescription,
  Button,
  ButtonGroup,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { saveAs } from "file-saver";
import { AmpEvent, track, trackContractStatesLoad } from "lib/amplitude";
import InputWithIcon from "lib/components/InputWithIcon";
import { useContractStatesRest } from "lib/services/wasm/contractState";
import { groupContractStatesByFirstIndex } from "lib/utils";
import { useMemo, useState } from "react";

import { StateList } from "./StateList";
import { StateLoader } from "./StateLoader";

const getDisplayName = (namespace: string) => {
  if (namespace === "all") return "All contract states";
  if (namespace === "others") return "Others";

  return namespace;
};

interface ContractStatesProps {
  contractAddress: BechAddr32;
}

const limit = 100;

export const ContractStates = ({ contractAddress }: ContractStatesProps) => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useContractStatesRest(contractAddress, limit);

  const [selectedNamespace, setSelectedNamespace] = useState("all");
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

      const grouped = groupContractStatesByFirstIndex(flatten);

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

  const handleDownload = () => {
    const jsonString = JSON.stringify(rawStates, null, 2);

    const blob = new Blob([jsonString], { type: "application/json" });

    saveAs(blob, "state.json");
  };

  return (
    <Flex direction="column" gap={8}>
      <Flex direction="column" gap={6}>
        <Heading as="h6" variant="h6">
          Contract states
        </Heading>
        <StateLoader
          isCompleted={!hasNextPage}
          isLoading={isFetching || isFetchingNextPage}
          numStatesToLoad={limit}
          totalData={totalData}
          onDownload={() => {
            trackContractStatesLoad(AmpEvent.USE_CONTRACT_STATES_DOWNLOAD, {
              currentStates: totalData,
              namespacesCount: namespaces.length,
              namespaces,
            });
            handleDownload();
          }}
          onLoadMore={() => {
            trackContractStatesLoad(AmpEvent.USE_CONTRACT_STATES_LOAD_MORE, {
              currentStates: totalData,
              namespacesCount: namespaces.length,
              namespaces,
            });
            fetchNextPage();
          }}
        />
      </Flex>
      {!!error && (
        <Alert alignItems="center" variant="error">
          <AlertDescription wordBreak="break-word">
            Error fetching data from REST. Please refresh to try again.
          </AlertDescription>
        </Alert>
      )}
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
            border="1px solid"
            borderColor="gray.100"
            borderRadius="16px"
            fontSize="14px"
            fontWeight={400}
            height="28px"
            variant={
              namespace === selectedNamespace ? "primary" : "outline-white"
            }
            onClick={() => {
              track(AmpEvent.USE_NAMESPACE_TAB, { namespace });
              setSelectedNamespace(namespace);
            }}
          >
            {getDisplayName(namespace)}
          </Button>
        ))}
      </ButtonGroup>

      {/* Searchbar */}
      <InputWithIcon
        amptrackSection="contract-states-search"
        placeholder="Search by key"
        size={{ base: "md", md: "lg" }}
        value={keyword}
        onChange={(e) => {
          const newVal = e.target.value;
          setKeyword(newVal);
        }}
      />

      {/* State List */}
      <StateList
        isLoading={isFetching}
        isSearching={keyword.trim().length !== 0}
        states={states}
        totalData={totalDataByNamespace}
      />
    </Flex>
  );
};
