import type { PublicAccountInfo } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { MobileCardTemplate, MobileLabel } from "lib/components/table";

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
        <Flex direction="column" gap={3}>
          <Flex direction="column">
            <MobileLabel label="Address" variant="body2" />
            <Text variant="body2">{accountInfo.name}</Text>
          </Flex>
          <Flex direction="column">
            <MobileLabel label="Description" variant="body2" />
            <Text color="text.dark" variant="body2" whiteSpace="break-spaces">
              {accountInfo.description || "N/A"}
            </Text>
          </Flex>
        </Flex>
      }
      topContent={
        <Flex align="center" gap={2}>
          <MobileLabel label="Address" variant="body2" />
          <ExplorerLink
            showCopyOnHover
            type={
              accountInfo.type === "account"
                ? "user_address"
                : "contract_address"
            }
            value={accountInfo.address.toString()}
          />
        </Flex>
      }
      onClick={goToDetail}
    />
  );
};
