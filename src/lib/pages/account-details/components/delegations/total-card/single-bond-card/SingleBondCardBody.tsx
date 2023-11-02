import big from "big.js";

import type { DenomInfo } from "lib/pages/account-details/types";
import type { Addr, TokenWithValue } from "lib/types";

import { SingleBondCardBodyMulti } from "./SingleBondCardBodyMulti";
import { SingleBondCardBodySingle } from "./SingleBondCardBodySingle";

interface SingleBondCardBodyProps {
  title: string;
  message: string;
  address: Addr;
  bondDenom: DenomInfo;
  tokens: Record<string, TokenWithValue>;
}

export const SingleBondCardBody = ({
  title,
  message,
  address,
  bondDenom,
  tokens,
}: SingleBondCardBodyProps) => {
  const denoms = Object.keys(tokens);
  if (
    denoms.length === 0 ||
    (denoms.length === 1 && denoms.includes(bondDenom.denom))
  ) {
    const bondToken = tokens[bondDenom.denom];
    return (
      <SingleBondCardBodySingle
        {...(bondToken ?? {
          denom: bondDenom.denom,
          amount: big(0),
          symbol: bondDenom.symbol,
          logo: bondDenom.logo,
          precision: bondDenom.precision,
          value: big(0),
        })}
      />
    );
  }

  return (
    <SingleBondCardBodyMulti
      title={title}
      message={message}
      address={address}
      tokens={tokens}
    />
  );
};
