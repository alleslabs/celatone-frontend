import { Tabs, TabList, TabPanel, TabPanels } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import {
  useWasmConfig,
  useMobile,
  useInternalNavigate,
} from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { InvalidState } from "lib/components/state";
import { useCodeData } from "lib/model/code";
import { useSchemaStore } from "lib/providers/store";

import { CodeInfoSection } from "./components/code-info";
import { CodeTopInfo } from "./components/code-info/CodeTopInfo";
import { CodeSchemaSection } from "./components/json-schema/CodeSchemaSection";
import { TabIndex, zCodeDetailsQueryParams } from "./types";

const codeTabId = "codeDetailsTab";

interface CodeDetailsBodyProps {
  codeId: number;
  tab: TabIndex;
}

const InvalidCode = () => <InvalidState title="Code does not exist" />;

const CodeDetailsBody = observer(({ codeId, tab }: CodeDetailsBodyProps) => {
  const router = useRouter();
  const codeDataState = useCodeData(codeId);
  const navigate = useInternalNavigate();
  const { chainId, codeData } = codeDataState;
  const { getSchemaByCodeHash } = useSchemaStore();
  const jsonSchema =
    codeData?.info && codeData.info.hash
      ? getSchemaByCodeHash(codeData.info.hash)
      : undefined;
  const isMobile = useMobile();

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_CODE_DETAILS, { tab });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  const handleTabChange = useCallback(
    (nextTab: TabIndex) => () => {
      if (nextTab === tab) return;
      navigate({
        pathname: "/codes/[codeId]/[tab]",
        query: {
          codeId,
          tab: nextTab,
        },
        options: {
          shallow: true,
        },
      });
    },
    [codeId, tab, navigate]
  );

  if (codeDataState.isLoading) return <Loading withBorder />;

  if (!codeData) return <InvalidCode />;

  return (
    <>
      <CodeTopInfo codeDataState={codeDataState} codeId={codeId} />
      <Tabs
        index={Object.values(TabIndex).indexOf(tab)}
        isLazy
        lazyBehavior="keepMounted"
        my={{ base: 0, md: 8 }}
      >
        {!isMobile && (
          <TabList
            borderBottom="1px solid"
            borderColor="gray.700"
            overflowX="scroll"
            id={codeTabId}
          >
            <CustomTab onClick={handleTabChange(TabIndex.CodeInfo)}>
              Code Information
            </CustomTab>
            <CustomTab onClick={handleTabChange(TabIndex.JsonSchema)}>
              JSON Schema
            </CustomTab>
          </TabList>
        )}
        <TabPanels>
          <TabPanel p={0}>
            {codeData.info && (
              <CodeInfoSection
                codeDataInfo={codeData.info}
                chainId={chainId}
                attached={!!jsonSchema}
                toJsonSchemaTab={handleTabChange(TabIndex.JsonSchema)}
              />
            )}
            {/* <CodeContractsTable codeId={codeId} /> */}
          </TabPanel>
          <TabPanel p={0}>
            {codeData.info && (
              <CodeSchemaSection
                codeDataInfo={codeData.info}
                jsonSchema={jsonSchema}
              />
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
});

const CodeDetails = observer(() => {
  useWasmConfig({ shouldRedirect: true });
  const router = useRouter();
  const validated = zCodeDetailsQueryParams.safeParse(router.query);

  return (
    <PageContainer>
      {validated.success ? (
        <CodeDetailsBody {...validated.data} />
      ) : (
        <InvalidCode />
      )}
    </PageContainer>
  );
});

export default CodeDetails;
