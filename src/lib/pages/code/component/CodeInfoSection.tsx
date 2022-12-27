import { Heading, Flex } from "@chakra-ui/react";

import { LabelText } from "lib/components/LabelText";

/**
 * @todos
 * - Make an interface
 * - Wireup with real data
 */

export const CodeInfoSection = () => {
  return (
    <>
      <Heading as="h6" variant="h6" mb={6}>
        Code Information
      </Heading>
      <Flex justify="space-between" mb={12}>
        <LabelText label="Network">phoenix-1</LabelText>
      </Flex>
    </>
  );
};
