import {
  Flex,
  Heading,
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Box,
  Text,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useEffect } from "react";
import {
  MdOutlineAdd,
  MdMoreHoriz,
  MdBookmarkBorder,
  MdMode,
  MdDelete,
  MdChevronRight,
} from "react-icons/md";

import { SaveNewContract } from "lib/components/modal/contract";
import { EditList, RemoveList } from "lib/components/modal/list";
import { ListDetail } from "lib/components/modal/select-contract";
import { INSTANTIATED_LIST_NAME } from "lib/data";
import { useContractStore } from "lib/hooks";
import { useInstantiatedByMe } from "lib/model/contract";
import { formatSlugName, getFirstQueryParam } from "lib/utils";

const ContractsByList = observer(() => {
  const router = useRouter();
  const listSlug = getFirstQueryParam(router.query.slug);

  const { getContractLists, isHydrated } = useContractStore();
  const isInstantiatedByMe =
    listSlug === formatSlugName(INSTANTIATED_LIST_NAME);

  const instantiatedListInfo = useInstantiatedByMe(isInstantiatedByMe);

  const contractListInfo = isInstantiatedByMe
    ? instantiatedListInfo
    : getContractLists().find((item) => item.slug === listSlug);

  useEffect(() => {
    if (isHydrated && contractListInfo === undefined) {
      router.push("/contracts");
    }
  }, [contractListInfo, router, isHydrated]);

  const iconProps = {
    boxSize: "4",
    display: "flex",
    alignItems: "center",
  };

  if (!contractListInfo) return null;

  return (
    <>
      <Box p="48px" pb="0">
        <Breadcrumb
          w="full"
          spacing="4px"
          separator={<MdChevronRight color="gray.600" />}
        >
          <BreadcrumbItem>
            <BreadcrumbLink color="text.dark" href="/contracts">
              Contract Lists
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="#">
              <Text
                className="ellipsis"
                width="250px"
                fontWeight="600"
                color="text.dark"
              >
                {contractListInfo.name}
              </Text>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          w="full"
          mt={2}
          gap={5}
        >
          <Heading
            as="h5"
            variant="h5"
            color="primary.400"
            className="ellipsis"
          >
            {contractListInfo.name}
          </Heading>
          <Flex gap={2}>
            {isInstantiatedByMe ? (
              <Button
                rightIcon={<MdOutlineAdd />}
                onClick={() => router.push("/deploy")}
              >
                Deploy New Contract
              </Button>
            ) : (
              <SaveNewContract
                key={listSlug}
                list={{
                  label: contractListInfo.name,
                  value: contractListInfo.slug,
                }}
                buttonProps={{
                  variant: "outline-primary",
                  rightIcon: <MdBookmarkBorder />,
                  children: "Save Contract",
                }}
              />
            )}
            {contractListInfo.isInfoEditable && (
              <Menu>
                <MenuButton
                  h="full"
                  variant="ghost-gray"
                  focusBorderColor="primary.main"
                  as={Button}
                >
                  <Icon
                    as={MdMoreHoriz}
                    color="gray.600"
                    boxSize="6"
                    display="flex"
                  />
                </MenuButton>
                <MenuList>
                  <EditList
                    list={{
                      label: contractListInfo.name,
                      value: contractListInfo.slug,
                    }}
                    menuItemProps={{
                      icon: (
                        <Icon as={MdMode} style={iconProps} color="gray.600" />
                      ),
                      children: "Edit list name",
                    }}
                  />
                  <RemoveList
                    list={{
                      label: contractListInfo.name,
                      value: contractListInfo.slug,
                    }}
                    menuItemProps={{
                      icon: (
                        <Icon
                          as={MdDelete}
                          style={iconProps}
                          color="error.light"
                        />
                      ),
                      children: "Remove list",
                    }}
                  />
                </MenuList>
              </Menu>
            )}
          </Flex>
        </Flex>
      </Box>
      <ListDetail
        contractListInfo={contractListInfo}
        isReadOnly={false}
        isContractRemovable={
          contractListInfo.isContractRemovable
            ? { label: contractListInfo.name, value: contractListInfo.slug }
            : undefined
        }
        isInstantiatedByMe={isInstantiatedByMe}
      />
    </>
  );
});

export default ContractsByList;
