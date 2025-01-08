import { Flex, Heading } from "@chakra-ui/react";

import { TotalCardTop } from "../TotalCardTop";
import type { BechAddr, Option, TokenWithValue } from "lib/types";

import { SingleBondCardBody } from "./SingleBondCardBody";

interface SingleBondCardProps {
  address: BechAddr;
  bondDenom: TokenWithValue;
  message: string;
  title: string;
  tokens: Option<Record<string, TokenWithValue>>;
}

export const SingleBondCard = ({
  address,
  bondDenom,
  message,
  title,
  tokens,
}: SingleBondCardProps) => (
  <Flex gap={1} minW="233px" direction="column">
    <TotalCardTop message={message} title={title} fontWeight={600} />
    {!tokens ? (
      <Heading as="h6" variant="h6">
        N/A
      </Heading>
    ) : (
      <SingleBondCardBody
        address={address}
        message={message}
        title={title}
        bondDenom={bondDenom}
        tokens={tokens}
      />
    )}
  </Flex>
);
