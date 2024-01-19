import { Flex, Text } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { MobileCardTemplate, MobileLabel } from "lib/components/table";
import type { PublicAccountInfo } from "lib/types";

import { getNavigationArgs } from "./utils";

interface PublicProjectAccountMobileCardProps {
  accountInfo: PublicAccountInfo;
}
export const PublicProjectAccountMobileCard = ({
  accountInfo,
}: PublicProjectAccountMobileCardProps) => {
  const navigate = useInternalNavigate();
  const goToDetail = () => {
    navigate(getNavigationArgs(accountInfo));
  };

  return (
    <MobileCardTemplate
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
