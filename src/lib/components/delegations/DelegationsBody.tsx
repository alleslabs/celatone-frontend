import { Flex, RadioGroup, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { DelegationsTable, UnbondingsTable } from "../table";
import { trackUseRadio } from "lib/amplitude";
import type { Delegation, Option, TokenWithValue, Unbonding } from "lib/types";

import { RadioCard } from "./radio-card";

interface DelegationsBodyProps {
  totalDelegations: Option<Record<string, TokenWithValue>>;
  delegations: Option<Delegation[]>;
  totalUnbondings: Option<Record<string, TokenWithValue>>;
  unbondings: Option<Unbonding[]>;
  rewards: Option<Record<string, TokenWithValue[]>>;
  isDelegationsLoading: boolean;
  isUnbondingsLoading: boolean;
  bondDenoms: TokenWithValue[];
}

export const DelegationsBody = ({
  totalDelegations,
  delegations,
  totalUnbondings,
  unbondings,
  rewards,
  isDelegationsLoading,
  isUnbondingsLoading,
  bondDenoms,
}: DelegationsBodyProps) => {
  // NOTE: set between "Delegated" and "Unbonding"
  const router = useRouter();
  const [value, setValue] = useState("Delegated");

  useEffect(() => {
    setValue("Delegated");
  }, [router.query.accountAddress]);

  return (
    <Flex
      direction="column"
      gap={8}
      p={{ base: 4, md: 8 }}
      borderRadius="8px"
      bg="gray.900"
    >
      <RadioGroup
        onChange={(newValue) => {
          trackUseRadio(newValue.toLocaleLowerCase());
          setValue(newValue);
        }}
        value={value}
        overflowX="scroll"
      >
        <Stack direction={{ base: "column", md: "row" }}>
          <RadioCard
            value="Delegated"
            tokens={totalDelegations}
            isLoading={isDelegationsLoading}
            bondDenoms={bondDenoms}
          />
          <RadioCard
            value="Unbonding"
            tokens={totalUnbondings}
            isLoading={isUnbondingsLoading}
            bondDenoms={bondDenoms}
          />
        </Stack>
      </RadioGroup>
      {value === "Delegated" ? (
        <DelegationsTable
          delegations={delegations}
          rewards={rewards}
          isLoading={isDelegationsLoading}
          isSingleBondDenom={bondDenoms.length === 1}
        />
      ) : (
        <UnbondingsTable
          unbondings={unbondings}
          isLoading={isUnbondingsLoading}
          isSingleBondDenom={bondDenoms.length === 1}
        />
      )}
    </Flex>
  );
};
