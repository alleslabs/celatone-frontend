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
      replace: true,
      pathname: "/modules/[address]/[moduleName]/[tab]",
      query: {
        address: module.address,
        moduleName: module.name,
        tab: "overview",
      },
      options: {
        shallow: true,
      },
    });
  };

  return (
    <Grid
      templateColumns={templateColumns}
      onClick={goToDetail}
      _hover={{ bg: "gray.900" }}
      transition="all 0.25s ease-in-out"
      cursor="pointer"
      minW="min-content"
    >
      <TableRow>
        <Text
          onClick={goToDetail}
          color="primary.main"
          transition="all 0.25s ease-in-out"
          cursor="pointer"
          _hover={{
            textDecoration: "underline",
            textDecorationColor: "primary.light",
            "& > p": { color: "primary.light" },
          }}
        >
          {truncate(module.address)}::{module.name}
        </Text>
      </TableRow>
      <TableRow>
        <ExplorerLink
          value={module.address}
          type="user_address"
          showCopyOnHover
        />
      </TableRow>
      <TableRow>
        <Text variant="body2" color="text.dark" whiteSpace="break-spaces">
          {module.description || "N/A"}
        </Text>
      </TableRow>
      <TableRow>
        <Flex gap={2} onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline-white"
            size="sm"
            onClick={() =>
              navigate({
                pathname: "/interact",
                query: {
                  address: module.address,
                  moduleName: module.name,
                  functionType: "view",
                },
              })
            }
          >
            View
          </Button>
          <Button
            variant="outline-white"
            size="sm"
            onClick={() =>
              navigate({
                pathname: "/interact",
                query: {
                  address: module.address,
                  moduleName: module.name,
                  functionType: "execute",
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
