import { TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import {
  useCelatoneApp,
  useInternalNavigate,
  useMobile,
  useTierConfig,
  useWasmConfig,
} from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { ErrorFetching, InvalidState } from "lib/components/state";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { useSchemaStore } from "lib/providers/store";
import { useCodeData } from "lib/services/wasm/code";

import {
  CodeContractsTableFull,
  CodeContractsTableLite,
  CodeInfoSection,
} from "./components/code-info";
import { CodeTopInfo } from "./components/code-info/CodeTopInfo";
import { CodeSchemaSection } from "./components/json-schema/CodeSchemaSection";
import { useCodeDataLcd } from "./data";
import { TabIndex, zCodeDetailsQueryParams } from "./types";

const codeTabId = "codeDetailsTab";

interface CodeDetailsBodyProps {
  codeId: number;
  tab: TabIndex;
}

const InvalidCode = () => <InvalidState title="Code does not exist" />;

const CodeDetailsBody = observer(({ codeId, tab }: CodeDetailsBodyProps) => {
  const isMobile = useMobile();
  const isFullTier = useTierConfig() === "full";

  const navigate = useInternalNavigate();
  const { getSchemaByCodeHash } = useSchemaStore();

  const { currentChainId } = useCelatoneApp();
  const resApi = useCodeData(codeId, isFullTier);
  const resLcd = useCodeDataLcd(codeId, !isFullTier);
  const { data, isLoading } = isFullTier ? resApi : resLcd;

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

  if (isLoading) return <Loading />;
  if (!data) return <ErrorFetching dataName="code information" />;
  if (!data.info) return <InvalidCode />;

  const { info: code, projectInfo, publicInfo } = data;
  const jsonSchema = getSchemaByCodeHash(code.hash);

  return (
    <>
      <CodeTopInfo
        code={code}
        projectInfo={projectInfo}
        publicInfo={publicInfo}
        codeId={codeId}
      />
      <Tabs
        index={Object.values(TabIndex).indexOf(tab)}
        isLazy
        lazyBehavior="keepMounted"
        my={8}
        borderTop={{
          base: "1px solid var(--chakra-colors-gray-700)",
          md: "none",
        }}
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
              code={code}
              chainId={currentChainId}
              attached={!!jsonSchema}
              toJsonSchemaTab={handleTabChange(TabIndex.JsonSchema)}
            />
            {isFullTier ? (
              <CodeContractsTableFull codeId={codeId} />
            ) : (
              <CodeContractsTableLite codeId={codeId} />
            )}
            <UserDocsLink
              title="What is Code in CosmWasm?"
              cta="Read more about Code Details"
              href="cosmwasm/code/detail-page"
            />
          </TabPanel>
          <TabPanel p={0}>
            <CodeSchemaSection
              codeId={codeId}
              codeHash={code.hash}
              jsonSchema={jsonSchema}
            />
            <UserDocsLink
              title="How to attached and use JSON Schema?"
              cta="Read more about JSON Schema"
              href="cosmwasm/code/attach-json-schema"
            />
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

  useEffect(() => {
    if (router.isReady && validated.success)
      track(AmpEvent.TO_CODE_DETAILS, { tab: validated.data.tab });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

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
