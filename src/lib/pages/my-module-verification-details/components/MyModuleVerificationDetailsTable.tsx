import { Stack } from "@chakra-ui/react";

import { EmptyState } from "lib/components/state";
import { TableTitle } from "lib/components/table";
import { ModuleVerificationDetailsTable } from "lib/components/table/module-verification-details";
import type { MoveVerificationModuleIdentifier } from "lib/services/types";
import { MoveVerifyTaskStatus } from "lib/services/types";
import type { Option } from "lib/types";

interface MyModuleVerificationDetailsTableProps {
  moduleIdentifiers: Option<MoveVerificationModuleIdentifier[]>;
  moveVerifyTaskStatus: MoveVerifyTaskStatus;
}

export const MyModuleVerificationDetailsTable = ({
  moduleIdentifiers = [],
  moveVerifyTaskStatus,
}: MyModuleVerificationDetailsTableProps) => (
  <Stack gap={2}>
    <TableTitle
      my={0}
      title="Verified Modules"
      count={moduleIdentifiers.length}
    />
    {!moduleIdentifiers.length ? (
      <EmptyState
        message={
          moveVerifyTaskStatus === MoveVerifyTaskStatus.NotFound
            ? "Due to failed verification, there are no modules verified from this request."
            : "List of verified modules will display after the modules are verified."
        }
        my={0}
        withBorder
      />
    ) : (
      <ModuleVerificationDetailsTable moduleIdentifiers={moduleIdentifiers} />
    )}
  </Stack>
);
