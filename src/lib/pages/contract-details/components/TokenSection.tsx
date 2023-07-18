import { Flex, Grid, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";

import type { ContractData } from "../types";
import { ShowMoreButton } from "lib/components/button";
import { Loading } from "lib/components/Loading";
import { UnsupportedTokensModal } from "lib/components/modal";
import { TokenCard } from "lib/components/TokenCard";
import type { ContractAddr } from "lib/types";

interface TokenSectionProps {
  contractAddress: ContractAddr;
  balances: ContractData["balances"];
  isBalancesLoading: ContractData["isBalancesLoading"];
  amptrackPage?: string;
}
export const TokenSection = ({
  contractAddress,
  balances,
  isBalancesLoading,
  amptrackPage,
}: TokenSectionProps) => {
  const [showMore, setShowMore] = useState(false);

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
          {supportedAssets.map((balance, index) => {
            if (!showMore && index >= 4) {
              return null;
            }
            return <TokenCard key={balance.balance.id} userBalance={balance} />;
          })}
        </Grid>
        {supportedAssets.length > 4 && (
          <ShowMoreButton
            showMoreText="View All Assets"
            showLessText="View Less Assets"
            toggleShowMore={showMore}
            setToggleShowMore={() => setShowMore(!showMore)}
          />
        )}
      </>
    );
  };

  return (
    <>
      <Flex justify="space-between" align="center" mb={{ base: 2, md: 1 }}>
        <Text variant="body2" color="text.dark" fontWeight={500}>
          Assets
        </Text>
        <UnsupportedTokensModal
          unsupportedAssets={unsupportedAssets}
          address={contractAddress as ContractAddr}
          amptrackSection={amptrackPage}
        />
      </Flex>
      {renderContext()}
    </>
  );
};
