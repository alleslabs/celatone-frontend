import { Stack } from "@chakra-ui/react";

import { EmptyState } from "lib/components/state";
import { TableTitle } from "lib/components/table";
import { ModuleVerificationDetailsTable } from "lib/components/table/module-verification-details";
import type { MoveVerificationModuleIdentifier } from "lib/services/types";
import { MoveVerifyTaskStatus } from "lib/services/types";
import type { Option } from "lib/types";

interface MyModuleVerificationDetailsTableProps {
  status: MoveVerifyTaskStatus;
  moduleIdentifiers: Option<MoveVerificationModuleIdentifier[]>;
}

export const MyModuleVerificationDetailsTable = ({
  status,
  moduleIdentifiers = [],
}: MyModuleVerificationDetailsTableProps) => (
  <Stack gap={2}>
    <TableTitle title="Verified Modules" count={0} my={0} />
    {!moduleIdentifiers.length ? (
      <EmptyState
        message={
          status === MoveVerifyTaskStatus.NotFound
            ? "Due to failed verification, there are no modules verified from this request."
            : "List of verified modules will display after the modules are verified."
        }
        withBorder
        my={0}
      />
    ) : (
      <ModuleVerificationDetailsTable moduleIdentifiers={moduleIdentifiers} />
    )}
  </Stack>
);
