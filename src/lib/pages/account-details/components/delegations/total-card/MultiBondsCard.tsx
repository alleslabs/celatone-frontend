import { Flex, Heading, Text, useDisclosure } from "@chakra-ui/react";
import type { Big } from "big.js";
import big from "big.js";
import plur from "plur";

import { CustomIcon } from "lib/components/icon";
import type { Addr, Option, TokenWithValue, USD } from "lib/types";
import { formatPrice, totalValueTokenWithValue } from "lib/utils";

import { TotalCardModal } from "./TotalCardModal";
import { TotalCardTop } from "./TotalCardTop";

interface MultiBondsCardProps {
  title: string;
  message: string;
  address: Addr;
  tokens: Option<Record<string, TokenWithValue>>;
}

export const MultiBondsCard = ({
  title,
  message,
  address,
  tokens,
}: MultiBondsCardProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isDisabled = !tokens;
  const numTokens = tokens ? Object.entries(tokens).length : 0;
  return (
    <Flex
      aria-disabled={!isDisabled}
      minW="233px"
      bgColor="gray.900"
      borderRadius="8px"
      cursor="pointer"
      _hover={{ bgColor: "gray.700" }}
      transition="all .25s ease-in-out"
      _disabled={{
        bgColor: "gray.900",
        cursor: "not-allowed",
      }}
      onClick={!isDisabled ? onOpen : undefined}
    >
      <Flex direction="column" gap={1}>
        <TotalCardTop title={title} message={message} fontWeight={500} />
        {!tokens ? (
          <Heading variant="h6" as="h6">
            N/A
          </Heading>
        ) : (
          <>
            <Heading variant="h6" as="h6">
              {formatPrice(
                totalValueTokenWithValue(tokens, big(0) as USD<Big>)
              )}
            </Heading>
            <Text variant="body2" color="text.dark">
              ({`${numTokens} ${plur("token", numTokens)}`})
            </Text>
            <TotalCardModal
              title={title}
              message={message}
              address={address}
              tokens={tokens}
              isOpen={isOpen}
              onClose={onClose}
            />
          </>
        )}
      </Flex>
      <CustomIcon name="chevron-right" boxSize={5} color="secondary.main" />
    </Flex>
  );
};
