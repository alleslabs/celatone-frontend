import { Flex, Text, Grid, Box, Button } from "@chakra-ui/react";

import { TableRow } from "../tableComponents";
import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { ModuleInfo } from "lib/types";
import {
  bech32AddressToHex,
  dateFromNow,
  formatUTC,
  truncate,
} from "lib/utils";

interface ModulesTableRowProps {
  moduleInfo: ModuleInfo;
  templateColumns: string;
}

export const ModulesTableRow = ({
  moduleInfo,
  templateColumns,
}: ModulesTableRowProps) => {
  const navigate = useInternalNavigate();

  const hex = bech32AddressToHex(moduleInfo.address);
  const modulePath = `${truncate(hex)} :: ${moduleInfo.name}`;
  return (
    <Box w="full" minW="min-content">
      <Grid
        className="copier-wrapper"
        templateColumns={templateColumns}
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
          <Text
            color="secondary.main"
            transition="all 0.25s ease-in-out"
            _hover={{ color: "secondary.light", textDecoration: "underline" }}
            wordBreak={{ base: "break-all", md: "inherit" }}
            cursor="pointer"
          >
            {modulePath}
          </Text>
        </TableRow>
        <TableRow>
          <ExplorerLink
            value={moduleInfo.address}
            type="user_address"
            showCopyOnHover
          />
        </TableRow>
        <TableRow>
          <Flex direction="column" gap={1}>
            <Text variant="body3">{formatUTC(moduleInfo.latestUpdated)}</Text>
            <Text variant="body3" color="text.dark">
              {`(${dateFromNow(moduleInfo.latestUpdated)})`}
            </Text>
          </Flex>
        </TableRow>
        <TableRow>
          <Flex gap="8px">
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
                    functionType: "execute",
                  },
                });
              }}
            >
              Execute
            </Button>
          </Flex>
        </TableRow>
      </Grid>
    </Box>
  );
};
