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
import type { CodeDataState } from "lib/model/code";
import { useCodeData } from "lib/model/code";
import { useSchemaStore } from "lib/providers/store";
import { getFirstQueryParam, isId } from "lib/utils";

import { CodeInfoSection, CodeContractsTable } from "./components/code-info";
import { CodeTopInfo } from "./components/code-info/CodeTopInfo";
import { CodeSchemaSection } from "./components/json-schema/CodeSchemaSection";

const codeTabId = "codeDetailsTab";

enum TabIndex {
  CodeInfo = "info",
  JsonSchema = "schema",
}
interface CodeDetailsBodyProps {
  codeDataState: CodeDataState;
  codeId: number;
}

const InvalidCode = () => <InvalidState title="Code does not exist" />;

const CodeDetailsBody = observer(
  ({ codeDataState, codeId }: CodeDetailsBodyProps) => {
    const router = useRouter();
    const navigate = useInternalNavigate();
    const {
      chainId,
      codeData,
      lcdCodeData: { codeHash, isLcdCodeLoading },
    } = codeDataState;
    const { getSchemaByCodeHash } = useSchemaStore();
    const jsonSchema = codeHash ? getSchemaByCodeHash(codeHash) : undefined;
    const isMobile = useMobile();
    const tab = getFirstQueryParam(router.query.tab) as TabIndex;

    useEffect(() => {
      if (router.isReady) track(AmpEvent.TO_CODE_DETAIL, { tab });
      // Note: we don't want to track when tab changes
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.isReady, track]);

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

    useEffect(() => {
      if (router.isReady && (!tab || !Object.values(TabIndex).includes(tab))) {
        navigate({
          replace: true,
          pathname: "/codes/[codeId]/[tab]",
          query: {
            codeId,
            tab: TabIndex.CodeInfo,
          },
          options: {
            shallow: true,
          },
        });
      }
    }, [router.isReady, tab, codeId, navigate]);

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
              <CodeInfoSection
                codeData={codeData}
                chainId={chainId}
                codeHash={codeHash}
                isCodeHashLoading={isLcdCodeLoading}
                attached={!!jsonSchema}
                toJsonSchemaTab={handleTabChange(TabIndex.JsonSchema)}
              />
              <CodeContractsTable codeId={codeId} />
            </TabPanel>
            <TabPanel p={0}>
              <CodeSchemaSection
                codeId={codeId}
                codeHash={codeHash}
                isCodeHashLoading={isLcdCodeLoading}
                jsonSchema={jsonSchema}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </>
    );
  }
);

const CodeDetails = observer(() => {
  useWasmConfig({ shouldRedirect: true });
  const router = useRouter();
  const codeIdParam = getFirstQueryParam(router.query.codeId);
  const data = useCodeData(codeIdParam);

  if (data.isLoading) return <Loading withBorder />;
  return (
    <PageContainer>
      {!isId(codeIdParam) ? (
        <InvalidCode />
      ) : (
        <CodeDetailsBody codeDataState={data} codeId={Number(codeIdParam)} />
      )}
    </PageContainer>
  );
});

export default CodeDetails;
