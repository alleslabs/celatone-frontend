import { Stack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";

import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { EmptyState } from "lib/components/state";
import { useVerifyModuleTaskStore } from "lib/providers/store";
import { useMoveVerifyTaskInfo } from "lib/services/verification/move";

import {
  MyModuleVerificationDetailsAlert,
  MyModuleVerificationDetailsFileMap,
  MyModuleVerificationDetailsInfo,
  MyModuleVerificationDetailsTable,
  MyModuleVerificationDetailsTop,
} from "./components";

const MyModuleVerificationDetailsBody = ({ taskId }: { taskId: string }) => {
  const { data, isLoading, error } = useMoveVerifyTaskInfo(taskId, !!taskId);
  const { getVerifyModuleTask } = useVerifyModuleTaskStore();
  const verifyModuleTask = getVerifyModuleTask(taskId);

  if (isLoading) return <Loading />;
  if (!data || error || !verifyModuleTask)
    return (
      <EmptyState
        imageVariant="not-found"
        heading="Task ID Not Found"
        message="Please double-check your input and make sure you have selected the correct network."
        withBorder
      />
    );

  return (
    <>
      <Stack gap={8}>
        <MyModuleVerificationDetailsTop
          taskId={taskId}
          requestNote={verifyModuleTask.requestNote}
        />
        <Stack gap={10}>
          <MyModuleVerificationDetailsInfo
            chainId={verifyModuleTask.chainId}
            status={data.task.status}
            verifiedAt={data.result?.verifiedAt}
          />
          <MyModuleVerificationDetailsAlert status={data.task.status} />
          <MyModuleVerificationDetailsFileMap
            fileMap={verifyModuleTask.fileMap}
          />
          <MyModuleVerificationDetailsTable
            moduleIdentifiers={data.result?.moduleIdentifiers}
            status={data.task.status}
          />
        </Stack>
      </Stack>
      {/* // TODO: Open when the link is ready */}
      {/* <UserDocsLink cta="Read more about Move Module Verification" href="#" /> */}
    </>
  );
};

export const MyModuleVerificationDetails = observer(() => {
  const router = useRouter();
  const taskId = router.query.taskId as string;

  return (
    <PageContainer>
      <CelatoneSeo pageName="My Module Verification Details" />
      <MyModuleVerificationDetailsBody taskId={taskId} />
    </PageContainer>
  );
});
