import { Flex, Heading, Link } from "@chakra-ui/react";

import { ValidatorImage } from "lib/components/ValidatorImage";
import type { ValidatorData } from "lib/types";

import { ValidatorStatusTag } from "./ValidatorStatusTag";
import { WebsiteButton } from "./WebsiteButton";

interface ValidatorTitleProps {
  info: ValidatorData;
}

export const ValidatorTitle = ({ info }: ValidatorTitleProps) => (
  <Flex gap={4} alignItems={{ base: "center", md: "auto" }}>
    <Flex display={{ base: "flex", md: "none" }}>
      <ValidatorImage validator={info} boxSize={16} />
    </Flex>
    <Flex
      w="full"
      direction={{ base: "column", md: "row" }}
      justifyContent={{ md: "space-between" }}
      alignItems={{ base: "start", md: "center" }}
    >
      <Flex align="center" gap={2}>
        {info.rank && (
          <Heading
            as="h5"
            mt={{ base: 1, md: 0 }}
            ml={{ base: 1, md: 0 }}
            variant={{ base: "h6", md: "h5" }}
            color="accent.main"
          >
            #{info.rank}
          </Heading>
        )}
        <Heading
          as="h5"
          variant="h5"
          wordBreak="break-word"
          color="text.main"
          display={{ base: "none", md: "flex" }}
        >
          {info.moniker}
        </Heading>
        <ValidatorStatusTag info={info} />
      </Flex>
      <Heading
        as="h6"
        variant="h6"
        mt={1}
        wordBreak="break-word"
        color="text.main"
        display={{ base: "flex", md: "none" }}
      >
        {info.moniker}
      </Heading>
      <Link href={info.website} isExternal>
        <WebsiteButton display={{ base: "none", md: "flex" }} />
      </Link>
    </Flex>
  </Flex>
);
