import { Flex, Grid, Tag, Text } from "@chakra-ui/react";

import { MobileCardTemplate } from "../MobileCardTemplate";
import { MobileLabel } from "../MobileLabel";
import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { useFormatAddresses } from "lib/hooks/useFormatAddresses";
import type { MoveVerifyInfoResponse } from "lib/services/types";
import type { ModuleInfo, Option } from "lib/types";
import { dateFromNow, formatUTC, resolveMoveVerifyStatus } from "lib/utils";

import { ModulePathLink } from "./ModulePathLink";

interface ModulesTableMobileCardProps {
  moduleInfo: ModuleInfo;
  moveVerifyInfo: Option<MoveVerifyInfoResponse>;
}

export const ModulesTableMobileCard = ({
  moduleInfo,
  moveVerifyInfo,
}: ModulesTableMobileCardProps) => {
  const navigate = useInternalNavigate();
  const formatAddresses = useFormatAddresses();
  const { address: creator } = formatAddresses(moduleInfo.address);

  const moveVerifyStatus = resolveMoveVerifyStatus(
    moduleInfo.digest,
    moveVerifyInfo?.digest
  );

  return (
    <MobileCardTemplate
      middleContent={
        <Flex gap={3} direction="column">
          <Grid templateColumns="repeat(2, 1fr)">
            <Flex direction="column">
              <MobileLabel label="creator" />
              <ExplorerLink
                type="user_address"
                value={creator}
                showCopyOnHover
              />
            </Flex>
            <Flex gap={1} direction="column">
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
      onClick={() =>
        navigate({
          pathname: "/modules/[address]/[moduleName]",
          query: {
            address: moduleInfo.address,
            moduleName: moduleInfo.moduleName,
          },
        })
      }
      topContent={
        <Flex direction="column">
          <MobileLabel label="Module Path" />
          <ModulePathLink
            hexAddr={moduleInfo.address}
            moduleName={moduleInfo.moduleName}
            moveVerifyStatus={moveVerifyStatus}
          />
        </Flex>
      }
    />
  );
};
