import type { TabProps } from "@chakra-ui/react";
import type { Delegation, Option, TokenWithValue, Unbonding } from "lib/types";

import {
  Button,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useMultiStyleConfig,
  useTab,
} from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { DelegationsTable, UnbondingsTable } from "../table";
import { MultiBondsRadioCard } from "./radio-card/MultiBondsRadioCard";
import { SingleBondRadioCard } from "./radio-card/SingleBondRadioCard";

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
  bondDenoms,
  isDisabled,
  isLoading,
  tokens,
  value,
  ...restProps
}: DelegationTabProps) => {
  const tabProps = useTab({ ...restProps });
  const styles = useMultiStyleConfig("Tabs", tabProps);

  return (
    <Button
      __css={styles.tab}
      _active={{
        bg: "unset",
      }}
      borderRadius="8px 8px 0px 0px"
      color="text.main"
      display="flex"
      isDisabled={isDisabled}
      mb={0}
      py={3}
      sx={{
        "&[aria-selected=false]": {
          background: "transparent",
          border: "1px solid",
          borderBottomColor: "transparent",
          borderColor: "gray.700",
          opacity: "70%",
        },
        "&[aria-selected=true]": {
          background: "gray.800",
          border: "1px solid",
          borderBottomColor: "gray.800",
          borderColor: "gray.700",
          opacity: "100%",
        },
      }}
      w="full"
      {...tabProps}
    >
      {bondDenoms.length === 1 ? (
        <SingleBondRadioCard
          isLoading={isLoading}
          token={
            tokens ? (tokens[bondDenoms[0].denom] ?? bondDenoms[0]) : undefined
          }
          value={value}
        />
      ) : (
        <MultiBondsRadioCard
          isLoading={isLoading}
          tokens={tokens}
          value={value}
        />
      )}
    </Button>
  );
};

export const DelegationsBody = ({
  bondDenoms,
  delegations,
  isDelegationsLoading,
  isUnbondingsLoading,
  rewards,
  totalDelegations,
  totalUnbondings,
  unbondings,
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
          bondDenoms={bondDenoms}
          isLoading={isDelegationsLoading}
          tokens={totalDelegations}
          value="Delegated"
        />
        <DelegationTab
          bondDenoms={bondDenoms}
          isLoading={isUnbondingsLoading}
          tokens={totalUnbondings}
          value="Unbonding"
        />
      </TabList>
      <TabPanels
        background="gray.800"
        border="1px solid"
        borderColor="gray.700"
        borderRadius="0px 0px 8px 8px"
        borderTopColor="transparent"
        p={4}
      >
        <TabPanel {...getPanelStyle({ isMobile })}>
          <DelegationsTable
            delegations={delegations}
            isLoading={isDelegationsLoading}
            isSingleBondDenom={bondDenoms.length === 1}
            rewards={rewards}
          />
        </TabPanel>
        <TabPanel {...getPanelStyle({ isMobile })}>
          <UnbondingsTable
            isLoading={isUnbondingsLoading}
            isSingleBondDenom={bondDenoms.length === 1}
            unbondings={unbondings}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
