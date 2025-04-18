import { Box, Grid, TableContainer } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import type { MoveVerificationModuleIdentifier } from "lib/services/types";
import { ModulePathLink } from "../modules/ModulePathLink";
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
      <Grid templateColumns={templateColumns} minW="min-content">
        <TableHeader>Module path</TableHeader>
      </Grid>
      {moduleIdentifiers.map(({ name, address }) => (
        <Box w="full" minW="min-content" key={address + name}>
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
                  address,
                  moduleName: name,
                },
              })
            }
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
