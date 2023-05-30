import { Heading, Box, Flex } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import type { ChangeEvent } from "react";
import { useForm } from "react-hook-form";

import { useInternalNavigate } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import PageContainer from "lib/components/PageContainer";
import { EmptyState } from "lib/components/state";
import { ContractsTable } from "lib/components/table";
import type { ContractAddr } from "lib/types";

import { useRecentContractsData } from "./data";

interface RecentContractsState {
  keyword: string;
}

const RecentContracts = observer(() => {
  const navigate = useInternalNavigate();
  const onRowSelect = (contract: ContractAddr) =>
    navigate({
      pathname: "/contracts/[contract]",
      query: { contract },
    });
  const { watch, setValue } = useForm<RecentContractsState>({
    defaultValues: {
      keyword: "",
    },
  });
  const { keyword } = watch();
  const { recentContracts, isLoading } = useRecentContractsData(keyword);

  const isSearching = !!keyword;

  return (
    <PageContainer>
      <Box pb={16}>
        <Heading
          variant="h5"
          as="h5"
          minH="36px"
          display="flex"
          alignItems="center"
        >
          Recent Contracts
        </Heading>
        <Flex mt={8}>
          <InputWithIcon
            placeholder="Search with contract address, name or label"
            value={keyword}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setValue("keyword", e.target.value)
            }
            size="lg"
          />
        </Flex>
      </Box>
      <ContractsTable
        contracts={recentContracts}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            imageVariant={isSearching ? "not-found" : "empty"}
            message={
              isSearching
                ? "No matched contracts found"
                : "Most recent 100 contracts will display here."
            }
            withBorder
          />
        }
        onRowSelect={onRowSelect}
        hasTag={false}
      />
    </PageContainer>
  );
});

export default RecentContracts;
