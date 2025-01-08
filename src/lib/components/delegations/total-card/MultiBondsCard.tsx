import { Flex, Heading, Text, useDisclosure } from "@chakra-ui/react";
import type Big from "big.js";
import plur from "plur";

import { CustomIcon } from "lib/components/icon";
import { big } from "lib/types";
import type { BechAddr, Option, TokenWithValue, USD } from "lib/types";
import { formatPrice, totalValueTokenWithValue } from "lib/utils";

import { TotalCardModal } from "./TotalCardModal";
import { TotalCardTop } from "./TotalCardTop";

interface MultiBondsCardProps {
  address: BechAddr;
  message: string;
  title: string;
  tokens: Option<Record<string, TokenWithValue>>;
}

export const MultiBondsCard = ({
  address,
  message,
  title,
  tokens,
}: MultiBondsCardProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const isDisabled = !tokens;
  const numTokens = tokens ? Object.entries(tokens).length : 0;
  return (
    <Flex
      _disabled={{
        bgColor: "gray.900",
        cursor: "not-allowed",
      }}
      align="center"
      aria-disabled={isDisabled}
      justify="space-between"
      minW="233px"
      p={4}
      _hover={{ bgColor: "gray.700" }}
      bgColor="gray.900"
      borderRadius="8px"
      cursor="pointer"
      onClick={!isDisabled ? onOpen : undefined}
      transition="all .25s ease-in-out"
    >
      <Flex gap={1} direction="column">
        <TotalCardTop message={message} title={title} fontWeight={600} />
        {!tokens ? (
          <Heading as="h6" variant="h6">
            N/A
          </Heading>
        ) : (
          <>
            <Heading as="h6" variant="h6">
              {formatPrice(
                totalValueTokenWithValue(tokens, big(0) as USD<Big>)
              )}
            </Heading>
            <Text variant="body2" color="text.dark">
              ({`${numTokens} ${plur("token", numTokens)}`})
            </Text>
            <TotalCardModal
              address={address}
              isOpen={isOpen}
              message={message}
              title={title}
              onClose={onClose}
              tokens={tokens}
            />
          </>
        )}
      </Flex>
      <CustomIcon name="chevron-right" boxSize={4} color="gray.400" />
    </Flex>
  );
};
