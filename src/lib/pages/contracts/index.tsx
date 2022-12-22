import { Flex, Heading } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { MdOutlineAdd } from "react-icons/md";

import { CreateNewList } from "lib/components/modal/list";
import { AllContractLists } from "lib/components/modal/select-contract";
import PageContainer from "lib/components/PageContainer";
import { useContractStore } from "lib/hooks";
import { useInstantiatedMockInfoByMe } from "lib/model/contract";

const AllContractListsPage = observer(() => {
  const router = useRouter();
  const { getContractLists } = useContractStore();
  const contractLists = [useInstantiatedMockInfoByMe(), ...getContractLists()];

  const handleListSelect = (slug: string) => {
    router.push({ pathname: `/contracts/${slug}` });
  };

  return (
    <PageContainer>
      <Flex direction="column" alignItems="center" gap={12}>
        <Flex justifyContent="space-between" w="full" alignItems="center">
          <Heading as="h5" variant="h5" color="primary.400">
            Contract lists
          </Heading>
          <CreateNewList
            buttonProps={{
              variant: "outline-primary",
              rightIcon: <MdOutlineAdd />,
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
