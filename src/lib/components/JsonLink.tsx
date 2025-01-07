import { Flex, Text } from "@chakra-ui/react";

import { Copier } from "./copy";

interface JsonLinkProps {
  type: string;
  uri: string;
}

export const JsonLink = ({ type, uri }: JsonLinkProps) => (
  <Flex display="inline">
    <a data-peer rel="noopener noreferrer" target="_blank" href={uri}>
      <Text
        display="inline"
        variant="body2"
        _hover={{
          "& > p": { color: "primary.light" },
          textDecoration: "underline",
          textDecorationColor: "primary.light",
        }}
        color="primary.main"
        fontWeight={500}
        wordBreak="break-all"
      >
        {uri}
      </Text>
    </a>
    <Copier
      ml={{ base: 1, md: 2 }}
      type={type}
      value={uri}
      copyLabel="Copied!"
    />
  </Flex>
);
