import type { GridProps } from "@chakra-ui/react";

import { Flex, Grid, Text } from "@chakra-ui/react";
import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableRow } from "lib/components/table";
import { MyModuleVerificationDetailsStatusBadge } from "lib/pages/my-module-verification-details/components";
import { dateFromNow, formatUTC } from "lib/utils";

import type { MoveVerifyTaskInfo } from "../../data";

import { FileNamesCell } from "./FileNamesCell";
import { RequestNoteCell } from "./RequestNoteCell";

interface MyModuleVerificationsRowProps {
  task: MoveVerifyTaskInfo;
  templateColumns: GridProps["templateColumns"];
}

export const MyModuleVerificationsRow = ({
  task,
  templateColumns,
}: MyModuleVerificationsRowProps) => {
  const navigate = useInternalNavigate();

  return (
    <Grid
      _hover={{ bg: "gray.900" }}
      cursor="pointer"
      templateColumns={templateColumns}
      transition="all 0.25s ease-in-out"
      onClick={() =>
        navigate({
          pathname: "/my-module-verifications/[taskId]",
          query: { taskId: task.taskId },
        })
      }
    >
      <TableRow>
        <ExplorerLink showCopyOnHover type="task_id" value={task.taskId} />
      </TableRow>
      <TableRow>
        <RequestNoteCell moveVerifyTask={task} />
      </TableRow>
      <TableRow>
        <FileNamesCell task={task} />
      </TableRow>
      <TableRow>
        <MyModuleVerificationDetailsStatusBadge status={task.status} />
      </TableRow>
      <TableRow>
        {task.verifiedAt ? (
          <Flex direction="column">
            <Text color="text.dark" variant="body2">
              {formatUTC(task.verifiedAt)}
            </Text>
            <Text color="text.disabled" variant="body3">
              ({dateFromNow(task.verifiedAt)})
            </Text>
          </Flex>
        ) : (
          <Text color="text.disabled" variant="body2">
            -
          </Text>
        )}
      </TableRow>
    </Grid>
  );
};
