import { Flex, Heading, Text, Switch } from "@chakra-ui/react";
import { useRouter } from "next/router";
import type { ChangeEvent } from "react";
import { useState, useEffect } from "react";

import { useChainId } from "lib/app-provider";
import { NewProposalButton } from "lib/components/button/NewProposalButton";
import InputWithIcon from "lib/components/InputWithIcon";
import PageContainer from "lib/components/PageContainer";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import {
  useProposalList,
  useProposalListCount,
  useProposalTypes,
} from "lib/services/proposalService";
import type { ProposalStatus, ProposalType } from "lib/types";

import { ProposalStatusFilter } from "./components/ProposalStatusFilter";
import { ProposalTypeFilter } from "./components/ProposalTypeFilter";
import { ProposalTable } from "./table/ProposalTable";

const Proposals = () => {
  const chainId = useChainId();
  const router = useRouter();
  const [statuses, setStatuses] = useState<ProposalStatus[]>([]);
  const [types, setTypes] = useState<ProposalType[]>([]);
  const { data: proposalTypes } = useProposalTypes();

  const { data: countProposals = 0 } = useProposalListCount(
    statuses,
    types,
    "",
    undefined
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
    "",
    undefined
  );

  useEffect(() => {
    if (router.isReady) AmpTrack(AmpEvent.TO_PROPOSALS);
  }, [router.isReady]);

  useEffect(() => {
    setPageSize(10);
    setCurrentPage(1);
  }, [chainId, setCurrentPage, setPageSize]);

  const onPageChange = (nextPage: number) => setCurrentPage(nextPage);

  const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const size = Number(e.target.value);
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <PageContainer>
      <Flex justify="space-between">
        <Heading as="h5" variant="h5">
          Proposals
        </Heading>
        <NewProposalButton />
      </Flex>
      <Flex direction="column" my={8} gap={8}>
        <Flex justify="space-between">
          {/* TODO - Wireup search bar */}
          <InputWithIcon
            placeholder="Search with Proposal ID or Proposal Title"
            onChange={() => {}}
            size="lg"
            value="Value"
          />
          <Flex gap={2} alignItems="center" justify="center" minW="200px">
            <Switch size="md" />
            <Text>My Proposals</Text>
          </Flex>
        </Flex>
        <Flex gap={2} pb={3}>
          <ProposalStatusFilter
            label="Filter by Status"
            result={statuses}
            setResult={setStatuses}
            placeholder="All Status"
          />
          {proposalTypes && (
            <ProposalTypeFilter
              label="Filter by Type"
              result={types}
              setResult={setTypes}
              proposalTypes={proposalTypes}
              placeholder="All Type"
            />
          )}
        </Flex>
      </Flex>
      <ProposalTable proposals={proposals} isLoading={isLoading} />
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
