import {
  Flex,
  Heading,
  Switch,
  Text,
  Image,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useForm } from "react-hook-form";

import { CustomTab } from "lib/components/CustomTab";
import InputWithIcon from "lib/components/InputWithIcon";
import PageContainer from "lib/components/PageContainer";
import { usePoolListCountByIsSupported } from "lib/services/poolService";
import type { PoolTypeFilter } from "lib/types";

import { FilterByPoolType } from "./components/FilterByPoolType";
import { SupportedSection } from "./components/supportedSection";
import { UnsupportedSection } from "./components/unsupportedSection";

interface PoolFilterState {
  keyword: string;
  poolTypeValue: PoolTypeFilter;
  isSuperfluidOnly: boolean;
}

export const PoolIndex = () => {
  const { data: supportedPoolCount, refetch: refetchSupportedPoolCount } =
    usePoolListCountByIsSupported(true, "all", false, "");
  const { data: unsupportedPoolCount, refetch: refetchUnsupportedPoolCount } =
    usePoolListCountByIsSupported(false, "all", false, "");

  const { watch, setValue } = useForm<PoolFilterState>({
    defaultValues: {
      poolTypeValue: "all",
      keyword: "",
      isSuperfluidOnly: true,
    },
  });
  const { keyword, poolTypeValue, isSuperfluidOnly } = watch();

  const sectionHeaderId = "poolListTab";

  return (
    <PageContainer>
      <Heading variant="h5" as="h5">
        Osmosis Pools
      </Heading>
      <Flex mt={12} alignItems="center">
        <Flex grow="2" gap={4}>
          <InputWithIcon
            placeholder="Search with code ID or code name"
            value={keyword}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setValue("keyword", e.target.value)
            }
            size="lg"
          />
          <FilterByPoolType
            initialSelected="all"
            setPoolTypeValue={(newVal: PoolTypeFilter) => {
              if (newVal === poolTypeValue) return;
              setValue("poolTypeValue", newVal);
            }}
          />
          <Flex minW="250px">
            <FormControl display="flex" alignItems="center" gap={2}>
              <Switch
                size="md"
                defaultChecked={isSuperfluidOnly}
                onChange={(e) => setValue("isSuperfluidOnly", e.target.checked)}
              />
              <FormLabel mb="0" cursor="pointer">
                <Text display="flex" gap={2} alignItems="center">
                  Show only
                  <Image
                    boxSize={4}
                    src="https://assets.alleslabs.dev/webapp-assets/pool/pool-superfluid.svg"
                  />
                  Superfluid
                </Text>
              </FormLabel>
            </FormControl>
          </Flex>
        </Flex>
      </Flex>
      <Tabs>
        <TabList my={8} borderBottom="1px" borderColor="pebble.800">
          <CustomTab count={supportedPoolCount ?? 0}>Pools</CustomTab>
          <CustomTab count={unsupportedPoolCount ?? 0}>
            Pools with unsupported tokens
          </CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <SupportedSection
              poolType={poolTypeValue}
              isSuperfluidOnly={isSuperfluidOnly}
              search={keyword}
              totalData={supportedPoolCount ?? 0}
              refetchCount={refetchSupportedPoolCount}
              scrollComponentId={sectionHeaderId}
            />
          </TabPanel>
          <TabPanel p={0}>
            <UnsupportedSection
              poolType={poolTypeValue}
              isSuperfluidOnly={isSuperfluidOnly}
              search={keyword}
              totalData={unsupportedPoolCount ?? 0}
              refetchCount={refetchUnsupportedPoolCount}
              scrollComponentId={sectionHeaderId}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </PageContainer>
  );
};
