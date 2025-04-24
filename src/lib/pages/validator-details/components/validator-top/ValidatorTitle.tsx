import type { ValidatorData } from "lib/types";

import { Flex, Heading } from "@chakra-ui/react";
import { ValidatorImage } from "lib/components/ValidatorImage";

import { ValidatorStatusTag } from "./ValidatorStatusTag";
import { WebsiteButton } from "./WebsiteButton";

interface ValidatorTitleProps {
  info: ValidatorData;
}

export const ValidatorTitle = ({ info }: ValidatorTitleProps) => (
  <Flex alignItems={{ base: "center", md: "auto" }} gap={4}>
    <Flex display={{ base: "flex", md: "none" }}>
      <ValidatorImage boxSize={16} validator={info} />
    </Flex>
    <Flex
      alignItems={{ base: "start", md: "center" }}
      direction={{ base: "column", md: "row" }}
      justifyContent={{ md: "space-between" }}
      w="full"
    >
      <Flex align="center" gap={2}>
        {info.rank && (
          <Heading
            as="h5"
            color="primary.main"
            ml={{ base: 1, md: 0 }}
            mt={{ base: 1, md: 0 }}
            variant={{ base: "h6", md: "h5" }}
          >
            #{info.rank}
          </Heading>
        )}
        <Heading
          as="h5"
          color={info.moniker.length ? "text.main" : "text.disabled"}
          display={{ base: "none", md: "flex" }}
          variant="h5"
          wordBreak="break-word"
        >
          {info.moniker || "Untitled validator"}
        </Heading>
        <ValidatorStatusTag info={info} />
      </Flex>
      <Heading
        as="h6"
        color={info.moniker.length ? "text.main" : "text.disabled"}
        display={{ base: "flex", md: "none" }}
        mt={1}
        variant="h6"
        wordBreak="break-word"
      >
        {info.moniker || "Untitled validator"}
      </Heading>
      <WebsiteButton
        display={{ base: "none", md: "flex" }}
        href={info.website}
      />
    </Flex>
  </Flex>
);
