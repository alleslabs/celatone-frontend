import { Flex, Heading, Stack, Text } from "@chakra-ui/react";

import { Breadcrumb } from "lib/components/Breadcrumb";
import { CopyLink } from "lib/components/CopyLink";
import { CustomIcon } from "lib/components/icon";
import type { Option } from "lib/types";

interface MyModuleVerificationDetailsTopProps {
  requestNote: Option<string>;
  taskId: string;
}

export const MyModuleVerificationDetailsTop = ({
  requestNote,
  taskId,
}: MyModuleVerificationDetailsTopProps) => (
  <Stack gap={6}>
    <Breadcrumb
      items={[
        {
          href: "/my-module-verifications",
          text: "My Past Verification",
        },
        {
          text: taskId,
        },
      ]}
    />
    <Stack gap={2}>
      <Flex alignItems="center" gap={2}>
        <CustomIcon name="contract-address" boxSize={6} color="primary.main" />
        <Heading as="h5" variant="h5">
          Verification Details
        </Heading>
      </Flex>
      <Flex gap={1}>
        <Text variant="body2" color="text.dark">
          Request ID:
        </Text>
        <CopyLink
          type="my_module_verification_details_path"
          value={taskId}
          amptrackSection="my_module_verification_details_top"
          showCopyOnHover
        />
      </Flex>
      <Flex gap={1}>
        <Text variant="body2" color="text.dark">
          Request note:
        </Text>
        <Text variant="body2">{requestNote ?? "-"}</Text>
      </Flex>
    </Stack>
  </Stack>
);
