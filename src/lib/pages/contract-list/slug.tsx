import {
  Badge,
  Button,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuList,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useInternalNavigate, useWasmConfig } from "lib/app-provider";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { CustomIcon } from "lib/components/icon";
import {
  EditListNameModal,
  RemoveListModal,
  SaveNewContractModal,
} from "lib/components/modal";
import PageContainer from "lib/components/PageContainer";
import { ContractListDetail } from "lib/components/select-contract";
import { CelatoneSeo } from "lib/components/Seo";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { INSTANTIATED_LIST_NAME, SAVED_LIST_NAME } from "lib/data";
import { useInstantiatedByMe } from "lib/model/contract";
import { useContractStore } from "lib/providers/store";
import type { BechAddr32 } from "lib/types";
import { formatSlugName } from "lib/utils";

import { zContractByListQueryParams } from "./types";

// TODO: revisit again
// eslint-disable-next-line sonarjs/cognitive-complexity
const ContractByListBody = observer(({ slug }: { slug: string }) => {
  const router = useRouter();
  const navigate = useInternalNavigate();

  const { getContractLists, isHydrated } = useContractStore();
  const isInstantiatedByMe = slug === formatSlugName(INSTANTIATED_LIST_NAME);
  const isSavedContract = slug === formatSlugName(SAVED_LIST_NAME);

  const { instantiatedListInfo, isLoading } =
    useInstantiatedByMe(isInstantiatedByMe);

  const contractListInfo = isInstantiatedByMe
    ? instantiatedListInfo
    : getContractLists().find((item) => item.slug === slug);

  const onContractSelect = (contract: BechAddr32) =>
    navigate({
      pathname: "/contracts/[contract]",
      query: { contract },
    });

  useEffect(() => {
    // TODO: find a better approach?
    const timeoutId = setTimeout(() => {
      if (isHydrated && contractListInfo === undefined)
        navigate({ pathname: "/contract-lists" });
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [contractListInfo, isHydrated, navigate]);

  useEffect(() => {
    if (router.isReady && isHydrated) {
      const event = (() => {
        switch (slug) {
          case formatSlugName(INSTANTIATED_LIST_NAME):
            return AmpEvent.TO_INSTANTIATED_BY_ME;
          case formatSlugName(SAVED_LIST_NAME):
            return AmpEvent.TO_SAVED_CONTRACT;
          default:
            return AmpEvent.TO_LIST_OTHERS;
        }
      })();
      track(event, {
        contractCounts: contractListInfo?.contracts.length ?? 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, slug, isHydrated]);

  if (!contractListInfo) return null;

  return (
    <>
      <CelatoneSeo
        pageName={
          contractListInfo.name
            ? `${contractListInfo.name} ${!isInstantiatedByMe || !isSavedContract ? "" : "(Contract List)"}`
            : "Contract List Detail"
        }
      />
      <Breadcrumb
        items={[
          { href: "/contract-lists", text: "Contract Lists" },
          { text: contractListInfo.name },
        ]}
      />
      <Flex
        alignItems="center"
        gap={5}
        mt={2}
        w="full"
        justifyContent="space-between"
      >
        <Flex align="center">
          <Heading as="h5" variant="h5">
            {contractListInfo.name}
          </Heading>
          <Badge ml={2} variant="primary">
            {contractListInfo.contracts.length}
          </Badge>
        </Flex>
        <Flex align="center" gap={isInstantiatedByMe ? 4 : 2}>
          {isInstantiatedByMe && (
            <UserDocsLink
              isButton
              isDevTool
              href="cosmwasm/contracts/organize#saving-contract-for-later-use"
            />
          )}
          {isInstantiatedByMe ? (
            <Button
              leftIcon={<CustomIcon name="add-new" boxSize="16px" />}
              onClick={() => navigate({ pathname: "/deploy" })}
            >
              Deploy New Contract
            </Button>
          ) : (
            <SaveNewContractModal
              key={slug}
              list={{
                label: contractListInfo.name,
                value: contractListInfo.slug,
              }}
              buttonProps={{
                children: "Save Contract",
                leftIcon: <CustomIcon name="bookmark" boxSize={3} />,
                variant: "outline-primary",
              }}
            />
          )}
          {contractListInfo.isInfoEditable && (
            <Menu>
              <MenuButton as={Button} h="full" variant="ghost-gray">
                <CustomIcon name="more" color="gray.600" />
              </MenuButton>
              <MenuList>
                <EditListNameModal
                  list={{
                    label: contractListInfo.name,
                    value: contractListInfo.slug,
                  }}
                  menuItemProps={{
                    children: "Edit list name",
                    icon: <CustomIcon name="edit" color="gray.600" />,
                  }}
                  reroute
                />
                <RemoveListModal
                  list={{
                    label: contractListInfo.name,
                    value: contractListInfo.slug,
                  }}
                  menuItemProps={{
                    children: "Remove list",
                    icon: <CustomIcon name="delete" color="error.light" />,
                  }}
                />
              </MenuList>
            </Menu>
          )}
        </Flex>
      </Flex>
      <ContractListDetail
        contractListInfo={contractListInfo}
        isLoading={isInstantiatedByMe ? isLoading : false}
        onContractSelect={onContractSelect}
      />
      {!isInstantiatedByMe && (
        <UserDocsLink
          cta="Read more about Saved Contracts"
          title="How to organize and save contracts?"
          isDevTool
          href="cosmwasm/contracts/organize#saving-contract-for-later-use"
        />
      )}
    </>
  );
});

const ContractsByList = () => {
  useWasmConfig({ shouldRedirect: true });
  const router = useRouter();
  const validated = zContractByListQueryParams.safeParse(router.query);

  return (
    <PageContainer>
      {validated.success && <ContractByListBody {...validated.data} />}
    </PageContainer>
  );
};

export default ContractsByList;
