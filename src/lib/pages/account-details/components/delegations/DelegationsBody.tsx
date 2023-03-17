import { Flex, RadioGroup, Stack } from "@chakra-ui/react";
import { useState } from "react";

import { DelegationsTable, UnbondingsTable } from "../tables";
import type { Delegation, Unbonding } from "lib/pages/account-details/data";
import type { TokenWithValue } from "lib/pages/account-details/type";
import { AmpTrackUseRadio } from "lib/services/amplitude";
import type { Option } from "lib/types";

import { RadioCard } from "./RadioCard";

interface DelegationsBodyProps {
  totalDelegations: Option<Record<string, TokenWithValue>>;
  delegations: Option<Delegation[]>;
  totalUnbondings: Option<Record<string, TokenWithValue>>;
  unbondings: Option<Unbonding[]>;
  rewards: Option<Record<string, TokenWithValue[]>>;
  defaultToken: TokenWithValue;
}

export const DelegationsBody = ({
  totalDelegations,
  delegations,
  totalUnbondings,
  unbondings,
  rewards,
  defaultToken,
}: DelegationsBodyProps) => {
  const [value, setValue] = useState("Delegated");

  return (
    <Flex direction="column" gap={8}>
      <RadioGroup
        onChange={(newValue) => {
          AmpTrackUseRadio(newValue.toLocaleLowerCase());
          setValue(newValue);
        }}
        value={value}
        overflowX="scroll"
      >
        <Stack direction="row">
          <RadioCard
            value="Delegated"
            total={totalDelegations}
            defaultToken={defaultToken}
          />
          <RadioCard
            value="Unbonding"
            total={totalUnbondings}
            defaultToken={defaultToken}
          />
        </Stack>
      </RadioGroup>
      {value === "Delegated" ? (
        <DelegationsTable
          delegations={delegations}
          rewards={rewards}
          defaultToken={defaultToken}
        />
      ) : (
        <UnbondingsTable unbondings={unbondings} />
      )}
    </Flex>
  );
};
