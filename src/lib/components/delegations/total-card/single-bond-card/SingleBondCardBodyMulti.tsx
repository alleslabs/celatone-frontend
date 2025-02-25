import { Flex, Heading, Text, useDisclosure } from "@chakra-ui/react";
import big from "big.js";
import type Big from "big.js";

import { CustomIcon } from "lib/components/icon";
import type { BechAddr, TokenWithValue, USD } from "lib/types";
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
      <Heading variant="h6" as="h6">
        {formatPrice(totalValueTokenWithValue(tokens, big(0) as USD<Big>))}
      </Heading>
      <Flex
        gap={1}
        align="center"
        cursor="pointer"
        _hover={{
          textDecoration: "underline",
          textDecorationColor: "primary.light",
          "& > p": { color: "primary.light" },
        }}
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
        title={title}
        message={message}
        address={address}
        tokens={tokens}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
};
