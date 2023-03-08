import {
  Flex,
  Heading,
  Button,
  Menu,
  MenuButton,
  MenuList,
  Breadcrumb,
  BreadcrumbItem,
  Box,
  Text,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { useInternalNavigate } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { CustomIcon } from "lib/components/icon";
import {
  EditListNameModal,
  RemoveListModal,
  SaveNewContractModal,
} from "lib/components/modal";
import { ContractListDetail } from "lib/components/select-contract";
import { INSTANTIATED_LIST_NAME, SAVED_LIST_NAME } from "lib/data";
import { useInstantiatedByMe } from "lib/model/contract";
import { useContractStore } from "lib/providers/store";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import { formatSlugName, getFirstQueryParam } from "lib/utils";

const ContractsByList = observer(() => {
  const router = useRouter();
  const navigate = useInternalNavigate();
  const listSlug = getFirstQueryParam(router.query.slug);

  const { getContractLists, isHydrated } = useContractStore();
  const isInstantiatedByMe =
    listSlug === formatSlugName(INSTANTIATED_LIST_NAME);

  const { instantiatedListInfo, isLoading } =
    useInstantiatedByMe(isInstantiatedByMe);

  const contractListInfo = isInstantiatedByMe
    ? instantiatedListInfo
    : getContractLists().find((item) => item.slug === listSlug);

  useEffect(() => {
    // TODO: find a better approach?
    const timeoutId = setTimeout(() => {
      if (isHydrated && contractListInfo === undefined)
        navigate({ pathname: "/contract-list" });
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [contractListInfo, isHydrated, navigate]);

  useEffect(() => {
    if (router.isReady) {
      switch (listSlug) {
        case formatSlugName(INSTANTIATED_LIST_NAME):
          AmpTrack(AmpEvent.TO_LIST_BY_ME);
          break;
        case formatSlugName(SAVED_LIST_NAME):
          AmpTrack(AmpEvent.TO_LIST_SAVED);
          break;
        default:
          AmpTrack(AmpEvent.TO_LIST_OTHERS);
      }
    }
  }, [router.isReady, listSlug]);

  if (!contractListInfo) return null;

  return (
    <>
      <Box p="48px" pb="0">
        <Breadcrumb
          w="full"
          spacing="4px"
          separator={<CustomIcon name="chevron-right" boxSize="3" />}
        >
          <BreadcrumbItem
            _hover={{ opacity: 0.8 }}
            transition="all 0.25s ease-in-out"
          >
            <AppLink color="text.dark" href="/contract-list">
              Contract Lists
            </AppLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <Text
              variant="body2"
              className="ellipsis"
              width="250px"
              fontWeight="600"
              color="text.dark"
            >
              {contractListInfo.name}
            </Text>
          </BreadcrumbItem>
        </Breadcrumb>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          w="full"
          mt={2}
          gap={5}
        >
          <Heading as="h5" variant="h5" className="ellipsis">
            {contractListInfo.name}
          </Heading>
          <Flex gap={2}>
            {isInstantiatedByMe ? (
              <Button
                leftIcon={
                  <CustomIcon name="add-new" color="text.main" boxSize="16px" />
                }
                onClick={() => navigate({ pathname: "/deploy" })}
              >
                Deploy New Contract
              </Button>
            ) : (
              <SaveNewContractModal
                key={listSlug}
                list={{
                  label: contractListInfo.name,
                  value: contractListInfo.slug,
                }}
                buttonProps={{
                  variant: "outline-primary",
                  leftIcon: (
                    <CustomIcon
                      name="bookmark"
                      boxSize="3"
                      color="violet.light"
                    />
                  ),
                  children: "Save Contract",
                }}
              />
            )}
            {contractListInfo.isInfoEditable && (
              <Menu>
                <MenuButton h="full" variant="ghost-gray" as={Button}>
                  <CustomIcon name="more" />
                </MenuButton>
                <MenuList>
                  <EditListNameModal
                    list={{
                      label: contractListInfo.name,
                      value: contractListInfo.slug,
                    }}
                    menuItemProps={{
                      icon: <CustomIcon name="edit" />,
                      children: "Edit list name",
                    }}
                    reroute
                  />
                  <RemoveListModal
                    list={{
                      label: contractListInfo.name,
                      value: contractListInfo.slug,
                    }}
                    menuItemProps={{
                      icon: <CustomIcon name="delete" color="error.light" />,
                      children: "Remove list",
                    }}
                  />
                </MenuList>
              </Menu>
            )}
          </Flex>
        </Flex>
      </Box>
      <ContractListDetail
        contractListInfo={contractListInfo}
        isLoading={isInstantiatedByMe ? isLoading : false}
      />
    </>
  );
});

export default ContractsByList;
