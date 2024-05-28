import { Flex, Heading } from "@chakra-ui/react";

import { ModuleTxsTableLite } from "./ModuleTxsTableLite";

const tableHeaderId = "moduleDetailsTableHeader";

export const ModuleTablesLite = () => {
  return (
    <Flex flexDirection="column" mt={6}>
      <Heading as="h6" variant="h6" mb={6} fontWeight={600} id={tableHeaderId}>
        Transactions
      </Heading>
      <ModuleTxsTableLite />
    </Flex>
  );
};
