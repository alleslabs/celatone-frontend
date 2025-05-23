import { Heading, Stack, Text } from "@chakra-ui/react";
import { Breadcrumb } from "lib/components/Breadcrumb";

export const ModuleVerifyTop = () => (
  <Stack gap={6}>
    <Breadcrumb
      items={[
        {
          href: "/my-module-verifications",
          text: "Modules",
        },
        {
          text: "Verify modules",
        },
      ]}
    />
    <Stack gap={2}>
      <Heading as="h5" variant="h5">
        Verify modules
      </Heading>
      <Text color="text.dark" variant="body2">
        Verifying your module offers enhanced credibility with a verified badge.
        Once verified, users will able to access its source code in module
        details page.
      </Text>
    </Stack>
  </Stack>
);
