import { Heading, Box, Flex, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import {
  useInternalNavigate,
  useWasmConfig,
  useMobile,
} from "lib/app-provider";
import { InstantiatedContractCard } from "lib/components/card/ContractCard";
import { Loading } from "lib/components/Loading";
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

  const { recentContracts, isLoading } = useRecentContractsData("");

  const emptyState = (
    <EmptyState
      imageVariant="empty"
      message="Most recent 100 contracts will display here."
      withBorder
    />
  );
  const isMobile = useMobile();
  const MobileSection = () => {
    if (isLoading) return <Loading />;
    if (!recentContracts?.length) return emptyState;
    return (
      <Flex direction="column" gap={4} w="full" mt={4}>
        {recentContracts.map((contract) => (
          <InstantiatedContractCard
            contractInfo={contract}
            key={contract.contractAddress}
          />
        ))}
      </Flex>
    );
  };
  return (
    <PageContainer>
      <Box>
        <Heading variant="h5" as="h5" minH="36px">
          Recent Contracts
        </Heading>
        <Text variant="body2" color="text.dark" fontWeight={500} mb={8}>
          These contracts are the most recently instantiated on this network
        </Text>
      </Box>
      {isMobile ? (
        <MobileSection />
      ) : (
        <ContractsTable
          contracts={recentContracts}
          isLoading={isLoading}
          emptyState={emptyState}
          onRowSelect={onRowSelect}
          withoutTag
        />
      )}
    </PageContainer>
  );
});

export default RecentContracts;
