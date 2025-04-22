import type { MoveVerifyInfoResponse } from "lib/services/types";
import type { ModuleInfo, Option } from "lib/types";

import { Box, Button, Flex, Grid, Tag, Text } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CountBadge } from "lib/components/module";
import { useFormatAddresses } from "lib/hooks/useFormatAddresses";
import { dateFromNow, formatUTC, resolveMoveVerifyStatus } from "lib/utils";

import { TableRow } from "../tableComponents";
import { ModulePathLink } from "./ModulePathLink";

interface ModulesTableRowProps {
  isPublishedModules: boolean;
  moduleInfo: ModuleInfo;
  moveVerifyInfo: Option<MoveVerifyInfoResponse>;
  templateColumns: string;
}

export const ModulesTableRow = ({
  isPublishedModules,
  moduleInfo,
  moveVerifyInfo,
  templateColumns,
}: ModulesTableRowProps) => {
  const navigate = useInternalNavigate();
  const formatAddresses = useFormatAddresses();
  const { address: creator } = formatAddresses(moduleInfo.address);

  const moveVerifyStatus = resolveMoveVerifyStatus(
    moduleInfo.digest,
    moveVerifyInfo?.digest
  );

  return (
    <Box minW="min-content" w="full">
      <Grid
        className="copier-wrapper"
        _hover={{ background: "gray.900" }}
        cursor="pointer"
        templateColumns={templateColumns}
        transition="all 0.25s ease-in-out"
        onClick={() =>
          navigate({
            pathname: "/modules/[address]/[moduleName]",
            query: {
              address: moduleInfo.address,
              moduleName: moduleInfo.moduleName,
            },
          })
        }
      >
        <TableRow>
          <ModulePathLink
            hexAddr={moduleInfo.address}
            moduleName={moduleInfo.moduleName}
            moveVerifyStatus={moveVerifyStatus}
          />
        </TableRow>
        {isPublishedModules && (
          <>
            <TableRow>
              <Text>{moduleInfo.moduleName}</Text>
            </TableRow>
            <TableRow>
              <Flex gap={1} justifyContent="center" w="full">
                <CountBadge
                  count={moduleInfo.viewFunctions?.length}
                  variant="view"
                />
                <CountBadge
                  count={moduleInfo.executeFunctions?.length}
                  variant="execute"
                />
              </Flex>
            </TableRow>
          </>
        )}
        <TableRow>
          <ExplorerLink showCopyOnHover type="user_address" value={creator} />
        </TableRow>
        {!isPublishedModules && (
          <>
            <TableRow>
              <Tag
                variant={moduleInfo.isRepublished ? "primary-light" : "gray"}
              >
                {moduleInfo.isRepublished ? "Republish" : "Publish"}
              </Tag>
            </TableRow>
            <TableRow>
              <Flex direction="column" gap={1}>
                {moduleInfo.latestUpdated ? (
                  <>
                    <Text variant="body3">
                      {formatUTC(moduleInfo.latestUpdated)}
                    </Text>
                    <Text color="text.dark" variant="body3">
                      {`(${dateFromNow(moduleInfo.latestUpdated)})`}
                    </Text>
                  </>
                ) : (
                  <Text variant="body3">N/A</Text>
                )}
              </Flex>
            </TableRow>
          </>
        )}
        <TableRow>
          <Flex gap="8px" justifyContent="end" w="full">
            <Button
              size="sm"
              variant="outline-white"
              onClick={(e) => {
                track(AmpEvent.USE_MODULE_TABLE_CTA, { label: "view" });
                e.stopPropagation();
                navigate({
                  pathname: "/interact",
                  query: {
                    address: moduleInfo.address,
                    functionType: "view",
                    moduleName: moduleInfo.moduleName,
                  },
                });
              }}
            >
              View
            </Button>
            <Button
              size="sm"
              variant="outline-white"
              onClick={(e) => {
                track(AmpEvent.USE_MODULE_TABLE_CTA, { label: "execute" });
                e.stopPropagation();
                navigate({
                  pathname: "/interact",
                  query: {
                    address: moduleInfo.address,
                    functionType: "execute",
                    moduleName: moduleInfo.moduleName,
                  },
                });
              }}
            >
              Execute
            </Button>
            {isPublishedModules && (
              <Button
                size="sm"
                variant="outline-white"
                onClick={(e) => {
                  track(AmpEvent.USE_MODULE_TABLE_CTA, { label: "republish" });
                  e.stopPropagation();
                  navigate({
                    pathname: "/publish-module",
                  });
                }}
              >
                Republish
              </Button>
            )}
          </Flex>
        </TableRow>
      </Grid>
    </Box>
  );
};
