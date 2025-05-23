import { Box, ListItem, Stack, Text, UnorderedList } from "@chakra-ui/react";
import { useIsApiChain, useMoveConfig } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { EmptyState } from "lib/components/state";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { useMoveVerifyTaskStore } from "lib/providers/store";
import { MoveVerifyTaskStatus } from "lib/services/types";
import { useMoveVerifyTaskInfo } from "lib/services/verification/move";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";

import {
  MyModuleVerificationDetailsAlert,
  MyModuleVerificationDetailsFileMap,
  MyModuleVerificationDetailsInfo,
  MyModuleVerificationDetailsTable,
  MyModuleVerificationDetailsTop,
} from "./components";
import { zMyModuleVerificationDetailsQueryParams } from "./types";

const MyModuleVerificationDetailsBody = ({ taskId }: { taskId: string }) => {
  const { data, error, isLoading } = useMoveVerifyTaskInfo(taskId, !!taskId);
  const { getMoveVerifyTask } = useMoveVerifyTaskStore();
  const verifyModuleTask = getMoveVerifyTask(taskId);
  useIsApiChain({ shouldRedirect: true });
  useMoveConfig({ shouldRedirect: true });

  if (isLoading) return <Loading />;
  if (!data || error)
    return (
      <EmptyState
        heading="Task ID not found"
        imageVariant="not-found"
        message="Please double-check your input and make sure you have selected the correct network."
        withBorder
      />
    );

  if (data.task.status === MoveVerifyTaskStatus.NotFound && !verifyModuleTask)
    return (
      <EmptyState
        heading="Verification Details is Unavailable"
        imageVariant="not-found"
        message=""
        withBorder
      >
        <Box>
          <Text color="text.dark">
            We’re unable to access the page you requested due to one of the
            following possibilities:
          </Text>
          <UnorderedList color="text.dark">
            <ListItem ml={4}>The task ID does not existed</ListItem>
            <ListItem ml={4}>The wrong network was selected</ListItem>
            <ListItem ml={4}>
              This request has been submitted through another devices
            </ListItem>
          </UnorderedList>
        </Box>
      </EmptyState>
    );

  return (
    <>
      <Stack gap={8}>
        <MyModuleVerificationDetailsTop
          requestNote={verifyModuleTask?.requestNote}
          taskId={taskId}
        />
        <Stack gap={10}>
          <MyModuleVerificationDetailsInfo
            verifyTaskInfo={data}
            verifyTaskLocalInfo={verifyModuleTask}
          />
          <MyModuleVerificationDetailsAlert status={data.task.status} />
          {verifyModuleTask && (
            <MyModuleVerificationDetailsFileMap
              fileMap={verifyModuleTask.fileMap}
            />
          )}
          <MyModuleVerificationDetailsTable
            moduleIdentifiers={data.result?.moduleIdentifiers}
            moveVerifyTaskStatus={data.task.status}
          />
        </Stack>
      </Stack>
      <UserDocsLink
        cta="Read more about Move Module Verification"
        href="initia/move/module-verification"
      />
    </>
  );
};

export const MyModuleVerificationDetails = observer(() => {
  const router = useRouter();
  const validated = zMyModuleVerificationDetailsQueryParams.safeParse(
    router.query
  );

  return (
    <PageContainer>
      <CelatoneSeo pageName="My module verification details" />
      {!validated.success ? (
        <EmptyState
          heading="Task ID not found"
          imageVariant="not-found"
          message="Please double-check your input and make sure you have selected the correct network."
          withBorder
        />
      ) : (
        <MyModuleVerificationDetailsBody {...validated.data} />
      )}
    </PageContainer>
  );
});
