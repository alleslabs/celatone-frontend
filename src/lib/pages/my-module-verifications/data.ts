import { useMoveVerifyTaskStore } from "lib/providers/store";
import { MoveVerifyTaskStatus } from "lib/services/types";
import { useMoveVerifyTaskInfos } from "lib/services/verification/move";
import type { MoveVerifyTaskLocalInfo } from "lib/stores/verify-module";

export type MoveVerifyTaskInfo = MoveVerifyTaskLocalInfo & {
  status: MoveVerifyTaskStatus;
};

export const useMyModuleVerifications = (): {
  isLoading: boolean;
  data: MoveVerifyTaskInfo[];
} => {
  const { latestMoveVerifyTasks, completeMoveVerifyTask } =
    useMoveVerifyTaskStore();
  const localTasks = latestMoveVerifyTasks();
  const { data, isLoading } = useMoveVerifyTaskInfos(
    localTasks
      .filter(({ completed }) => !completed)
      .map((module) => module.taskId),
    (tasks) => {
      tasks?.forEach(({ task, result }) => {
        if (
          task.status === MoveVerifyTaskStatus.Finished ||
          task.status === MoveVerifyTaskStatus.NotFound
        ) {
          completeMoveVerifyTask(task.id, result?.verifiedAt);
        }
      });
    }
  );

  return {
    isLoading,
    data: localTasks.map((task) => {
      if (task.completed) {
        return {
          ...task,
          status: task.verifiedAt
            ? MoveVerifyTaskStatus.Finished
            : MoveVerifyTaskStatus.NotFound,
        };
      }

      const fetchedTaskInfo = data?.find(
        (info) => info.task.id === task.taskId
      );

      return {
        ...task,
        status: fetchedTaskInfo?.task.status ?? MoveVerifyTaskStatus.NotFound,
      };
    }),
  };
};
