import { Box, Grid, TableContainer } from "@chakra-ui/react";

import { ModulePathLink } from "../modules/ModulePathLink";
import { TableHeader, TableRow } from "../tableComponents";
import { useInternalNavigate } from "lib/app-provider";
import type { MoveVerificationModuleIdentifier } from "lib/services/types";

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
        <TableHeader>Module Path</TableHeader>
      </Grid>
      {moduleIdentifiers.map(({ address, name }) => (
        <Box key={address + name} minW="min-content" w="full">
          <Grid
            className="copier-wrapper"
            _hover={{ background: "gray.900" }}
            cursor="pointer"
            onClick={() =>
              navigate({
                pathname: "/modules/[address]/[moduleName]",
                query: {
                  address,
                  moduleName: name,
                },
              })
            }
            templateColumns={templateColumns}
            transition="all 0.25s ease-in-out"
          >
            <TableRow>
              <ModulePathLink hexAddr={address} moduleName={name} />
            </TableRow>
          </Grid>
        </Box>
      ))}
    </TableContainer>
  );
};
