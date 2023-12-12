import { Box, Button, Flex, Text } from "@chakra-ui/react";

import { MobileCardTemplate } from "../MobileCardTemplate";
import { MobileLabel } from "../MobileLabel";
import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { ModuleInfo } from "lib/types";
import {
  bech32AddressToHex,
  dateFromNow,
  formatUTC,
  truncate,
} from "lib/utils";

interface ModulesTableMobileCardProps {
  moduleInfo: ModuleInfo;
}

export const ModulesTableMobileCard = ({
  moduleInfo,
}: ModulesTableMobileCardProps) => {
  const navigate = useInternalNavigate();

  const hex = bech32AddressToHex(moduleInfo.address);
  const modulePath = `${truncate(hex)}::${moduleInfo.name}`;
  return (
    <MobileCardTemplate
      onClick={() =>
        navigate({
          pathname: "/modules/[address]/[moduleName]/overview",
          query: {
            address: moduleInfo.address,
            moduleName: moduleInfo.name,
          },
        })
      }
      topContent={
        <Flex w="100%" justifyContent="space-between">
          <Box>
            <MobileLabel label="Module Path" />
            <Text
              color="secondary.main"
              wordBreak={{ base: "break-all", md: "inherit" }}
            >
              {modulePath}
            </Text>
          </Box>

          <Button
            variant="outline-white"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate({
                pathname: "/interact",
                query: {
                  address: hex,
                  moduleName: moduleInfo.name,
                  functionType: "view",
                },
              });
            }}
          >
            View
          </Button>
        </Flex>
      }
      middleContent={
        <Flex direction="column" gap={3}>
          <Flex direction="column">
            <MobileLabel label="owner" />
            <ExplorerLink
              value={moduleInfo.address}
              type="user_address"
              showCopyOnHover
            />
          </Flex>
          <Flex direction="column">
            <Text variant="body3">{formatUTC(moduleInfo.latestUpdated)}</Text>
            <Text variant="body3" color="text.dark">
              {`(${dateFromNow(moduleInfo.latestUpdated)})`}
            </Text>
          </Flex>
        </Flex>
      }
    />
  );
};
