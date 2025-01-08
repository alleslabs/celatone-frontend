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

import { DelegationsTable, UnbondingsTable } from "../table";
import { useMobile } from "lib/app-provider";
import type { Delegation, Option, TokenWithValue, Unbonding } from "lib/types";

import { MultiBondsRadioCard } from "./radio-card/MultiBondsRadioCard";
import { SingleBondRadioCard } from "./radio-card/SingleBondRadioCard";

interface DelegationsBodyProps {
  bondDenoms: TokenWithValue[];
  delegations: Option<Delegation[]>;
  isDelegationsLoading: boolean;
  isUnbondingsLoading: boolean;
  rewards: Option<Record<string, TokenWithValue[]>>;
  totalDelegations: Option<Record<string, TokenWithValue>>;
  totalUnbondings: Option<Record<string, TokenWithValue>>;
  unbondings: Option<Unbonding[]>;
}

const getPanelStyle = ({ isMobile }: { isMobile: boolean }) => ({
  background: isMobile ? "transparent" : "gray.900",
  border: isMobile ? undefined : "1px solid var(--chakra-colors-gray-700)",
  borderRadius: "8px",
  p: isMobile ? 0 : 6,
});

interface DelegationTabProps extends TabProps {
  bondDenoms: TokenWithValue[];
  isLoading: boolean;
  tokens: Option<Record<string, TokenWithValue>>;
  value: string;
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
      borderRadius="8px 8px 0px 0px"
      color="text.main"
      {...tabProps}
    >
      {bondDenoms.length === 1 ? (
        <SingleBondRadioCard
          value={value}
          isLoading={isLoading}
          token={
            tokens ? tokens[bondDenoms[0].denom] ?? bondDenoms[0] : undefined
          }
        />
      ) : (
        <MultiBondsRadioCard
          value={value}
          isLoading={isLoading}
          tokens={tokens}
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
    <Tabs isLazy mt={6} w="full" lazyBehavior="keepMounted">
      <TabList gap={2} borderBottom="0px solid">
        <DelegationTab
          value="Delegated"
          bondDenoms={bondDenoms}
          isLoading={isDelegationsLoading}
          tokens={totalDelegations}
        />
        <DelegationTab
          value="Unbonding"
          bondDenoms={bondDenoms}
          isLoading={isUnbondingsLoading}
          tokens={totalUnbondings}
        />
      </TabList>
      <TabPanels
        p={4}
        background="gray.800"
        border="1px solid"
        borderColor="gray.700"
        borderRadius="0px 0px 8px 8px"
        borderTopColor="transparent"
      >
        <TabPanel {...getPanelStyle({ isMobile })}>
          <DelegationsTable
            rewards={rewards}
            delegations={delegations}
            isLoading={isDelegationsLoading}
            isSingleBondDenom={bondDenoms.length === 1}
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
