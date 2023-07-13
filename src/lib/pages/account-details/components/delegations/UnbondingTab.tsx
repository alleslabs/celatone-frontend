import { Box, Flex, Text } from "@chakra-ui/react";

import type { Unbonding } from "../../data";
import { MobileLabel } from "../mobile/MobileLabel";
import { UnbondingsTable } from "../tables";
import { TokenCell } from "../tables/TokenCell";
import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import { TableTitle } from "lib/components/table";
import { ValidatorBadge } from "lib/components/ValidatorBadge";
import type { Option } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

interface UnbondingTabProps {
  unbondings: Option<Unbonding[]>;
  isLoading: boolean;
}
export const UnbondingTab = ({
  unbondings,

  isLoading,
}: UnbondingTabProps) => {
  const isMobile = useMobile();
  if (isLoading) return <Loading />;
  if (!unbondings?.length)
    return (
      <Box>
        <TableTitle title="Unbonding" count={unbondings?.length ?? 0} />
        <EmptyState
          my={0}
          message="This account does not have any assets that is currently unbonding."
          withBorder
        />
      </Box>
    );

  return (
    <Flex w="full">
      {isMobile ? (
        <Flex direction="column" gap={4} w="full">
          <TableTitle
            title="Unbonding"
            count={unbondings?.length ?? 0}
            mb={2}
          />
          {unbondings.map((item) => (
            <Flex
              key={
                item.validator.validatorAddress +
                item.token.amount +
                item.token.denom
              }
              borderRadius="8px"
              background="gray.900"
              p={3}
              direction="column"
              gap={3}
              w="full"
            >
              <ValidatorBadge validator={item.validator} />
              <Flex
                direction="column"
                gap={3}
                borderTop="1px solid"
                borderTopColor="gray.700"
                pt={3}
              >
                <Flex direction="column" gap={1}>
                  <MobileLabel label="Amount" />
                  <TokenCell token={item.token} />
                </Flex>
                {item.completionTime && (
                  <Flex direction="column">
                    <MobileLabel label="Unbond Completed By" />
                    <Text variant="body2" color="text.dark" mt={1}>
                      {formatUTC(item.completionTime)}
                    </Text>
                    <Text variant="body3" color="text.disabled">
                      {`(${dateFromNow(item.completionTime)})`}
                    </Text>
                  </Flex>
                )}
              </Flex>
            </Flex>
          ))}
        </Flex>
      ) : (
        <UnbondingsTable unbondings={unbondings} isLoading={isLoading} />
      )}
    </Flex>
  );
};
