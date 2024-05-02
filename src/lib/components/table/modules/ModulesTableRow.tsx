import { Box, Button, Flex, Grid, Tag, Text } from "@chakra-ui/react";

import { TableRow } from "../tableComponents";
import { AmpEvent, track } from "lib/amplitude";
import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CountBadge } from "lib/components/module";
import type { ModuleInfo } from "lib/types";
import {
  bech32AddressToHex,
  dateFromNow,
  formatUTC,
  unpadHexAddress,
} from "lib/utils";

import { ModulePathLink } from "./ModulePathLink";

interface ModulesTableRowProps {
  moduleInfo: ModuleInfo;
  templateColumns: string;
  isPublishedModules: boolean;
}

export const ModulesTableRow = ({
  moduleInfo,
  templateColumns,
  isPublishedModules,
}: ModulesTableRowProps) => {
  const navigate = useInternalNavigate();
  const hex = unpadHexAddress(bech32AddressToHex(moduleInfo.address));

  return (
    <Box w="full" minW="min-content">
      <Grid
        className="copier-wrapper"
        templateColumns={templateColumns}
        cursor="pointer"
        _hover={{ background: "gray.900" }}
        transition="all 0.25s ease-in-out"
        onClick={() =>
          navigate({
            pathname: "/modules/[address]/[moduleName]",
            query: {
              address: hex,
              moduleName: moduleInfo.name,
            },
          })
        }
      >
        <TableRow>
          <ModulePathLink hexAddr={hex} moduleName={moduleInfo.name} />
        </TableRow>
        {isPublishedModules && (
          <>
            <TableRow>
              <Text>{moduleInfo.name}</Text>
            </TableRow>
            <TableRow>
              <Flex gap={1} justifyContent="center" w="full">
                <CountBadge count={moduleInfo.functions?.view} variant="view" />
                <CountBadge
                  count={moduleInfo.functions?.execute}
                  variant="execute"
                />
              </Flex>
            </TableRow>
          </>
        )}
        <TableRow>
          <ExplorerLink
            value={moduleInfo.address}
            type="user_address"
            showCopyOnHover
          />
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
                    <Text variant="body3" color="text.dark">
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
          <Flex gap="8px" w="full" justifyContent="end">
            <Button
              variant="outline-white"
              size="sm"
              onClick={(e) => {
                track(AmpEvent.USE_MODULE_TABLE_CTA, { label: "view" });
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
            <Button
              variant="outline-white"
              size="sm"
              onClick={(e) => {
                track(AmpEvent.USE_MODULE_TABLE_CTA, { label: "execute" });
                e.stopPropagation();
                navigate({
                  pathname: "/interact",
                  query: {
                    address: hex,
                    moduleName: moduleInfo.name,
                    functionType: "execute",
                  },
                });
              }}
            >
              Execute
            </Button>
            {isPublishedModules && (
              <Button
                variant="outline-white"
                size="sm"
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
