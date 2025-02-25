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
import { useWatch } from "react-hook-form";
import type { Control } from "react-hook-form";

import { useCelatoneApp, useInternalNavigate } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { CustomIcon } from "lib/components/icon";
import type { ModuleVerifyForm } from "../types";

interface ModuleVerifySuccessModalProps {
  onClose: () => void;
  control: Control<ModuleVerifyForm>;
}

export const ModuleVerifySuccessModal = ({
  onClose,
  control,
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
            name="check-circle-solid"
            color="success.main"
            boxSize={14}
          />
          <Heading variant="h5">Submitted Verification!</Heading>
        </Stack>
      </ModalHeader>
      <ModalBody overflow="overlay">
        <Stack gap={4}>
          <Stack rounded={8} border="1px" borderColor="gray.700" p={4}>
            <Grid gridTemplateColumns="160px 1fr" rowGap={2}>
              <Text variant="body2" fontWeight={500} color="text.dark">
                Network
              </Text>
              <Text variant="body2">{currentChainId}</Text>
              <Text variant="body2" fontWeight={500} color="text.dark">
                Request ID
              </Text>
              <AppLink
                color="primary.main"
                href={`/my-module-verifications/${taskId}`}
              >
                {taskId}
              </AppLink>
              <Text variant="body2" fontWeight={500} color="text.dark">
                Request Note
              </Text>
              <Text variant="body2">{requestNote ?? "-"}</Text>
            </Grid>
            <Divider />
            <Stack gap={1}>
              <Flex gap={1} alignItems="center">
                <Text variant="body2" fontWeight={500} color="text.dark">
                  Uploading .move files
                </Text>
                <Badge>{moveFiles.length}</Badge>
              </Flex>
              <Text variant="body2">
                {moveFiles.map((file) => file.name).join(", ")}
              </Text>
            </Stack>
          </Stack>
          <Text variant="body2" color="text.dark" textAlign="center">
            Your verification request will be stored locally on your device.{" "}
          </Text>
        </Stack>
      </ModalBody>
      <ModalFooter pb={0} gap={4}>
        <Button variant="outline-primary" onClick={onClose} w="full">
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => navigate({ pathname: "/my-module-verifications" })}
          w="full"
        >
          See My Past Verifications
        </Button>
      </ModalFooter>
    </>
  );
};
