import type { BechAddr, Option, TokenWithValue } from "lib/types";

import { Flex, Heading } from "@chakra-ui/react";

import { TotalCardTop } from "../TotalCardTop";
import { SingleBondCardBody } from "./SingleBondCardBody";

interface SingleBondCardProps {
  title: string;
  message: string;
  address: BechAddr;
  bondDenom: TokenWithValue;
  tokens: Option<Record<string, TokenWithValue>>;
}

export const SingleBondCard = ({
  title,
  message,
  address,
  bondDenom,
  tokens,
}: SingleBondCardProps) => (
  <Flex direction="column" gap={1} minW="233px">
    <TotalCardTop fontWeight={600} message={message} title={title} />
    {!tokens ? (
      <Heading as="h6" variant="h6">
        N/A
      </Heading>
    ) : (
      <SingleBondCardBody
        address={address}
        bondDenom={bondDenom}
        message={message}
        title={title}
        tokens={tokens}
      />
    )}
  </Flex>
);
