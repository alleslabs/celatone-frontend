import { Flex, Text } from "@chakra-ui/react";

import { Copier } from "./copy";

interface JsonLinkProps {
  uri: string;
  type: string;
}

export const JsonLink = ({ uri, type }: JsonLinkProps) => (
  <Flex display="inline">
    <a href={uri} target="_blank" rel="noopener noreferrer" data-peer>
      <Text
        display="inline"
        color="primary.main"
        variant="body2"
        fontWeight={500}
        wordBreak="break-all"
        _hover={{
          textDecoration: "underline",
          textDecorationColor: "primary.light",
          "& > p": { color: "primary.light" },
        }}
      >
        {uri}
      </Text>
    </a>
    <Copier
      type={type}
      value={uri}
      copyLabel="Copied!"
      ml={{ base: 1, md: 2 }}
    />
  </Flex>
);
