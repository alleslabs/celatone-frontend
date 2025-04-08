import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Flex,
  ListItem,
  Stack,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { DEVELOPER_TOOL_DOCS_LINK } from "lib/data";
import { MoveVerifyTaskStatus } from "lib/services/types";

interface MyModuleVerificationDetailsAlertBannerProps {
  status: MoveVerifyTaskStatus;
}

export const MyModuleVerificationDetailsAlert = ({
  status,
}: MyModuleVerificationDetailsAlertBannerProps) => {
  const navigate = useInternalNavigate();
  if (status === MoveVerifyTaskStatus.Pending)
    return (
      <Alert alignItems="center" py={0} variant="info-left-secondary">
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
      <Alert alignItems="center" py={0} variant="info-left-secondary">
        <AlertDescription wordBreak="break-word">
          The request is now in progress with the module verification process.
        </AlertDescription>
      </Alert>
    );

  if (status === MoveVerifyTaskStatus.NotFound)
    return (
      <Alert variant="error">
        <Flex flexGrow={1} gap={3}>
          <CustomIcon boxSize={4} color="error.main" name="info-circle" />
          <Stack gap={1}>
            <AlertTitle>Verification failed</AlertTitle>
            <AlertDescription wordBreak="break-word" whiteSpace="pre-line">
              There are common problems that lead to verification failures,
              including:
              <UnorderedList>
                <ListItem ml={4}>
                  {`Files structured in the wrong format, such as .move files not placed in the \u2018sources\u2019 folder or nested in other folders.`}
                </ListItem>
                <ListItem ml={4}>
                  Uploaded .move files that call functions from other .move
                  files which were not uploaded.
                </ListItem>
                <ListItem ml={4}>
                  Verifying modules that are not published or have unmatched
                  codes.
                </ListItem>
              </UnorderedList>
              For more details to ensure the correctness of the process, please
              refer to the{" "}
              <a
                style={{ textDecoration: "underline" }}
                href={`${DEVELOPER_TOOL_DOCS_LINK}/initia/move/module-verification`}
                rel="noopener noreferrer"
                target="_blank"
              >
                verification guideline.{" "}
              </a>
            </AlertDescription>
          </Stack>
        </Flex>
        <Button
          _hover={{
            backdropFilter: "brightness(130%)",
          }}
          minW="fit-content"
          variant="ghost-error"
          onClick={() =>
            navigate({
              pathname: "/modules/verify",
            })
          }
        >
          Resubmit verification
        </Button>
      </Alert>
    );

  return null;
};
