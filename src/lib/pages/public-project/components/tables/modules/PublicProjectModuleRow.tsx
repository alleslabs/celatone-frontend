import { Button, Grid, Text } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableRow } from "lib/components/table";
import type { Module } from "lib/types/projects";
import { truncate } from "lib/utils";

interface ModuleTableRowProps {
  module: Module;
  templateColumns: string;
}

export const PublicProjectModuleRow = ({
  module,
  templateColumns,
}: ModuleTableRowProps) => {
  const navigate = useInternalNavigate();

  const goToModuleDetails = () => {
    navigate({
      pathname: "/modules/[address]/[moduleName]/[tab]",
      query: {
        address: module.address,
        moduleName: module.name,
        tab: "overview",
      },
    });
  };

  return (
    <Grid
      templateColumns={templateColumns}
      onClick={goToModuleDetails}
      _hover={{ bg: "gray.900" }}
      transition="all 0.25s ease-in-out"
      cursor="pointer"
      minW="min-content"
    >
      <TableRow>
        <Text
          onClick={goToModuleDetails}
          color="primary.main"
          _hover={{
            textDecoration: "underline",
            textDecorationColor: "primary.light",
            "& > p": { color: "primary.light" },
          }}
          cursor="pointer"
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
        <Text color="text.dark">{module.description}</Text>
      </TableRow>
      {/* TODO check validity */}
      <TableRow gap={2}>
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
      </TableRow>
    </Grid>
  );
};
