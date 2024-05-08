import { Flex, Switch, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useCelatoneApp, useCurrentChain, useMobile } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { ProposalsTable } from "lib/components/table";
import { Tooltip } from "lib/components/Tooltip";
import { useDebounce } from "lib/hooks";
import { useProposals } from "lib/services/proposal";
import type {
  BechAddr20,
  Option,
  ProposalStatus,
  ProposalType,
} from "lib/types";

import { ProposalStatusFilter } from "./ProposalStatusFilter";
import { ProposalTypeFilter } from "./ProposalTypeFilter";

export const ProposalsTableFull = () => {
  const router = useRouter();
  const { address } = useCurrentChain();
  const { currentChainId } = useCelatoneApp();
  const isMobile = useMobile();

  const [proposer, setProposer] = useState<Option<BechAddr20>>();
  const [statuses, setStatuses] = useState<ProposalStatus[]>([]);
  const [types, setTypes] = useState<ProposalType[]>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const {
    pagesQuantity,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    offset,
  } = usePaginator({
    initialState: {
      pageSize: 10,
      currentPage: 1,
      isDisabled: false,
    },
  });

  const {
    data: proposals,
    isLoading,
    error,
  } = useProposals(
    pageSize,
    offset,
    proposer,
    statuses,
    types,
    debouncedSearch
  );

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_PROPOSAL_LIST);
  }, [router.isReady]);

  useEffect(() => {
    setProposer(undefined);
    setStatuses([]);
    setTypes([]);
    setSearch("");
  }, [currentChainId, address]);

  useEffect(() => {
    setCurrentPage(1);
    setPageSize(10);
  }, [
    proposer,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(statuses),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(types),
    debouncedSearch,
    setCurrentPage,
    setPageSize,
  ]);

  return (
    <>
      <Flex direction="column" my={8} gap={{ base: 4, md: 8 }}>
        <Flex justify="space-between" align="center">
          <InputWithIcon
            placeholder="Search with Proposal ID or Proposal Title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="lg"
            amptrackSection="proposal-list-search"
          />
          {!isMobile && (
            <Tooltip
              label="You need to connect your wallet to see your proposals"
              maxW="240px"
              textAlign="center"
              hidden={!!address}
            >
              <Switch
                alignItems="center"
                justifyContent="center"
                h="fit-content"
                minW="200px"
                display="flex"
                size="md"
                isChecked={!!proposer}
                disabled={!address}
                onChange={(e) => {
                  if (e.target.checked && address) {
                    track(AmpEvent.USE_FILTER_MY_PROPOSALS, {
                      toggle: "on",
                    });
                    setProposer(address);
                  } else {
                    track(AmpEvent.USE_FILTER_MY_PROPOSALS, {
                      toggle: "off",
                    });
                    setProposer(undefined);
                  }
                }}
              >
                <Text cursor={address ? "pointer" : "default"}>
                  My Proposals
                </Text>
              </Switch>
            </Tooltip>
          )}
        </Flex>
        <Flex
          gap={{ base: 10, md: 3 }}
          pb={3}
          direction={{ base: "column", md: "row" }}
        >
          <ProposalStatusFilter
            label="Filter by Status"
            result={statuses}
            setResult={setStatuses}
            placeholder="All Status"
          />
          <ProposalTypeFilter
            label="Filter by Type"
            result={types}
            setResult={setTypes}
            placeholder="All Type"
          />
        </Flex>
      </Flex>
      <ProposalsTable
        proposals={proposals?.items}
        isLoading={isLoading}
        emptyState={
          error ? (
            <ErrorFetching dataName="proposals" />
          ) : (
            <>
              {!!proposer ||
              statuses.length > 0 ||
              types.length > 0 ||
              search.trim().length > 0 ? (
                <EmptyState
                  imageVariant="not-found"
                  message="No matches found. Please double-check your input and select correct network."
                  withBorder
                />
              ) : (
                <EmptyState
                  imageVariant="empty"
                  message="There are no proposals on this network."
                  withBorder
                />
              )}
            </>
          )
        }
      />
      {proposals && proposals.total > 10 && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={proposals.total}
          pageSize={pageSize}
          onPageChange={(nextPage) => setCurrentPage(nextPage)}
          onPageSizeChange={(e) => {
            const size = Number(e.target.value);
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      )}
    </>
  );
};
