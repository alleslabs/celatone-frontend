import { Flex, Heading, Text, Switch, Tooltip } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
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
} from "lib/services/proposalService";
import type { Addr, Option } from "lib/types";

import { ProposalTable } from "./table/ProposalTable";

const Proposals = () => {
  const chainId = useChainId();
  const router = useRouter();
  const { address } = useWallet();
  const [search, setSearch] = useState("");
  const [proposer, setProposer] = useState<Option<Addr>>(undefined);
  const [isSelected, setIsSelected] = useState(true);

  const { data: countProposals = 0 } = useProposalListCount(
    [],
    [],
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
    [],
    [],
    search,
    proposer
  );

  useEffect(() => {
    if (router.isReady) AmpTrack(AmpEvent.TO_PROPOSALS);
  }, [router.isReady]);

  useEffect(() => {
    setPageSize(10);
    setCurrentPage(1);
  }, [chainId, setCurrentPage, setPageSize]);

  useEffect(() => {
    setIsSelected(false);
    setProposer(undefined);
  }, [chainId, address]);

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
          <InputWithIcon
            placeholder="Search with Proposal ID or Proposal Title"
            onChange={(e) => setSearch(e.target.value)}
            size="lg"
            value={search}
          />
          <Flex gap={2} alignItems="center" justify="center" minW="200px">
            <Switch
              size="md"
              isChecked={isSelected}
              disabled={!address}
              onChange={(e) => {
                if (e.target.checked && address) {
                  setProposer(address as Addr);
                } else {
                  setProposer(undefined);
                }
                setIsSelected(e.target.checked);
              }}
            />
            <Tooltip
              isDisabled={!!address}
              hasArrow
              label="You need to connect wallet to see your proposals"
              placement="top"
              bg="honeydew.darker"
              maxW="240px"
              whiteSpace="pre-line"
              textAlign="center"
            >
              <Text>My Proposals</Text>
            </Tooltip>
          </Flex>
        </Flex>
        <Flex gap={2}>
          {/* TODO - Add filter by status  */}
          <Flex>Filter by Status</Flex>
          {/* TODO - Add filter by type */}
          <Flex>Filter by Type</Flex>
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
