import type Big from "big.js";
import type { BechAddr, Option, TokenWithValue, USD } from "lib/types";

import { Flex, Heading, Text, useDisclosure } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";
import { big } from "lib/types";
import { formatPrice, totalValueTokenWithValue } from "lib/utils";
import plur from "plur";

import { TotalCardModal } from "./TotalCardModal";
import { TotalCardTop } from "./TotalCardTop";

interface MultiBondsCardProps {
  title: string;
  message: string;
  address: BechAddr;
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
      _hover={{ bgColor: "gray.700" }}
      align="center"
      aria-disabled={isDisabled}
      bgColor="gray.900"
      borderRadius="8px"
      cursor="pointer"
      justify="space-between"
      minW="233px"
      p={4}
      transition="all .25s ease-in-out"
      onClick={!isDisabled ? onOpen : undefined}
    >
      <Flex direction="column" gap={1}>
        <TotalCardTop fontWeight={600} message={message} title={title} />
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
            <Text color="text.dark" variant="body2">
              ({`${numTokens} ${plur("token", numTokens)}`})
            </Text>
            <TotalCardModal
              address={address}
              isOpen={isOpen}
              message={message}
              title={title}
              tokens={tokens}
              onClose={onClose}
            />
          </>
        )}
      </Flex>
      <CustomIcon boxSize={4} color="gray.400" name="chevron-right" />
    </Flex>
  );
};
