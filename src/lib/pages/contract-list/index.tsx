import { Flex, Heading } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useInternalNavigate, useWasmConfig } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { CreateNewListModal } from "lib/components/modal";
import PageContainer from "lib/components/PageContainer";
import { AllContractLists } from "lib/components/select-contract";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { useInstantiatedMockInfoByMe } from "lib/model/contract";
import { useContractStore } from "lib/providers/store";

const AllContractListsPage = observer(() => {
  useWasmConfig({ shouldRedirect: true });
  const router = useRouter();
  const navigate = useInternalNavigate();
  const { getContractLists, isHydrated } = useContractStore();
  const contractLists = [useInstantiatedMockInfoByMe(), ...getContractLists()];

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
      <Flex direction="column" alignItems="center" gap={8}>
        <Flex justifyContent="space-between" w="full" alignItems="center">
          <Heading as="h5" variant="h5">
            Contract lists
          </Heading>
          <CreateNewListModal
            buttonProps={{
              variant: "outline-primary",
              leftIcon: <CustomIcon name="plus" boxSize={3} />,
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
        isDevTool
        title="How to use contract list?"
        cta="Read more about Contract Lists"
        href="cosmwasm/contracts/organize#contract-list"
      />
    </PageContainer>
  );
});

export default AllContractListsPage;
