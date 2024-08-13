import { Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { useMoveVerifyTaskInfo } from "lib/services/verification/move";

import {
  MyModuleVerificationDetailsAlert,
  MyModuleVerificationDetailsFilemap,
  MyModuleVerificationDetailsInfo,
  MyModuleVerificationDetailsTable,
  MyModuleVerificationDetailsTop,
} from "./components";

export const MyModuleVerificationDetails = () => {
  const router = useRouter();
  const taskId = router.query.taskId as string;
  const { data, isLoading, error } = useMoveVerifyTaskInfo(taskId, !!taskId);

  if (isLoading) return <Loading />;
  if (!data || error) return <div>Error</div>;

  return (
    <PageContainer>
      <CelatoneSeo pageName="My Module Verification Details" />
      <Stack gap={8}>
        <MyModuleVerificationDetailsTop taskId={taskId} />
        <Stack gap={10}>
          <MyModuleVerificationDetailsInfo
            chainId="initiation-1"
            status={data.task.status}
          />
          <MyModuleVerificationDetailsAlert status={data.task.status} />
          <MyModuleVerificationDetailsFilemap />
          <MyModuleVerificationDetailsTable />
        </Stack>
      </Stack>
      <UserDocsLink cta="Read more about Move Module Verification" href="#" />
    </PageContainer>
  );
};
