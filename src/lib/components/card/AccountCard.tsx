import { Flex, Text } from "@chakra-ui/react";

import { ExplorerLink } from "../ExplorerLink";
import { useInternalNavigate } from "lib/app-provider";
import { MobileLabel } from "lib/pages/account-details/components/mobile/MobileLabel";
import { getNavigationArgs } from "lib/pages/public-project/components/table/account/PublicProjectAccountRow";
import type { Account } from "lib/types";

import { DefaultMobileCard } from "./DefaultMobileCard";

interface AccountCardProps {
  accountInfo: Account;
}
export const AccountCard = ({ accountInfo }: AccountCardProps) => {
  const navigate = useInternalNavigate();
  const goToDetail = () => {
    navigate(getNavigationArgs(accountInfo));
  };

  return (
    <DefaultMobileCard
      onClick={goToDetail}
      topContent={
        <Flex gap={2} align="center">
          <MobileLabel variant="body2" label="Address" />
          <ExplorerLink
            value={accountInfo.address.toString()}
            type={
              accountInfo.type === "account"
                ? "user_address"
                : "contract_address"
            }
            showCopyOnHover
          />
        </Flex>
      }
      middleContent={
        <Flex direction="column" gap={3}>
          <Flex direction="column">
            <MobileLabel variant="body2" label="Address" />
            <Text variant="body2">{accountInfo.name}</Text>
          </Flex>
          <Flex direction="column">
            <MobileLabel variant="body2" label="Description" />
            <Text variant="body2" color="text.dark" whiteSpace="break-spaces">
              {accountInfo.description || "N/A"}
            </Text>
          </Flex>
        </Flex>
      }
    />
  );
};
