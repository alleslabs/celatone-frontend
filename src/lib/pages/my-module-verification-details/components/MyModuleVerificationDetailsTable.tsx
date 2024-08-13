import { Stack } from "@chakra-ui/react";

import { EmptyState } from "lib/components/state";
import { TableTitle } from "lib/components/table";
// import { ModuleVerificationDetailsTable } from "lib/components/table/module-verification-details";

export const MyModuleVerificationDetailsTable = () => (
  <Stack gap={2}>
    <TableTitle title="Verified Modules" count={0} my={0} />
    {/* <ModuleVerificationDetailsTable /> */}
    <EmptyState
      message="List of verified modules will display after the modules are verified."
      withBorder
      my={0}
    />
  </Stack>
);
