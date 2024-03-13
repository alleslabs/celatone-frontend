import { Flex, Heading } from "@chakra-ui/react";

import { ValidatorImage } from "./ValidatorImage";
import { ValidatorStatusTag } from "./ValidatorStatusTag";
import { WebsiteButton } from "./WebsiteButton";

export const ValidatorTitle = () => (
  <Flex gap={4} alignItems={{ base: "center", md: "auto" }}>
    <ValidatorImage boxSize={16} display={{ base: "flex", md: "none" }} />
    <Flex
      w="full"
      direction={{ base: "column", md: "row" }}
      justifyContent={{ md: "space-between" }}
      alignItems={{ base: "start", md: "center" }}
    >
      <Flex align="center" gap={2}>
        <Heading
          as="h5"
          mt={{ base: 1, md: 0 }}
          ml={{ base: 1, md: 0 }}
          variant={{ base: "h6", md: "h5" }}
          color="accent.main"
        >
          #111
        </Heading>
        <Heading
          as="h5"
          variant="h5"
          wordBreak="break-word"
          color="text.main"
          display={{ base: "none", md: "flex" }}
        >
          Validator name
        </Heading>
        <ValidatorStatusTag status="Active" />
      </Flex>
      <Heading
        as="h6"
        variant="h6"
        mt={1}
        wordBreak="break-word"
        color="text.main"
        display={{ base: "flex", md: "none" }}
      >
        Validator name
      </Heading>
      <WebsiteButton display={{ base: "none", md: "flex" }} />
    </Flex>
  </Flex>
);
