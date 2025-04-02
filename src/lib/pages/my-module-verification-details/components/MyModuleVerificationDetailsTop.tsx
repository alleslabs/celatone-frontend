import type { Option } from "lib/types";

import { Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { CopyLink } from "lib/components/CopyLink";
import { CustomIcon } from "lib/components/icon";

interface MyModuleVerificationDetailsTopProps {
  taskId: string;
  requestNote: Option<string>;
}

export const MyModuleVerificationDetailsTop = ({
  taskId,
  requestNote,
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
        <CustomIcon boxSize={6} color="primary.main" name="contract-address" />
        <Heading as="h5" variant="h5">
          Verification Details
        </Heading>
      </Flex>
      <Flex gap={1}>
        <Text color="text.dark" variant="body2">
          Request ID:
        </Text>
        <CopyLink
          amptrackSection="my_module_verification_details_top"
          showCopyOnHover
          type="my_module_verification_details_path"
          value={taskId}
        />
      </Flex>
      <Flex gap={1}>
        <Text color="text.dark" variant="body2">
          Request note:
        </Text>
        <Text variant="body2">{requestNote ?? "-"}</Text>
      </Flex>
    </Stack>
  </Stack>
);
