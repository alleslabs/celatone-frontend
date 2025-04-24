import type { MoveVerifyTaskLocalInfo } from "lib/stores/verify-module";

import { useMoveVerifyTaskStore } from "lib/providers/store";
import { MoveVerifyTaskStatus } from "lib/services/types";
import { useMoveVerifyTaskInfos } from "lib/services/verification/move";

export type MoveVerifyTaskInfo = MoveVerifyTaskLocalInfo & {
  status: MoveVerifyTaskStatus;
};

export const useMyModuleVerifications = (): {
  data: MoveVerifyTaskInfo[];
  isLoading: boolean;
} => {
  const { completeMoveVerifyTask, getMoveVerifyTask, latestMoveVerifyTasks } =
    useMoveVerifyTaskStore();
  const localTasks = latestMoveVerifyTasks();
  const verificationInfos = useMoveVerifyTaskInfos(
    localTasks
      .filter(({ completed }) => !completed)
      .map((module) => module.taskId),
    ({ result, task }) => {
      // set as completed if the task is finished or the task is still not found and older than 10s
      const confirmationTime = 10 * 1000; // 10s
      const localTask = getMoveVerifyTask(task.id);
      const isOutdatedTask =
        task.status === MoveVerifyTaskStatus.NotFound &&
        localTask &&
        Date.now() - localTask.created.getTime() > confirmationTime;
      if (task.status === MoveVerifyTaskStatus.Finished || isOutdatedTask) {
        completeMoveVerifyTask(task.id, result?.verifiedAt);
      }
    }
  );

  return {
    data: localTasks.map((task) => {
      if (task.completed) {
        return {
          ...task,
          status: task.verifiedAt
            ? MoveVerifyTaskStatus.Finished
            : MoveVerifyTaskStatus.NotFound,
        };
      }

      const fetchedTaskInfo = verificationInfos
        ?.map(({ data }) => data)
        ?.find((verificationInfo) => verificationInfo?.task.id === task.taskId);

      return {
        ...task,
        status: fetchedTaskInfo?.task.status ?? MoveVerifyTaskStatus.NotFound,
      };
    }),
    isLoading: verificationInfos.some(
      (verificationInfo) => verificationInfo.isLoading
    ),
  };
};
