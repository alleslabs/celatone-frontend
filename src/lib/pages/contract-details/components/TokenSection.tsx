import { Button, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import { useMemo } from "react";

import type { ContractData } from "../types";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { UnsupportedTokensModal } from "lib/components/modal";
import { TokenCard } from "lib/components/token/TokenCard";
import type { ContractAddr } from "lib/types";

interface TokenSectionProps {
  contractAddress: ContractAddr;
  balances: ContractData["balances"];
  isBalancesLoading: ContractData["isBalancesLoading"];
  amptrackPage?: string;
  isDetailPage?: boolean;
  onViewMore?: () => void;
}
export const TokenSection = ({
  contractAddress,
  balances,
  isBalancesLoading,
  amptrackPage,
  onViewMore,
  isDetailPage = false,
}: TokenSectionProps) => {
  const unsupportedAssets = useMemo(
    () => balances?.filter((balance) => !balance.assetInfo) ?? [],
    [balances]
  );

  const supportedAssets = useMemo(
    () => balances?.filter((balance) => balance.assetInfo) ?? [],
    [balances]
  );

  const renderContext = () => {
    if (isBalancesLoading) return <Loading />;
    if (!balances?.length) {
      return (
        <Text variant="body2" color="text.dark" mb={1} fontWeight={500}>
          This contract does not hold any assets
        </Text>
      );
    }
    return (
      <>
        <Grid
          gridGap={4}
          gridTemplateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
        >
          {supportedAssets
            .slice(0, isDetailPage ? undefined : 4)
            .map((balance) => {
              return (
                <TokenCard key={balance.balance.id} userBalance={balance} />
              );
            })}
        </Grid>

        {supportedAssets.length > 4 && onViewMore && (
          <Button
            p={0}
            mt={1}
            color="secondary.main"
            variant="none"
            w="fit-content"
            onClick={() => {
              onViewMore();
            }}
          >
            <Text variant="body3" color="secondary.main" fontWeight={700}>
              View All Assets
            </Text>
            <CustomIcon name="chevron-right" boxSize={3} />
          </Button>
        )}
      </>
    );
  };

  return (
    <Flex
      flexDirection="column"
      pb={{ base: 2, md: 8 }}
      borderBottom={onViewMore ? { base: "none", md: "1px solid" } : "none"}
      borderBottomColor={{ base: "transparent", md: "gray.700" }}
    >
      <Flex justify="space-between" align="center" mb={{ base: 2, md: 1 }}>
        <Heading as="h6" variant="h6" color="text.main" fontWeight={500}>
          Assets
        </Heading>
        <UnsupportedTokensModal
          unsupportedAssets={unsupportedAssets}
          address={contractAddress as ContractAddr}
          amptrackSection={amptrackPage}
        />
      </Flex>
      {renderContext()}
    </Flex>
  );
};
