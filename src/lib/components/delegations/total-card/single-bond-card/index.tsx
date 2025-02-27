import { Flex, Heading } from "@chakra-ui/react";

import type { BechAddr, Option, TokenWithValue } from "lib/types";

import { SingleBondCardBody } from "./SingleBondCardBody";
import { TotalCardTop } from "../TotalCardTop";

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
  <Flex direction="column" minW="233px" gap={1}>
    <TotalCardTop title={title} message={message} fontWeight={600} />
    {!tokens ? (
      <Heading variant="h6" as="h6">
        N/A
      </Heading>
    ) : (
      <SingleBondCardBody
        title={title}
        message={message}
        address={address}
        bondDenom={bondDenom}
        tokens={tokens}
      />
    )}
  </Flex>
);
