import { TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import {
  useInternalNavigate,
  useMoveConfig,
  usePublicProjectConfig,
  useWasmConfig,
} from "lib/app-provider";
import { CustomTab } from "lib/components/CustomTab";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { InvalidState } from "lib/components/state";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { DetailHeader } from "./components/DetailHeader";
import {
  PublicProjectAccountTable,
  PublicProjectCodeTable,
  PublicProjectContractTable,
  PublicProjectModuleTable,
} from "./components/tables";
import { usePublicData } from "./data";
import { TabIndex, zProjectDetailsQueryParams } from "./types";

interface ProjectDetailsBodyProps {
  slug: string;
  tab: TabIndex;
}

const ProjectDetailsBody = ({ slug, tab }: ProjectDetailsBodyProps) => {
  const router = useRouter();
  const navigate = useInternalNavigate();
  const wasm = useWasmConfig({ shouldRedirect: false });
  const move = useMoveConfig({ shouldRedirect: false });

  const {
    isLoading,
    projectDetail,
    publicAccounts,
    publicCodes,
    publicContracts,
    publicModules,
  } = usePublicData(slug);

  const handleTabChange = (nextTab: TabIndex) => () => {
    if (nextTab === tab) return;
    navigate({
      options: {
        shallow: true,
      },
      pathname: "/projects/[slug]/[tab]",
      query: {
        slug,
        tab: nextTab,
      },
    });
  };

  usePublicProjectConfig({ shouldRedirect: true });

  useEffect(() => {
    if (router.isReady) {
      if (tab) track(AmpEvent.TO_PROJECT_DETAILS, { tab });

      if (!tab || !Object.values(TabIndex).includes(tab)) {
        navigate({
          options: {
            shallow: true,
          },
          pathname: "/projects/[slug]/[tab]",
          query: {
            slug,
            tab: TabIndex.Overview,
          },
          replace: true,
        });
      }
    }
  }, [router.isReady, tab, slug, navigate]);

  const overviewCount =
    publicAccounts.length +
    (wasm.enabled ? publicCodes.length + publicContracts.length : 0) +
    (move.enabled ? publicModules.length : 0);

  if (isLoading) return <Loading withBorder />;
  if (!projectDetail) return <InvalidState title="Project does not exist" />;

  return (
    <>
      <CelatoneSeo
        pageName={
          projectDetail?.name
            ? `${projectDetail.name} (Public project)`
            : "Public project detail"
        }
      />
      <DetailHeader details={projectDetail} slug={slug} />
      <Tabs
        index={Object.values(TabIndex).indexOf(tab)}
        isLazy
        lazyBehavior="keepMounted"
      >
        <TabList
          borderBottomWidth="1px"
          borderColor="gray.700"
          my={6}
          overflowX="scroll"
        >
          <CustomTab
            count={overviewCount}
            onClick={handleTabChange(TabIndex.Overview)}
          >
            Overview
          </CustomTab>
          <CustomTab
            count={publicCodes.length}
            hidden={!wasm.enabled}
            isDisabled={!publicCodes.length}
            onClick={handleTabChange(TabIndex.Codes)}
          >
            Codes
          </CustomTab>
          <CustomTab
            count={publicContracts.length}
            hidden={!wasm.enabled}
            isDisabled={!publicContracts.length}
            onClick={handleTabChange(TabIndex.Contracts)}
          >
            Contracts
          </CustomTab>
          <CustomTab
            count={publicAccounts.length}
            isDisabled={!publicAccounts.length}
            onClick={handleTabChange(TabIndex.Accounts)}
          >
            Accounts
          </CustomTab>
          <CustomTab
            count={publicModules.length}
            hidden={!move.enabled}
            isDisabled={!publicModules.length}
            onClick={handleTabChange(TabIndex.Modules)}
          >
            Modules
          </CustomTab>
        </TabList>
        <TabPanels my={8}>
          <TabPanel p={0}>
            {wasm.enabled && (
              <>
                <PublicProjectCodeTable
                  codes={publicCodes}
                  onViewMore={handleTabChange(TabIndex.Codes)}
                />
                <PublicProjectContractTable
                  contracts={publicContracts}
                  onViewMore={handleTabChange(TabIndex.Contracts)}
                />
              </>
            )}
            <PublicProjectAccountTable
              accounts={publicAccounts}
              onViewMore={handleTabChange(TabIndex.Accounts)}
            />
            {move.enabled && (
              <PublicProjectModuleTable
                modules={publicModules}
                onViewMore={handleTabChange(TabIndex.Modules)}
              />
            )}
          </TabPanel>
          <TabPanel p={0}>
            <PublicProjectCodeTable codes={publicCodes} />
          </TabPanel>
          <TabPanel p={0}>
            <PublicProjectContractTable contracts={publicContracts} />
          </TabPanel>
          <TabPanel p={0}>
            <PublicProjectAccountTable accounts={publicAccounts} />
          </TabPanel>
          <TabPanel p={0}>
            <PublicProjectModuleTable modules={publicModules} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

const ProjectDetails = () => {
  const router = useRouter();
  const validated = zProjectDetailsQueryParams.safeParse(router.query);

  return (
    <PageContainer>
      {validated.success && <ProjectDetailsBody {...validated.data} />}
    </PageContainer>
  );
};

export default ProjectDetails;
