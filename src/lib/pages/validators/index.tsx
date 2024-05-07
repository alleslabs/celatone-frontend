import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useGovConfig, useMobile, useTierConfig } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import PageContainer from "lib/components/PageContainer";
import { PageHeader } from "lib/components/PageHeader";
import PageHeaderContainer from "lib/components/PageHeaderContainer";
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
  const tier = useTierConfig();
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
      <PageHeaderContainer bgColor="transparent">
        <PageHeader
          title="Validators"
          subtitle="This page displays all validators on this network"
          docHref="introduction/overview#validators"
        />
        <Flex
          direction={{ base: "column", md: "row" }}
          align="end"
          gap={{ base: "18px", md: "8px" }}
          w="full"
        >
          <ActiveFilter
            isActive={isActive}
            setIsActive={setIsActive}
            activeCount={counts?.activeCount}
            inactiveCount={counts?.inactiveCount}
          />
          {isMobile && (
            <OrderSelect
              order={order}
              setOrder={setOrder}
              isDesc={isDesc}
              setIsDesc={setIsDesc}
              allowUptime={tier === "full"}
            />
          )}
          <InputWithIcon
            size="lg"
            placeholder={
              isMobile
                ? "Search with name or address ..."
                : "Search with validator name or validator address ..."
            }
            value={search}
            onChange={(e) => {
              const newValue = e.target.value;
              setSearch(newValue);
            }}
            amptrackSection="validator-list-search"
          />
        </Flex>
      </PageHeaderContainer>
      <PageContainer>
        {tier === "full" ? (
          <ValidatorsBodyFull
            isActive={isActive}
            setCounts={setCounts}
            order={order}
            setOrder={setOrder}
            isDesc={isDesc}
            setIsDesc={setIsDesc}
            search={debouncedSearch}
            scrollComponentId={SCROLL_COMPONENT_ID}
          />
        ) : (
          <ValidatorsBodyLite
            isActive={isActive}
            setCounts={setCounts}
            order={order}
            setOrder={setOrder}
            isDesc={isDesc}
            setIsDesc={setIsDesc}
            search={debouncedSearch}
            scrollComponentId={SCROLL_COMPONENT_ID}
          />
        )}
      </PageContainer>
    </>
  );
};

export default Validators;
