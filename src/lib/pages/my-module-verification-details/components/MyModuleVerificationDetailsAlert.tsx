import {
  Alert,
  AlertDescription,
  AlertTitle,
  Flex,
  Stack,
  Text,
} from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
import { UserDocButton } from "lib/components/UserDocsLink";
import { MoveVerifyTaskStatus } from "lib/services/types";

interface MyModuleVerificationDetailsAlertBannerProps {
  status: MoveVerifyTaskStatus;
}

export const MyModuleVerificationDetailsAlert = ({
  status,
}: MyModuleVerificationDetailsAlertBannerProps) => {
  if (status === MoveVerifyTaskStatus.Pending)
    return (
      <Alert variant="info-left-secondary" alignItems="center" py={0}>
        <AlertDescription wordBreak="break-word">
          There are{" "}
          <Text as="span" fontWeight={700}>
            requests ahead
          </Text>{" "}
          in the queue. Once this request reaches the front, it will enter the
          module verification process.
          <br />
          Please wait while we complete these steps. Thank you for your
          patience.
        </AlertDescription>
      </Alert>
    );

  if (status === MoveVerifyTaskStatus.Running)
    return (
      <Alert variant="info-left-secondary" alignItems="center" py={0}>
        <AlertDescription wordBreak="break-word">
          The request is now in progress with the module verification process.
        </AlertDescription>
      </Alert>
    );

  if (status === MoveVerifyTaskStatus.NotFound)
    return (
      <Alert variant="error">
        <Flex gap={3} flexGrow={1}>
          <CustomIcon name="info-circle" color="error.main" boxSize={4} />
          <Stack gap={1}>
            <AlertTitle>Verification Failed</AlertTitle>
            <AlertDescription wordBreak="break-word">
              Please ensure that you upload folder that store files in the
              correct format and provide required information according to the
              guideline
            </AlertDescription>
          </Stack>
        </Flex>
        <UserDocButton
          size="sm"
          variant="errorDark"
          minW="unset"
          title="View Verification Guideline"
          href="initia/move/module-verification"
          isDevTool
        />
      </Alert>
    );

  return null;
};
