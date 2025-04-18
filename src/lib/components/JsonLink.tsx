import { Flex, Text } from "@chakra-ui/react";

import { Copier } from "./copy";

interface JsonLinkProps {
  uri: string;
  type: string;
}

export const JsonLink = ({ type, uri }: JsonLinkProps) => (
  <Flex display="inline">
    <a data-peer href={uri} rel="noopener noreferrer" target="_blank">
      <Text
        _hover={{
          "& > p": { color: "primary.light" },
          textDecoration: "underline",
          textDecorationColor: "primary.light",
        }}
        color="primary.main"
        display="inline"
        fontWeight={500}
        variant="body2"
        wordBreak="break-all"
      >
        {uri}
      </Text>
    </a>
    <Copier
      copyLabel="Copied!"
      ml={{ base: 1, md: 2 }}
      type={type}
      value={uri}
    />
  </Flex>
);
