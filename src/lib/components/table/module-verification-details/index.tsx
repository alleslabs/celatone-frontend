import type { MoveVerificationModuleIdentifier } from "lib/services/types";

import { Box, Grid, TableContainer } from "@chakra-ui/react";
import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { truncate } from "lib/utils";

import { TableHeader, TableRow } from "../tableComponents";

interface ModuleVerificationDetailsTableProps {
  moduleIdentifiers: MoveVerificationModuleIdentifier[];
}

export const ModuleVerificationDetailsTable = ({
  moduleIdentifiers,
}: ModuleVerificationDetailsTableProps) => {
  const navigate = useInternalNavigate();
  const templateColumns = "1fr";

  return (
    <TableContainer>
      <Grid minW="min-content" templateColumns={templateColumns}>
        <TableHeader>Module path</TableHeader>
      </Grid>
      {moduleIdentifiers.map(({ address, name }) => (
        <Box key={address + name} minW="min-content" w="full">
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
                  address,
                  moduleName: name,
                },
              })
            }
          >
            <TableRow>
              <ExplorerLink
                showCopyOnHover
                textFormat="normal"
                textLabel={`${truncate(address)}::${name}`}
                type="module_name"
                value={`${address}/${name}`}
              />
            </TableRow>
          </Grid>
        </Box>
      ))}
    </TableContainer>
  );
};
