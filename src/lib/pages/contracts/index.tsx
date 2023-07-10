import { Heading, Box, Flex, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useState } from "react";

import {
  useInternalNavigate,
  useWasmConfig,
  useMobile,
} from "lib/app-provider";
import { InstantiatedContractCard } from "lib/components/card/ContractCard";
import { TextInput } from "lib/components/forms";
import PageContainer from "lib/components/PageContainer";
import { EmptyState } from "lib/components/state";
import { ContractsTable } from "lib/components/table";
import type { ContractAddr } from "lib/types";

import { useRecentContractsData } from "./data";

const RecentContracts = observer(() => {
  useWasmConfig({ shouldRedirect: true });
  const navigate = useInternalNavigate();
  const onRowSelect = (contract: ContractAddr) =>
    navigate({
      pathname: "/contracts/[contract]",
      query: { contract },
    });
  const [searchKeyword, setSearchKeyword] = useState("");

  const { recentContracts, isLoading } = useRecentContractsData(searchKeyword);

  const isSearching = Boolean(searchKeyword);
  const isMobile = useMobile();
  return (
    <PageContainer>
      <Box pb={{ base: 0, md: 12 }}>
        <Heading variant="h5" as="h5" minH="36px">
          Recent Contracts
        </Heading>
        <Text variant="body2" color="text.dark" fontWeight={500} mb={8}>
          These contracts are the most recently instantiated on this network
        </Text>
        <Flex>
          <TextInput
            variant="floating"
            value={searchKeyword}
            setInputState={setSearchKeyword}
            placeholder="Search with Contract Address, Name, or Label"
            size="lg"
          />
        </Flex>
      </Box>
      {isMobile ? (
        <Flex direction="column" gap={4} w="full" mt={4}>
          {recentContracts.map((contract) => (
            <InstantiatedContractCard contractInfo={contract} />
          ))}
        </Flex>
      ) : (
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
          withoutTag
        />
      )}
    </PageContainer>
  );
});

export default RecentContracts;
