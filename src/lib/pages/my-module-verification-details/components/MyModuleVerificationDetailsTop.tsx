import { Flex, Heading, Stack, Text } from "@chakra-ui/react";

import { Breadcrumb } from "lib/components/Breadcrumb";
import { CopyLink } from "lib/components/CopyLink";
import { CustomIcon } from "lib/components/icon";
import type { Option } from "lib/types";

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
          text: "My past verification",
          href: "/my-module-verifications",
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
        <Text variant="body2">{requestNote ?? "-"}</Text>
      </Flex>
    </Stack>
  </Stack>
);
