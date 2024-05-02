import { Flex, Grid, Tag, Text } from "@chakra-ui/react";

import { MobileCardTemplate } from "../MobileCardTemplate";
import { MobileLabel } from "../MobileLabel";
import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { ModuleInfo } from "lib/types";
import {
  bech32AddressToHex,
  dateFromNow,
  formatUTC,
  unpadHexAddress,
} from "lib/utils";

import { ModulePathLink } from "./ModulePathLink";

interface ModulesTableMobileCardProps {
  moduleInfo: ModuleInfo;
}

export const ModulesTableMobileCard = ({
  moduleInfo,
}: ModulesTableMobileCardProps) => {
  const navigate = useInternalNavigate();

  const hex = unpadHexAddress(bech32AddressToHex(moduleInfo.address));
  return (
    <MobileCardTemplate
      onClick={() =>
        navigate({
          pathname: "/modules/[address]/[moduleName]",
          query: {
            address: hex,
            moduleName: moduleInfo.name,
          },
        })
      }
      topContent={
        <Flex direction="column">
          <MobileLabel label="Module Path" />
          <ModulePathLink hexAddr={hex} moduleName={moduleInfo.name} />
        </Flex>
      }
      middleContent={
        <Flex direction="column" gap={3}>
          <Grid templateColumns="repeat(2, 1fr)">
            <Flex direction="column">
              <MobileLabel label="owner" />
              <ExplorerLink
                value={moduleInfo.address}
                type="user_address"
                showCopyOnHover
              />
            </Flex>
            <Flex direction="column" gap={1}>
              <MobileLabel label="Action" />
              <Tag
                width="fit-content"
                variant={moduleInfo.isRepublished ? "primary-light" : "gray"}
              >
                {moduleInfo.isRepublished ? "Republish" : "Publish"}
              </Tag>
            </Flex>
          </Grid>
          {moduleInfo.latestUpdated && (
            <Flex direction="column">
              <Text variant="body3">{formatUTC(moduleInfo.latestUpdated)}</Text>
              <Text variant="body3" color="text.dark">
                {`(${dateFromNow(moduleInfo.latestUpdated)})`}
              </Text>
            </Flex>
          )}
        </Flex>
      }
    />
  );
};
