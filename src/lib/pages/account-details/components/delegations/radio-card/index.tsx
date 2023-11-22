import { Radio } from "@chakra-ui/react";

import type { Option, TokenWithValue } from "lib/types";

import { MultiBondsRadioCard } from "./MultiBondsRadioCard";
import { SingleBondRadioCard } from "./SingleBondRadioCard";

interface RadioCardProps {
  value: string;
  tokens: Option<Record<string, TokenWithValue>>;
  isLoading: boolean;
  bondDenoms: TokenWithValue[];
}

export const RadioCard = ({
  value,
  tokens,
  isLoading,
  bondDenoms,
}: RadioCardProps) => (
  <Radio variant="gray-card" value={value} overflowX="hidden">
    {bondDenoms.length === 1 ? (
      <SingleBondRadioCard
        value={value}
        token={
          tokens ? tokens[bondDenoms[0].denom] ?? bondDenoms[0] : undefined
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
