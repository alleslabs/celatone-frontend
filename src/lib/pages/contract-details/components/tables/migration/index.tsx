import { Flex } from "@chakra-ui/react";

import { MigrationHeader } from "./MigrationHeader";
import { MigrationRow } from "./MigrationRow";

export const MigrationTable = () => {
  return (
    <Flex direction="column" overflowX="scroll">
      <MigrationHeader />
      <MigrationRow />
      <MigrationRow />
      <MigrationRow />
      <MigrationRow />
      <MigrationRow />
    </Flex>
  );
};
