import { Flex, Heading } from "@chakra-ui/react";
import type Big from "big.js";

import { big } from "lib/types";
import type { Option, TokenWithValue, USD } from "lib/types";
import { formatPrice, totalValueTokenWithValue } from "lib/utils";

import { TotalCardTop } from "./TotalCardTop";

export interface OverviewCardProps {
  message: string;
  title: string;
  tokens: Option<Record<string, TokenWithValue>>;
}

export const OverviewCard = ({ message, title, tokens }: OverviewCardProps) => (
  <Flex gap={1} minW="233px" direction="column">
    <TotalCardTop message={message} title={title} fontWeight={600} />
    {!tokens ? (
      <Heading as="h6" variant="h6">
        N/A
      </Heading>
    ) : (
      <Heading as="h6" variant="h6">
        {formatPrice(totalValueTokenWithValue(tokens, big(0) as USD<Big>))}
      </Heading>
    )}
  </Flex>
);
