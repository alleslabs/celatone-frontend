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
import { CelatoneSeo } from "lib/components/Seo";
import { ErrorFetching, InvalidState } from "lib/components/state";
import { TierSwitcher } from "lib/components/TierSwitcher";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { useSchemaStore } from "lib/providers/store";
import { useDerivedWasmVerifyInfo } from "lib/services/verification/wasm";
import { useCodeData } from "lib/services/wasm/code";

import {
  CodeContractsTableFull,
  CodeContractsTableLite,
  CodeInfoSection,
  CodeTopInfo,
} from "./components/code-info";
import { CodeSchemaSection } from "./components/code-schema-section";
import { CodeVerificationSection } from "./components/CodeVerificationSection";
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
  const { isFullTier } = useTierConfig();
  const { currentChainId } = useCelatoneApp();

  const navigate = useInternalNavigate();
  const { getSchemaByCodeHash } = useSchemaStore();

  const resApi = useCodeData(codeId, isFullTier);
  const resLcd = useCodeDataLcd(codeId, !isFullTier);
  const { data, isLoading } = isFullTier ? resApi : resLcd;

  const {
    data: derivedWasmVerifyInfo,
    isLoading: isDerivedWasmVerifyInfoLoading,
  } = useDerivedWasmVerifyInfo(data?.info.codeId, data?.info.hash);

  const handleTabChange = useCallback(
    (nextTab: TabIndex) => () => {
      if (nextTab === tab) return;
      navigate({
        options: {
          shallow: true,
        },
        pathname: "/codes/[codeId]/[tab]",
        query: {
          codeId,
          tab: nextTab,
        },
      });
    },
    [codeId, tab, navigate]
  );

  if (isLoading || isDerivedWasmVerifyInfoLoading) return <Loading />;
  if (!data) return <ErrorFetching dataName="code information" />;
  if (!data.info) return <InvalidCode />;

  const { info: code, projectInfo, publicInfo } = data;
  const localSchema = getSchemaByCodeHash(code.hash);
  const attached = Boolean(derivedWasmVerifyInfo?.schema ?? localSchema);
  return (
    <>
      <CelatoneSeo pageName={codeId ? `Code #${codeId}` : "Code Detail"} />
      <CodeTopInfo
        code={code}
        codeId={codeId}
        projectInfo={projectInfo}
        publicInfo={publicInfo}
        wasmVerifyInfo={derivedWasmVerifyInfo}
      />
      <Tabs
        index={Object.values(TabIndex).indexOf(tab)}
        isLazy
        my={8}
        borderTop={{
          base: "1px solid var(--chakra-colors-gray-700)",
          md: "none",
        }}
        lazyBehavior="keepMounted"
      >
        {!isMobile && (
          <TabList
            id={codeTabId}
            borderBottom="1px solid"
            borderColor="gray.700"
            overflowX="scroll"
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
              attached={attached}
              chainId={currentChainId}
              code={code}
              toJsonSchemaTab={handleTabChange(TabIndex.JsonSchema)}
            />
            <CodeVerificationSection
              codeHash={code.hash}
              codeId={codeId}
              wasmVerifyInfo={derivedWasmVerifyInfo}
            />
            <TierSwitcher
              full={<CodeContractsTableFull codeId={codeId} />}
              lite={<CodeContractsTableLite codeId={codeId} />}
            />
            <UserDocsLink
              cta="Read more about Code Details"
              title="What is Code in CosmWasm?"
              href="cosmwasm/codes/detail-page"
            />
          </TabPanel>
          <TabPanel p={0}>
            <CodeSchemaSection
              codeHash={code.hash}
              codeId={codeId}
              localSchema={localSchema}
              wasmVerifyInfo={derivedWasmVerifyInfo}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
});

const CodeDetails = () => {
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
};

export default CodeDetails;
