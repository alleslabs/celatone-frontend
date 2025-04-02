import type { PublicModule } from "lib/types";

import { Button, Flex, Grid, Text } from "@chakra-ui/react";
import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableRow } from "lib/components/table";
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
      _hover={{ bg: "gray.900" }}
      cursor="pointer"
      minW="min-content"
      templateColumns={templateColumns}
      transition="all 0.25s ease-in-out"
      onClick={goToDetail}
    >
      <TableRow>
        <Text
          _hover={{
            textDecoration: "underline",
            textDecorationColor: "primary.light",
            "& > p": { color: "primary.light" },
          }}
          color="primary.main"
          cursor="pointer"
          transition="all 0.25s ease-in-out"
          onClick={goToDetail}
        >
          {truncate(module.address)}::{module.name}
        </Text>
      </TableRow>
      <TableRow>
        <ExplorerLink
          showCopyOnHover
          type="user_address"
          value={module.address}
        />
      </TableRow>
      <TableRow>
        <Text color="text.dark" variant="body2" whiteSpace="break-spaces">
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
                  moduleName: module.name,
                  functionType: "view",
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
