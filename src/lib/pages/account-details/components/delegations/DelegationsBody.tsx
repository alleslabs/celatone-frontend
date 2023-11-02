import { Flex, RadioGroup, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { DelegationsTable, UnbondingsTable } from "../tables";
import { useTrack } from "lib/amplitude";
import type { Delegation, Unbonding } from "lib/pages/account-details/data";
import type { Option, TokenWithValue } from "lib/types";

import { RadioCard } from "./radio-card";

interface DelegationsBodyProps {
  totalDelegations: Option<Record<string, TokenWithValue>>;
  delegations: Option<Delegation[]>;
  totalUnbondings: Option<Record<string, TokenWithValue>>;
  unbondings: Option<Unbonding[]>;
  rewards: Option<Record<string, TokenWithValue[]>>;
  isLoadingDelegations: boolean;
  isLoadingUnbondings: boolean;
  bondDenoms: TokenWithValue[];
}

export const DelegationsBody = ({
  totalDelegations,
  delegations,
  totalUnbondings,
  unbondings,
  rewards,
  isLoadingDelegations,
  isLoadingUnbondings,
  bondDenoms,
}: DelegationsBodyProps) => {
  // NOTE: set between "Delegated" and "Unbonding"
  const router = useRouter();
  const [value, setValue] = useState("Delegated");
  const { trackUseRadio } = useTrack();

  useEffect(() => {
    setValue("Delegated");
  }, [router.query.accountAddress]);

  return (
    <Flex direction="column" gap={8} p={8} borderRadius="8px" bg="gray.900">
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
            isLoading={isLoadingDelegations}
            bondDenoms={bondDenoms}
          />
          <RadioCard
            value="Unbonding"
            tokens={totalUnbondings}
            isLoading={isLoadingUnbondings}
            bondDenoms={bondDenoms}
          />
        </Stack>
      </RadioGroup>
      {value === "Delegated" ? (
        <DelegationsTable
          delegations={delegations}
          rewards={rewards}
          isLoading={isLoadingDelegations}
          isSingleBondDenom={bondDenoms.length === 1}
        />
      ) : (
        <UnbondingsTable
          unbondings={unbondings}
          isLoading={isLoadingUnbondings}
          isSingleBondDenom={bondDenoms.length === 1}
        />
      )}
    </Flex>
  );
};
