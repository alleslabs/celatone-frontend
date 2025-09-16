import type {
  BechAddr20,
  Option,
  ProposalStatus,
  ProposalType,
} from "lib/types";

import { Flex, Switch, Text } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { useCelatoneApp, useCurrentChain, useMobile } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { ProposalsTable } from "lib/components/table";
import { Tooltip } from "lib/components/Tooltip";
import { useDebounce, useQueryEvents } from "lib/hooks";
import { useProposals } from "lib/services/proposal";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
    currentPage,
    offset,
    pageSize,
    pagesQuantity,
    setCurrentPage,
    setPageSize,
    setTotalData,
  } = usePaginator({
    initialState: {
      currentPage: 1,
      isDisabled: false,
      pageSize: 10,
    },
  });

  const proposalsQuery = useProposals(
    pageSize,
    offset,
    proposer,
    statuses,
    types,
    debouncedSearch
  );
  useQueryEvents(proposalsQuery, {
    onSuccess: ({ total }) => setTotalData(total),
  });
  const { data: proposals, error, isLoading } = proposalsQuery;

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
      <Flex direction="column" gap={{ base: 4, md: 8 }} my={8}>
        <Flex align="center" justify="space-between">
          <InputWithIcon
            amptrackSection="proposal-list-search"
            placeholder="Search with proposal ID or proposal title"
            size="lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {!isMobile && (
            <Tooltip
              hidden={!!address}
              label="You need to connect your wallet to see your proposals"
              maxW="240px"
              textAlign="center"
            >
              <Switch
                alignItems="center"
                disabled={!address}
                display="flex"
                h="fit-content"
                isChecked={!!proposer}
                justifyContent="center"
                minW="200px"
                size="md"
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
          direction={{ base: "column", md: "row" }}
          gap={{ base: 10, md: 3 }}
          pb={3}
        >
          <ProposalStatusFilter
            isMulti
            label="Filter by status"
            placeholder="All status"
            result={statuses}
            setResult={setStatuses}
          />
          <ProposalTypeFilter
            label="Filter by type"
            placeholder="All type"
            result={types}
            setResult={setTypes}
          />
        </Flex>
      </Flex>
      <ProposalsTable
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
        isLoading={isLoading}
        proposals={proposals?.items}
      />
      {proposals && proposals.total > 10 && (
        <Pagination
          currentPage={currentPage}
          offset={offset}
          pageSize={pageSize}
          pagesQuantity={pagesQuantity}
          totalData={proposals.total}
          onPageChange={setCurrentPage}
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
