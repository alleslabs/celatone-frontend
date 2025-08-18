import type { MoveVerifyInfoResponse } from "lib/services/types";
import type { ModuleInfo, Option } from "lib/types";

import { Flex, Grid, Tag, Text } from "@chakra-ui/react";
import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { MoveVerifyBadge } from "lib/components/MoveVerifyBadge";
import { useFormatAddresses } from "lib/hooks/useFormatAddresses";
import {
  dateFromNow,
  formatUTC,
  resolveMoveVerifyStatus,
  truncate,
} from "lib/utils";

import { MobileCardTemplate } from "../MobileCardTemplate";
import { MobileLabel } from "../MobileLabel";

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
        <Flex direction="column" gap={3}>
          <Grid templateColumns="repeat(2, 1fr)">
            <Flex direction="column">
              <MobileLabel label="creator" />
              <ExplorerLink
                showCopyOnHover
                type="user_address"
                value={creator}
              />
            </Flex>
            <Flex direction="column" gap={1}>
              <MobileLabel label="Action" />
              <Tag
                variant={moduleInfo.isRepublished ? "primary-light" : "gray"}
                width="fit-content"
              >
                {moduleInfo.isRepublished ? "Republish" : "Publish"}
              </Tag>
            </Flex>
          </Grid>
          {moduleInfo.latestUpdated && (
            <Flex direction="column">
              <Text variant="body3">{formatUTC(moduleInfo.latestUpdated)}</Text>
              <Text color="text.dark" variant="body3">
                {`(${dateFromNow(moduleInfo.latestUpdated)})`}
              </Text>
            </Flex>
          )}
        </Flex>
      }
      topContent={
        <Flex direction="column">
          <MobileLabel label="Module path" />
          <ExplorerLink
            rightIcon={
              moveVerifyStatus && (
                <MoveVerifyBadge hasTooltip status={moveVerifyStatus} />
              )
            }
            showCopyOnHover
            textFormat="normal"
            textLabel={`${truncate(moduleInfo.address)}::${moduleInfo.moduleName}`}
            type="module_name"
            value={`${moduleInfo.address}/${moduleInfo.moduleName}`}
          />
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
    />
  );
};
