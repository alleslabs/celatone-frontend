import type { BechAddr32 } from "lib/types";

import {
  Badge,
  Button,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuList,
} from "@chakra-ui/react";
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
import { formatSlugName } from "lib/utils";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { zContractByListQueryParams } from "./types";

// TODO: revisit again

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
            : "Contract list detail"
        }
      />
      <Breadcrumb
        items={[
          { href: "/contract-lists", text: "Contract lists" },
          { text: contractListInfo.name },
        ]}
      />
      <Flex
        alignItems="center"
        gap={5}
        justifyContent="space-between"
        mt={2}
        w="full"
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
              href="cosmwasm/contracts/organize#saving-contract-for-later-use"
              isButton
              isDevTool
            />
          )}
          {isInstantiatedByMe ? (
            <Button
              leftIcon={<CustomIcon boxSize="16px" name="add-new" />}
              onClick={() => navigate({ pathname: "/deploy" })}
            >
              Deploy new contract
            </Button>
          ) : (
            <SaveNewContractModal
              key={slug}
              buttonProps={{
                children: "Save contract",
                leftIcon: <CustomIcon boxSize={3} name="bookmark" />,
                variant: "outline-primary",
              }}
              list={{
                label: contractListInfo.name,
                value: contractListInfo.slug,
              }}
            />
          )}
          {contractListInfo.isInfoEditable && (
            <Menu>
              <MenuButton as={Button} h="full" variant="ghost-gray">
                <CustomIcon color="gray.600" name="more" />
              </MenuButton>
              <MenuList>
                <EditListNameModal
                  list={{
                    label: contractListInfo.name,
                    value: contractListInfo.slug,
                  }}
                  menuItemProps={{
                    children: "Edit list name",
                    icon: <CustomIcon color="gray.600" name="edit" />,
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
                    icon: <CustomIcon color="error.light" name="delete" />,
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
          href="cosmwasm/contracts/organize#saving-contract-for-later-use"
          isDevTool
          title="How to organize and save contracts?"
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
