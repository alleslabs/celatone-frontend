import { Flex, Heading } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { useInternalNavigate, useWasmConfig } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { CreateNewListModal } from "lib/components/modal";
import PageContainer from "lib/components/PageContainer";
import { AllContractLists } from "lib/components/select-contract";
import { CelatoneSeo } from "lib/components/Seo";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { useInstantiatedByMe } from "lib/model/contract";
import { useContractStore } from "lib/providers/store";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useEffect } from "react";

const AllContractListsPage = observer(() => {
  useWasmConfig({ shouldRedirect: true });
  const router = useRouter();
  const navigate = useInternalNavigate();
  const { getContractLists, isHydrated } = useContractStore();
  const contractLists = [
    useInstantiatedByMe(true).instantiatedListInfo,
    ...getContractLists(),
  ];

  const handleListSelect = (slug: string) => {
    navigate({ pathname: "/contract-lists/[slug]", query: { slug } });
  };

  useEffect(() => {
    if (router.isReady && isHydrated)
      track(AmpEvent.TO_ALL_LISTS, { contractListCount: contractLists.length });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, isHydrated]);

  return (
    <PageContainer>
      <CelatoneSeo pageName="Contract lists" />
      <Flex direction="column" alignItems="center" gap={8}>
        <Flex justifyContent="space-between" w="full" alignItems="center">
          <Heading as="h5" variant="h5">
            Contract lists
          </Heading>
          <CreateNewListModal
            buttonProps={{
              variant: "outline-primary",
              leftIcon: <CustomIcon boxSize={3} name="plus" />,
              children: "Create new list",
            }}
          />
        </Flex>
        <AllContractLists
          contractLists={contractLists}
          handleListSelect={handleListSelect}
          isReadOnly={false}
        />
      </Flex>
      <UserDocsLink
        cta="Read more about Contract Lists"
        href="cosmwasm/contracts/organize#contract-list"
        isDevTool
        title="How to use contract list?"
      />
    </PageContainer>
  );
});

export default AllContractListsPage;
