import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useGovConfig, useMobile, useTierConfig } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import PageContainer from "lib/components/PageContainer";
import { PageHeader } from "lib/components/PageHeader";
import PageHeaderContainer from "lib/components/PageHeaderContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { TierSwitcher } from "lib/components/TierSwitcher";
import { useDebounce } from "lib/hooks";

import {
  ActiveFilter,
  OrderSelect,
  ValidatorsBodyFull,
  ValidatorsBodyLite,
} from "./components";
import type { ValidatorCounts } from "./types";
import { ValidatorOrder } from "./types";

const SCROLL_COMPONENT_ID = "validator-table-header";

const Validators = () => {
  const router = useRouter();
  const isMobile = useMobile();
  const { isFullTier } = useTierConfig();
  useGovConfig({ shouldRedirect: true });

  const [isActive, setIsActive] = useState(true);
  const [counts, setCounts] = useState<ValidatorCounts>();
  const [order, setOrder] = useState(ValidatorOrder.VotingPower);
  const [isDesc, setIsDesc] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_VALIDATORS);
  }, [router.isReady]);

  return (
    <>
      <CelatoneSeo pageName="Validators" />
      <PageHeaderContainer bgColor="transparent">
        <PageHeader
          subtitle="This page displays all validators on this network"
          title="Validators"
          docHref="introduction/overview#validators"
        />
        <Flex
          align="end"
          gap={{ base: "18px", md: "8px" }}
          w="full"
          direction={{ base: "column", md: "row" }}
        >
          <ActiveFilter
            isActive={isActive}
            setIsActive={setIsActive}
            activeCount={counts?.activeCount}
            inactiveCount={counts?.inactiveCount}
          />
          {isMobile && (
            <OrderSelect
              isDesc={isDesc}
              setIsDesc={setIsDesc}
              setOrder={setOrder}
              allowUptime={isFullTier}
              order={order}
            />
          )}
          <InputWithIcon
            size="lg"
            value={search}
            amptrackSection="validator-list-search"
            onChange={(e) => {
              const newValue = e.target.value;
              setSearch(newValue);
            }}
            placeholder={
              isMobile
                ? "Search with name or address ..."
                : "Search with validator name or validator address ..."
            }
          />
        </Flex>
      </PageHeaderContainer>
      <PageContainer>
        <TierSwitcher
          full={
            <ValidatorsBodyFull
              isActive={isActive}
              isDesc={isDesc}
              search={debouncedSearch}
              setIsDesc={setIsDesc}
              setOrder={setOrder}
              order={order}
              scrollComponentId={SCROLL_COMPONENT_ID}
              setCounts={setCounts}
            />
          }
          lite={
            <ValidatorsBodyLite
              isActive={isActive}
              isDesc={isDesc}
              search={debouncedSearch}
              setIsDesc={setIsDesc}
              setOrder={setOrder}
              order={order}
              scrollComponentId={SCROLL_COMPONENT_ID}
              setCounts={setCounts}
            />
          }
        />
      </PageContainer>
    </>
  );
};

export default Validators;
