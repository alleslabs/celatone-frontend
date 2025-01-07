import { Flex, Heading, Text, useDisclosure } from "@chakra-ui/react";
import big from "big.js";
import type Big from "big.js";

import { TotalCardModal } from "../TotalCardModal";
import { CustomIcon } from "lib/components/icon";
import type { BechAddr, TokenWithValue, USD } from "lib/types";
import { formatPrice, totalValueTokenWithValue } from "lib/utils";

interface SingleBondCardBodyMultiProps {
  address: BechAddr;
  message: string;
  title: string;
  tokens: Record<string, TokenWithValue>;
}

export const SingleBondCardBodyMulti = ({
  address,
  message,
  title,
  tokens,
}: SingleBondCardBodyMultiProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <Heading as="h6" variant="h6">
        {formatPrice(totalValueTokenWithValue(tokens, big(0) as USD<Big>))}
      </Heading>
      <Flex
        align="center"
        gap={1}
        _hover={{
          "& > p": { color: "primary.light" },
          textDecoration: "underline",
          textDecorationColor: "primary.light",
        }}
        cursor="pointer"
        onClick={onOpen}
      >
        <Text
          variant="body2"
          color="primary.main"
          transition="all .25s ease-in-out"
        >
          View earned tokens
        </Text>
        <CustomIcon name="chevron-right" boxSize={4} color="primary.main" />
      </Flex>
      <TotalCardModal
        address={address}
        isOpen={isOpen}
        message={message}
        title={title}
        onClose={onClose}
        tokens={tokens}
      />
    </>
  );
};
