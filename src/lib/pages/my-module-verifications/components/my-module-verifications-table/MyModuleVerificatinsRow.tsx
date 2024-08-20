import { Flex, Grid, Text } from "@chakra-ui/react";
import type { GridProps } from "@chakra-ui/react";
import { useMemo } from "react";

import type { MoveVerifyTaskInfo } from "../../data";
import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableRow } from "lib/components/table";
import { MyModuleVerificationDetailsStatusBadge } from "lib/pages/my-module-verification-details/components";
import { dateFromNow, formatUTC } from "lib/utils";

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
  const formattedFiles = useMemo(() => {
    const files = Object.keys(task.fileMap)
      .filter((file) => !file.includes(".toml"))
      .map((file) => file.slice(0, -5)); // remove ".move" extension
    const firstPart = files.slice(0, 3).join(", ");
    const remaining = files.length - 3;

    // eslint-disable-next-line sonarjs/no-nested-template-literals
    return `${firstPart}${remaining > 0 ? `+${remaining}` : ""}`;
  }, [task.fileMap]);

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
        <ExplorerLink type="task_id" value={task.taskId} />
      </TableRow>
      <TableRow>
        <RequestNoteCell moveVerifyTask={task} />
      </TableRow>
      <TableRow>
        <Text>{formattedFiles}</Text>
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
