import { Flex, Grid, Text } from "@chakra-ui/react";
import type { GridProps } from "@chakra-ui/react";

import type { MoveVerifyTaskInfo } from "../../data";
import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableRow } from "lib/components/table";
import { MyModuleVerificationDetailsStatusBadge } from "lib/pages/my-module-verification-details/components";
import { dateFromNow, formatUTC } from "lib/utils";

import { FilenameCell } from "./Filenames";
import { RequestNoteCell } from "./RequestNoteCell";

interface MyModuleVerificationsRowProps {
  templateColumns: GridProps["templateColumns"];
  task: MoveVerifyTaskInfo;
}

export const MyModuleVerificationsRow = ({
  templateColumns,
  task,
}: MyModuleVerificationsRowProps) => {
  const navigate = useInternalNavigate();

  return (
    <Grid
      templateColumns={templateColumns}
      onClick={() =>
        navigate({
          pathname: "/my-module-verifications/[taskId]",
          query: { taskId: task.taskId },
        })
      }
      _hover={{ bg: "gray.900" }}
      transition="all 0.25s ease-in-out"
      cursor="pointer"
    >
      <TableRow>
        <ExplorerLink type="task_id" value={task.taskId} showCopyOnHover />
      </TableRow>
      <TableRow>
        <RequestNoteCell moveVerifyTask={task} />
      </TableRow>
      <TableRow>
        <FilenameCell task={task} />
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
          <Text>-</Text>
        )}
      </TableRow>
    </Grid>
  );
};
