import { Flex, Heading } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { CreateNewListModal } from "lib/components/modal";
import PageContainer from "lib/components/PageContainer";
import { AllContractLists } from "lib/components/select-contract";
import { useInstantiatedMockInfoByMe } from "lib/model/contract";
import { useContractStore } from "lib/providers/store";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";

const AllContractListsPage = observer(() => {
  const router = useRouter();
  const navigate = useInternalNavigate();
  const { getContractLists } = useContractStore();
  const contractLists = [useInstantiatedMockInfoByMe(), ...getContractLists()];

  const handleListSelect = (slug: string) => {
    navigate({ pathname: "/contract-list/[slug]", query: { slug } });
  };

  useEffect(() => {
    if (router.isReady) AmpTrack(AmpEvent.TO_ALL_LISTS);
  }, [router.isReady]);

  return (
    <PageContainer>
      <Flex direction="column" alignItems="center" gap={12}>
        <Flex justifyContent="space-between" w="full" alignItems="center">
          <Heading as="h5" variant="h5">
            Contract lists
          </Heading>
          <CreateNewListModal
            buttonProps={{
              variant: "outline-primary",
              leftIcon: (
                <CustomIcon name="plus" boxSize="3" color="violet.light" />
              ),
              children: "Create new list",
            }}
          />
        </Flex>
        <AllContractLists
          contractLists={contractLists}
          handleListSelect={handleListSelect}
        />
      </Flex>
    </PageContainer>
  );
});

export default AllContractListsPage;
