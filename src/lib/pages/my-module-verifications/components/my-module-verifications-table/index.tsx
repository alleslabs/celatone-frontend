/* eslint-disable react/button-has-type */
import { Box, Button, Grid, Stack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";

import { useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import InputWithIcon from "lib/components/InputWithIcon";
import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import { TableContainer } from "lib/components/table";
import type { MoveVerifyTaskStatus } from "lib/services/types";

import { MyModuleVerificationsTableHeader } from "./MyModuleVerificationsHeader";
import { MyModuleVerificationsRow } from "./MyModuleVerificationsRow";
import { useMyModuleVerifications } from "../../data";
import { MoveVerifyTaskStatusFilter } from "../MoveVerifyTaskStatusFilter";

export const MyModuleVerificationsTable = observer(() => {
  const navigate = useInternalNavigate();
  const [keyword, setKeyword] = useState("");
  const [statuses, setStatuses] = useState<MoveVerifyTaskStatus[]>([]);
  const { data, isLoading } = useMyModuleVerifications();

  const isFiltering = keyword.length > 0 || statuses.length > 0;

  const templateColumns = "repeat(3, 1fr) 200px 1.2fr";

  const filteredTasks = useMemo(
    () =>
      data
        ?.filter((task) =>
          task.taskId?.toLowerCase().includes(keyword.toLowerCase())
        )
        .filter((task) => {
          if (statuses.length === 0) return true;
          return statuses.includes(task.status);
        }),
    [data, keyword, statuses]
  );

  if (isLoading) return <Loading withBorder />;

  return (
    <Box>
      <Grid templateColumns="3fr 1.2fr" columnGap={4} my={6}>
        <InputWithIcon
          placeholder="Search with Request ID"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          amptrackSection="my-published-modules-search"
          size="lg"
        />
        <MoveVerifyTaskStatusFilter
          label="Filter by Status"
          result={statuses}
          setResult={setStatuses}
          placeholder="All status"
          isMulti
        />
      </Grid>

      {filteredTasks.length === 0 ? (
        <Stack alignItems="center">
          <EmptyState
            imageVariant={isFiltering ? "not-found" : "empty"}
            withBorder
            message={
              isFiltering
                ? `No past verification requests found.
Please submit a new verification request.`
                : `Your past submission for module verifications will display here`
            }
            py={10}
          >
            <Button
              onClick={() => navigate({ pathname: "/modules/verify" })}
              leftIcon={<CustomIcon name="plus" />}
            >
              Submit Verification
            </Button>
          </EmptyState>
        </Stack>
      ) : (
        <TableContainer pb={6}>
          <MyModuleVerificationsTableHeader templateColumns={templateColumns} />
          {filteredTasks.map((task) => (
            <MyModuleVerificationsRow
              key={task.taskId}
              templateColumns={templateColumns}
              task={task}
            />
          ))}
        </TableContainer>
      )}
    </Box>
  );
});
