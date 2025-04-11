import type Big from "big.js";
import type { BechAddr, TokenWithValue, USD } from "lib/types";

import { Flex, Heading, Text, useDisclosure } from "@chakra-ui/react";
import big from "big.js";
import { CustomIcon } from "lib/components/icon";
import { formatPrice, totalValueTokenWithValue } from "lib/utils";

import { TotalCardModal } from "../TotalCardModal";

interface SingleBondCardBodyMultiProps {
  title: string;
  message: string;
  address: BechAddr;
  tokens: Record<string, TokenWithValue>;
}

export const SingleBondCardBodyMulti = ({
  title,
  message,
  address,
  tokens,
}: SingleBondCardBodyMultiProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Heading as="h6" variant="h6">
        {formatPrice(totalValueTokenWithValue(tokens, big(0) as USD<Big>))}
      </Heading>
      <Flex
        _hover={{
          textDecoration: "underline",
          textDecorationColor: "primary.light",
          "& > p": { color: "primary.light" },
        }}
        align="center"
        cursor="pointer"
        gap={1}
        onClick={onOpen}
      >
        <Text
          color="primary.main"
          transition="all .25s ease-in-out"
          variant="body2"
        >
          View earned tokens
        </Text>
        <CustomIcon boxSize={4} color="primary.main" name="chevron-right" />
      </Flex>
      <TotalCardModal
        address={address}
        isOpen={isOpen}
        message={message}
        title={title}
        tokens={tokens}
        onClose={onClose}
      />
    </>
  );
};
