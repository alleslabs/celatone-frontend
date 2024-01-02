import { Flex, Heading, Text, Switch } from "@chakra-ui/react";
import { useRouter } from "next/router";
import type { ChangeEvent } from "react";
import { useState, useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import {
  useCelatoneApp,
  useCurrentChain,
  useGovConfig,
} from "lib/app-provider";
import { NewProposalButton } from "lib/components/button/NewProposalButton";
import InputWithIcon from "lib/components/InputWithIcon";
import PageContainer from "lib/components/PageContainer";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { ProposalsTable } from "lib/components/table";
import { Tooltip } from "lib/components/Tooltip";
import {
  useProposalList,
  useProposalListCount,
} from "lib/services/proposalService";
import type {
  BechAddr20,
  ProposalStatus,
  ProposalType,
  Option,
} from "lib/types";

import { ProposalStatusFilter } from "./components/ProposalStatusFilter";
import { ProposalTypeFilter } from "./components/ProposalTypeFilter";

const Proposals = () => {
  const { currentChainId } = useCelatoneApp();
  useGovConfig({ shouldRedirect: true });
  const router = useRouter();
  const [statuses, setStatuses] = useState<ProposalStatus[]>([]);
  const [types, setTypes] = useState<ProposalType[]>([]);

  const { address } = useCurrentChain();
  const [search, setSearch] = useState("");
  const [proposer, setProposer] = useState<Option<BechAddr20>>();
  const [isSelected, setIsSelected] = useState(false);

  const { data: countProposals = 0 } = useProposalListCount(
    statuses,
    types,
    search,
    proposer
  );
  const {
    pagesQuantity,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    offset,
  } = usePaginator({
    total: countProposals,
    initialState: {
      pageSize: 10,
      currentPage: 1,
      isDisabled: false,
    },
  });

  const { data: proposals, isLoading } = useProposalList(
    offset,
    pageSize,
    statuses,
    types,
    search,
    proposer
  );
  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_PROPOSAL_LIST);
  }, [router.isReady]);

  useEffect(() => {
    setPageSize(10);
    setCurrentPage(1);
  }, [
    currentChainId,
    setCurrentPage,
    setPageSize,
    statuses,
    types,
    search,
    proposer,
  ]);

  useEffect(() => {
    setIsSelected(false);
    setProposer(undefined);
  }, [currentChainId, address]);

  const onPageChange = (nextPage: number) => setCurrentPage(nextPage);

  const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const size = Number(e.target.value);
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <PageContainer>
      <Flex justify="space-between" alignItems="center">
        <Heading as="h5" variant="h5">
          Proposals
        </Heading>
        <NewProposalButton />
      </Flex>
      <Flex direction="column" my={8} gap={8}>
        <Flex justify="space-between" align="center">
          <InputWithIcon
            placeholder="Search with Proposal ID or Proposal Title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size={{ base: "md", md: "lg" }}
            amptrackSection="proposal-list-search"
          />
          <Tooltip
            isDisabled={!!address}
            label="You need to connect your wallet to see your proposals"
            maxW="240px"
            textAlign="center"
          >
            <div>
              <Switch
                alignItems="center"
                justifyContent="center"
                h="fit-content"
                minW="200px"
                display="flex"
                size="md"
                isChecked={isSelected}
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
                  setIsSelected(e.target.checked);
                }}
              >
                <Text cursor={address ? "pointer" : "default"}>
                  My Proposals
                </Text>
              </Switch>
            </div>
          </Tooltip>
        </Flex>
        <Flex gap={3} pb={3}>
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
        proposals={proposals}
        isLoading={isLoading}
        emptyState={
          statuses.length > 0 ||
          types.length > 0 ||
          search.trim().length > 0 ||
          proposer !== undefined ? (
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
          )
        }
      />
      {countProposals > 10 && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={countProposals}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </PageContainer>
  );
};

export default Proposals;
