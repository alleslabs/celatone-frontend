import { Flex, Grid, Text } from "@chakra-ui/react";
import type { GridProps } from "@chakra-ui/react";

import type { MoveVerifyTaskInfo } from "../../data";
import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableRow } from "lib/components/table";
import { MyModuleVerificationDetailsStatusBadge } from "lib/pages/my-module-verification-details/components";
import { dateFromNow, formatUTC } from "lib/utils";

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
      onClick={() =>
        navigate({
          pathname: "/my-module-verifications/[taskId]",
          query: { taskId: task.taskId },
        })
      }
      templateColumns={templateColumns}
      transition="all 0.25s ease-in-out"
    >
      <TableRow>
        <ExplorerLink type="task_id" value={task.taskId} showCopyOnHover />
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
            <Text variant="body2" color="text.dark">
              {formatUTC(task.verifiedAt)}
            </Text>
            <Text variant="body3" color="text.disabled">
              ({dateFromNow(task.verifiedAt)})
            </Text>
          </Flex>
        ) : (
          <Text variant="body2" color="text.disabled">
            -
          </Text>
        )}
      </TableRow>
    </Grid>
  );
};
