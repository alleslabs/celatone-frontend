import { Button, Flex, Grid, Text } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableRow } from "lib/components/table";
import type { PublicModule } from "lib/types";
import { truncate } from "lib/utils";

interface ModuleTableRowProps {
  module: PublicModule;
  templateColumns: string;
}

export const PublicProjectModuleRow = ({
  module,
  templateColumns,
}: ModuleTableRowProps) => {
  const navigate = useInternalNavigate();
  const goToDetail = () => {
    navigate({
      options: {
        shallow: true,
      },
      pathname: "/modules/[address]/[moduleName]/[tab]",
      query: {
        address: module.address,
        moduleName: module.name,
        tab: "overview",
      },
      replace: true,
    });
  };

  return (
    <Grid
      minW="min-content"
      _hover={{ bg: "gray.900" }}
      cursor="pointer"
      onClick={goToDetail}
      templateColumns={templateColumns}
      transition="all 0.25s ease-in-out"
    >
      <TableRow>
        <Text
          _hover={{
            "& > p": { color: "primary.light" },
            textDecoration: "underline",
            textDecorationColor: "primary.light",
          }}
          color="primary.main"
          cursor="pointer"
          onClick={goToDetail}
          transition="all 0.25s ease-in-out"
        >
          {truncate(module.address)}::{module.name}
        </Text>
      </TableRow>
      <TableRow>
        <ExplorerLink
          type="user_address"
          value={module.address}
          showCopyOnHover
        />
      </TableRow>
      <TableRow>
        <Text variant="body2" whiteSpace="break-spaces" color="text.dark">
          {module.description || "N/A"}
        </Text>
      </TableRow>
      <TableRow>
        <Flex gap={2} onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant="outline-white"
            onClick={() =>
              navigate({
                pathname: "/interact",
                query: {
                  address: module.address,
                  functionType: "view",
                  moduleName: module.name,
                },
              })
            }
          >
            View
          </Button>
          <Button
            size="sm"
            variant="outline-white"
            onClick={() =>
              navigate({
                pathname: "/interact",
                query: {
                  address: module.address,
                  functionType: "execute",
                  moduleName: module.name,
                },
              })
            }
          >
            Execute
          </Button>
        </Flex>
      </TableRow>
    </Grid>
  );
};
