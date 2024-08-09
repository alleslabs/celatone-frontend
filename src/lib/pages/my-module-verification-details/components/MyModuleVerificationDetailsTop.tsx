import { Flex, Heading, Stack, Text } from "@chakra-ui/react";

import { Breadcrumb } from "lib/components/Breadcrumb";
import { CopyLink } from "lib/components/CopyLink";
import { CustomIcon } from "lib/components/icon";

interface MyModuleVerificationDetailsTopProps {
  taskId: string;
}

export const MyModuleVerificationDetailsTop = ({
  taskId,
}: MyModuleVerificationDetailsTopProps) => (
  <Stack gap={6}>
    <Breadcrumb
      items={[
        {
          text: "My Past Verification",
          href: "/my-module-verifications",
        },
        {
          text: taskId,
        },
      ]}
    />
    <Stack gap={2}>
      <Flex alignItems="center" gap={2}>
        <CustomIcon
          name="contract-address"
          boxSize={6}
          color="secondary.main"
        />
        <Heading as="h5" variant="h5">
          Verification Details
        </Heading>
      </Flex>
      <Flex gap={1}>
        <Text variant="body2" color="text.dark">
          Request ID:
        </Text>
        <CopyLink
          value={taskId}
          amptrackSection="my_module_verification_details_top"
          type="my_module_verification_details_path"
          showCopyOnHover
        />
      </Flex>
      <Flex gap={1}>
        <Text variant="body2" color="text.dark">
          Request note:
        </Text>
        <Text variant="body2">Lorem Ipsum</Text>
      </Flex>
    </Stack>
  </Stack>
);
