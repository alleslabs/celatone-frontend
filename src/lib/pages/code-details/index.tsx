import { TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import {
  useCelatoneApp,
  useInternalNavigate,
  useMobile,
  useWasmConfig,
} from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { ErrorFetching, InvalidState } from "lib/components/state";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { useSchemaStore } from "lib/providers/store";
import { useCodeDataByCodeId } from "lib/services/codeService";

import { CodeContractsTable, CodeInfoSection } from "./components/code-info";
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
  const isMobile = useMobile();

  const router = useRouter();
  const navigate = useInternalNavigate();
  const { getSchemaByCodeHash } = useSchemaStore();

  const { currentChainId } = useCelatoneApp();
  const { data, isLoading } = useCodeDataByCodeId(codeId);

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
              code={code}
              chainId={currentChainId}
              attached={!!jsonSchema}
              toJsonSchemaTab={handleTabChange(TabIndex.JsonSchema)}
            />
            <CodeContractsTable codeId={codeId} />
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
