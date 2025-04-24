import type { Control } from "react-hook-form";

import {
  Badge,
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useCelatoneApp, useInternalNavigate } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { CustomIcon } from "lib/components/icon";
import { useWatch } from "react-hook-form";

import type { ModuleVerifyForm } from "../types";

interface ModuleVerifySuccessModalProps {
  control: Control<ModuleVerifyForm>;
  onClose: () => void;
}

export const ModuleVerifySuccessModal = ({
  control,
  onClose,
}: ModuleVerifySuccessModalProps) => {
  const navigate = useInternalNavigate();
  const { currentChainId } = useCelatoneApp();

  const [taskId, requestNote, moveFiles] = useWatch({
    control,
    name: ["taskId", "requestNote", "moveFiles"],
  });

  return (
    <>
      <ModalHeader w="full">
        <ModalCloseButton color="gray.600" />
        <Stack alignItems="center" gap={4} w="100%">
          <CustomIcon
            boxSize={14}
            color="success.main"
            name="check-circle-solid"
          />
          <Heading variant="h5">Submitted verification!</Heading>
        </Stack>
      </ModalHeader>
      <ModalBody overflow="overlay">
        <Stack gap={4}>
          <Stack border="1px" borderColor="gray.700" p={4} rounded={8}>
            <Grid gridTemplateColumns="160px 1fr" rowGap={2}>
              <Text color="text.dark" fontWeight={500} variant="body2">
                Network
              </Text>
              <Text variant="body2">{currentChainId}</Text>
              <Text color="text.dark" fontWeight={500} variant="body2">
                Request ID
              </Text>
              <AppLink
                color="primary.main"
                href={`/my-module-verifications/${taskId}`}
              >
                {taskId}
              </AppLink>
              <Text color="text.dark" fontWeight={500} variant="body2">
                Request note
              </Text>
              <Text variant="body2">{requestNote ?? "-"}</Text>
            </Grid>
            <Divider />
            <Stack gap={1}>
              <Flex alignItems="center" gap={1}>
                <Text color="text.dark" fontWeight={500} variant="body2">
                  Uploading .move files
                </Text>
                <Badge>{moveFiles.length}</Badge>
              </Flex>
              <Text variant="body2">
                {moveFiles.map((file) => file.name).join(", ")}
              </Text>
            </Stack>
          </Stack>
          <Text color="text.dark" textAlign="center" variant="body2">
            Your verification request will be stored locally on your device.{" "}
          </Text>
        </Stack>
      </ModalBody>
      <ModalFooter gap={4} pb={0}>
        <Button variant="outline-primary" w="full" onClick={onClose}>
          Close
        </Button>
        <Button
          variant="primary"
          w="full"
          onClick={() => navigate({ pathname: "/my-module-verifications" })}
        >
          See my past verifications
        </Button>
      </ModalFooter>
    </>
  );
};
