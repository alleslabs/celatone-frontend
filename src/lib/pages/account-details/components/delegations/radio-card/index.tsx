import { Radio } from "@chakra-ui/react";
import type { Big } from "big.js";
import big from "big.js";

import type { DenomInfo } from "lib/pages/account-details/types";
import type { Option, TokenWithValue, USD } from "lib/types";

import { MultiBondsRadioCard } from "./MultiBondsRadioCard";
import { SingleBondRadioCard } from "./SingleBondRadioCard";

interface RadioCardProps {
  value: string;
  tokens: Option<Record<string, TokenWithValue>>;
  isLoading: boolean;
  bondDenoms: DenomInfo[];
}

export const RadioCard = ({
  value,
  tokens,
  isLoading,
  bondDenoms,
}: RadioCardProps) => (
  <Radio variant="card" value={value} overflowX="hidden">
    {bondDenoms.length === 1 ? (
      <SingleBondRadioCard
        value={value}
        token={
          tokens
            ? Object.values(tokens)[0] ?? {
                ...bondDenoms[0],
                amount: 0,
                value: big(0) as USD<Big>,
              }
            : undefined
        }
        isLoading={isLoading}
      />
    ) : (
      <MultiBondsRadioCard
        value={value}
        tokens={tokens}
        isLoading={isLoading}
      />
    )}
  </Radio>
);
