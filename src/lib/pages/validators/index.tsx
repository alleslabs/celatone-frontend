import { Flex } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { useGovConfig, useMobile, useTierConfig } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import PageContainer from "lib/components/PageContainer";
import { PageHeader } from "lib/components/PageHeader";
import PageHeaderContainer from "lib/components/PageHeaderContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { TierSwitcher } from "lib/components/TierSwitcher";
import { useDebounce } from "lib/hooks";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import type { ValidatorCounts } from "./types";

import {
  ActiveFilter,
  OrderSelect,
  ValidatorsBodyFull,
  ValidatorsBodyLite,
} from "./components";
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
          docHref="introduction/overview#validators"
          subtitle="This page displays all validators on this network"
          title="Validators"
        />
        <Flex
          align="end"
          direction={{ base: "column", md: "row" }}
          gap={{ base: "18px", md: "8px" }}
          w="full"
        >
          <ActiveFilter
            activeCount={counts?.activeCount}
            inactiveCount={counts?.inactiveCount}
            isActive={isActive}
            setIsActive={setIsActive}
          />
          {isMobile && (
            <OrderSelect
              allowUptime={isFullTier}
              isDesc={isDesc}
              order={order}
              setIsDesc={setIsDesc}
              setOrder={setOrder}
            />
          )}
          <InputWithIcon
            amptrackSection="validator-list-search"
            placeholder={
              isMobile
                ? "Search with name or address ..."
                : "Search with validator name or validator address ..."
            }
            size="lg"
            value={search}
            onChange={(e) => {
              const newValue = e.target.value;
              setSearch(newValue);
            }}
          />
        </Flex>
      </PageHeaderContainer>
      <PageContainer>
        <TierSwitcher
          full={
            <ValidatorsBodyFull
              isActive={isActive}
              isDesc={isDesc}
              order={order}
              scrollComponentId={SCROLL_COMPONENT_ID}
              search={debouncedSearch}
              setCounts={setCounts}
              setIsDesc={setIsDesc}
              setOrder={setOrder}
            />
          }
          lite={
            <ValidatorsBodyLite
              isActive={isActive}
              isDesc={isDesc}
              order={order}
              scrollComponentId={SCROLL_COMPONENT_ID}
              search={debouncedSearch}
              setCounts={setCounts}
              setIsDesc={setIsDesc}
              setOrder={setOrder}
            />
          }
        />
      </PageContainer>
    </>
  );
};

export default Validators;
