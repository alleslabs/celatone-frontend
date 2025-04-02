import type Big from "big.js";
import type { Option, TokenWithValue, USD } from "lib/types";

import { Flex, Heading } from "@chakra-ui/react";
import { big } from "lib/types";
import { formatPrice, totalValueTokenWithValue } from "lib/utils";

import { TotalCardTop } from "./TotalCardTop";

export interface OverviewCardProps {
  title: string;
  message: string;
  tokens: Option<Record<string, TokenWithValue>>;
}

export const OverviewCard = ({ title, message, tokens }: OverviewCardProps) => (
  <Flex direction="column" gap={1} minW="233px">
    <TotalCardTop fontWeight={600} message={message} title={title} />
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
