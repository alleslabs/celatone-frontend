import type { TabProps } from "@chakra-ui/react";
import {
  Button,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useMultiStyleConfig,
  useTab,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { useMobile } from "lib/app-provider";
import type { Delegation, Option, TokenWithValue, Unbonding } from "lib/types";

import { MultiBondsRadioCard } from "./radio-card/MultiBondsRadioCard";
import { SingleBondRadioCard } from "./radio-card/SingleBondRadioCard";
import { DelegationsTable, UnbondingsTable } from "../table";

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

const getPanelStyle = ({ isMobile }: { isMobile: boolean }) => ({
  background: isMobile ? "transparent" : "gray.900",
  border: isMobile ? undefined : "1px solid var(--chakra-colors-gray-700)",
  borderRadius: "8px",
  p: isMobile ? 0 : 6,
});

interface DelegationTabProps extends TabProps {
  value: string;
  tokens: Option<Record<string, TokenWithValue>>;
  isLoading: boolean;
  bondDenoms: TokenWithValue[];
}

const DelegationTab = ({
  isDisabled,
  value,
  tokens,
  isLoading,
  bondDenoms,
  ...restProps
}: DelegationTabProps) => {
  const tabProps = useTab({ ...restProps });
  const styles = useMultiStyleConfig("Tabs", tabProps);

  return (
    <Button
      __css={styles.tab}
      display="flex"
      w="full"
      mb={0}
      py={3}
      borderRadius="8px 8px 0px 0px"
      color="text.main"
      sx={{
        "&[aria-selected=true]": {
          background: "gray.800",
          border: "1px solid",
          borderColor: "gray.700",
          opacity: "100%",
          borderBottomColor: "gray.800",
        },
        "&[aria-selected=false]": {
          background: "transparent",
          border: "1px solid",
          borderColor: "gray.700",
          opacity: "70%",
          borderBottomColor: "transparent",
        },
      }}
      isDisabled={isDisabled}
      _active={{
        bg: "unset",
      }}
      {...tabProps}
    >
      {bondDenoms.length === 1 ? (
        <SingleBondRadioCard
          value={value}
          token={
            tokens ? (tokens[bondDenoms[0].denom] ?? bondDenoms[0]) : undefined
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
    </Button>
  );
};

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
  const [, setValue] = useState("Delegated");

  useEffect(() => {
    setValue("Delegated");
  }, [router.query.accountAddress]);

  const isMobile = useMobile();

  return (
    <Tabs isLazy lazyBehavior="keepMounted" mt={6} w="full">
      <TabList borderBottom="0px solid" gap={2}>
        <DelegationTab
          tokens={totalDelegations}
          isLoading={isDelegationsLoading}
          bondDenoms={bondDenoms}
          value="Delegated"
        />
        <DelegationTab
          value="Unbonding"
          tokens={totalUnbondings}
          isLoading={isUnbondingsLoading}
          bondDenoms={bondDenoms}
        />
      </TabList>
      <TabPanels
        background="gray.800"
        border="1px solid"
        borderColor="gray.700"
        borderTopColor="transparent"
        borderRadius="0px 0px 8px 8px"
        p={4}
      >
        <TabPanel {...getPanelStyle({ isMobile })}>
          <DelegationsTable
            delegations={delegations}
            rewards={rewards}
            isLoading={isDelegationsLoading}
            isSingleBondDenom={bondDenoms.length === 1}
          />
        </TabPanel>
        <TabPanel {...getPanelStyle({ isMobile })}>
          <UnbondingsTable
            unbondings={unbondings}
            isLoading={isUnbondingsLoading}
            isSingleBondDenom={bondDenoms.length === 1}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
