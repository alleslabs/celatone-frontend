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
import { useContractStatesLcd } from "lib/services/wasm/contractState";
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

const limit = 100;

export const ContractStates = ({ contractAddress }: ContractStatesProps) => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useContractStatesLcd(contractAddress, limit);

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
    <Flex gap={8} direction="column">
      <Flex gap={6} direction="column">
        <Heading as="h6" variant="h6">
          Contract States
        </Heading>
        <StateLoader
          isCompleted={!hasNextPage}
          isLoading={isFetching || isFetchingNextPage}
          numStatesToLoad={limit}
          onDownload={() => {
            trackContractStatesLoad(AmpEvent.USE_CONTRACT_STATES_DOWNLOAD, {
              currentStates: totalData,
              namespaces,
              namespacesCount: namespaces.length,
            });
            handleDownload();
          }}
          onLoadMore={() => {
            trackContractStatesLoad(AmpEvent.USE_CONTRACT_STATES_LOAD_MORE, {
              currentStates: totalData,
              namespaces,
              namespacesCount: namespaces.length,
            });
            fetchNextPage();
          }}
          totalData={totalData}
        />
      </Flex>
      {!!error && (
        <Alert alignItems="center" variant="error">
          <AlertDescription wordBreak="break-word">
            Error fetching data from LCD. Please refresh to try again.
          </AlertDescription>
        </Alert>
      )}
      {/* Namespace filter */}
      <ButtonGroup
        flexWrap="wrap"
        sx={{
          "> button": {
            marginInlineEnd: "1",
            marginInlineStart: "0 !important",
          },
        }}
        rowGap={2}
      >
        {namespaces.map((namespace) => (
          <Button
            key={namespace}
            height="28px"
            variant={
              namespace === selectedNamespace ? "primary" : "outline-white"
            }
            border="1px solid"
            borderColor="gray.100"
            borderRadius="16px"
            fontSize="14px"
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
        size={{ base: "md", md: "lg" }}
        value={keyword}
        amptrackSection="contract-states-search"
        onChange={(e) => {
          const newVal = e.target.value;
          setKeyword(newVal);
        }}
        placeholder="Search by Key"
      />

      {/* State List */}
      <StateList
        isSearching={keyword.trim().length !== 0}
        states={states}
        isLoading={isFetching}
        totalData={totalDataByNamespace}
      />
    </Flex>
  );
};
