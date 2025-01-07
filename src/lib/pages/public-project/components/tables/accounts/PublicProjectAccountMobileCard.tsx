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
      middleContent={
        <Flex gap={3} direction="column">
          <Flex direction="column">
            <MobileLabel label="Address" variant="body2" />
            <Text variant="body2">{accountInfo.name}</Text>
          </Flex>
          <Flex direction="column">
            <MobileLabel label="Description" variant="body2" />
            <Text variant="body2" whiteSpace="break-spaces" color="text.dark">
              {accountInfo.description || "N/A"}
            </Text>
          </Flex>
        </Flex>
      }
      onClick={goToDetail}
      topContent={
        <Flex align="center" gap={2}>
          <MobileLabel label="Address" variant="body2" />
          <ExplorerLink
            type={
              accountInfo.type === "account"
                ? "user_address"
                : "contract_address"
            }
            value={accountInfo.address.toString()}
            showCopyOnHover
          />
        </Flex>
      }
    />
  );
};
