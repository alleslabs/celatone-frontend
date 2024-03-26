import {
  Alert,
  AlertDescription,
  Button,
  ButtonGroup,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { saveAs } from "file-saver";
import { useMemo, useState } from "react";

import { AmpEvent, track, trackContractStatesLoad } from "lib/amplitude";
import InputWithIcon from "lib/components/InputWithIcon";
import { useContractStates } from "lib/services/contractStateService";
import type { BechAddr32 } from "lib/types";
import { groupContractStatesByFirstIndex } from "lib/utils";

import { StateList } from "./StateList";
import { StateLoader } from "./StateLoader";

const getDisplayName = (namespace: string) => {
  if (namespace === "all") return "All Contract States";
  if (namespace === "others") return "Others";

  return namespace;
};

interface ContractStatesProps {
  contractAddress: BechAddr32;
}

const NUM_STATES_TO_LOAD = 100;

export const ContractStates = ({ contractAddress }: ContractStatesProps) => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useContractStates(contractAddress, NUM_STATES_TO_LOAD);

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
          Contract States
        </Heading>
        <StateLoader
          numStatesToLoad={NUM_STATES_TO_LOAD}
          isLoading={isFetching || isFetchingNextPage}
          totalData={totalData}
          isCompleted={!hasNextPage}
          onLoadMore={() => {
            trackContractStatesLoad(AmpEvent.USE_CONTRACT_STATES_LOAD_MORE, {
              currentStates: totalData,
              namespacesCount: namespaces.length,
              namespaces,
            });
            fetchNextPage();
          }}
          onDownload={() => {
            trackContractStatesLoad(AmpEvent.USE_CONTRACT_STATES_DOWNLOAD, {
              currentStates: totalData,
              namespacesCount: namespaces.length,
              namespaces,
            });
            handleDownload();
          }}
        />
      </Flex>
      {!!error && (
        <Alert variant="error" alignItems="center">
          <AlertDescription wordBreak="break-word">
            Error fetching data from LCD. Please refresh to try again.
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
            variant={
              namespace === selectedNamespace
                ? "accent-solid"
                : "outline-accent"
            }
            fontSize="14px"
            height="28px"
            borderRadius="16px"
            fontWeight={400}
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
        placeholder="Search by Key"
        value={keyword}
        onChange={(e) => {
          const newVal = e.target.value;
          setKeyword(newVal);
        }}
        size={{ base: "md", md: "lg" }}
        amptrackSection="contract-states-search"
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
