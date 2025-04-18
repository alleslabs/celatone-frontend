import type { BechAddr, TokenWithValue } from "lib/types";

import { SingleBondCardBodyMulti } from "./SingleBondCardBodyMulti";
import { SingleBondCardBodySingle } from "./SingleBondCardBodySingle";

interface SingleBondCardBodyProps {
  title: string;
  message: string;
  address: BechAddr;
  bondDenom: TokenWithValue;
  tokens: Record<string, TokenWithValue>;
}

export const SingleBondCardBody = ({
  address,
  bondDenom,
  message,
  title,
  tokens,
}: SingleBondCardBodyProps) => {
  const denoms = Object.keys(tokens);
  if (
    denoms.length === 0 ||
    (denoms.length === 1 && denoms.includes(bondDenom.denom))
  )
    return (
      <SingleBondCardBodySingle token={tokens[bondDenom.denom] ?? bondDenom} />
    );

  return (
    <SingleBondCardBodyMulti
      address={address}
      message={message}
      title={title}
      tokens={tokens}
    />
  );
};
