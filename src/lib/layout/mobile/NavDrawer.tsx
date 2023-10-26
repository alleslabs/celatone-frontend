import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  Text,
  DrawerOverlay,
  useDisclosure,
  Image,
  Flex,
  Box,
  DrawerHeader,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";

import type { MenuInfo } from "../navbar/type";
import { CHAIN_CONFIGS } from "config/chain";
import { AmpEvent, useTrack } from "lib/amplitude";
import {
  useCelatoneApp,
  usePublicProjectConfig,
  useSelectChain,
} from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { CustomIcon } from "lib/components/icon";
import { useIsCurrentPage } from "lib/hooks";
import { usePublicProjectStore } from "lib/providers/store";

export const NavDrawer = () => {
  const { track } = useTrack();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentChainId, availableChainIds } = useCelatoneApp();
  const isCurrentPage = useIsCurrentPage();
  const { getSavedPublicProjects } = usePublicProjectStore();
  const publicProject = usePublicProjectConfig({ shouldRedirect: false });
  const selectChain = useSelectChain();
  const mobileMenu: MenuInfo[] = [
    {
      category: "Overview",
      slug: "overview",
      submenu: [
        { name: "Overview", slug: "/", icon: "home" },
        {
          name: "Transactions",
          slug: "/txs",
          icon: "file",
        },
        {
          name: "Blocks",
          slug: "/blocks",
          icon: "block",
        },
        {
          name: "Recent Codes",
          slug: "/codes",
          icon: "code",
        },
        {
          name: "Recent Contracts",
          slug: "/contracts",
          icon: "contract-address",
        },
        {
          name: "Query",
          slug: "/query",
          icon: "query",
        },
      ],
    },
  ];

  if (publicProject.enabled) {
    mobileMenu.push({
      category: "Public Projects",
      slug: "public-projects",
      submenu: [
        ...getSavedPublicProjects().map((list) => ({
          name: list.name,
          slug: `/projects/${list.slug}`,
          logo: list.logo,
        })),
        {
          name: "View All Projects",
          slug: "/projects",
          icon: "public-project",
        },
      ],
    });
  }

  return (
    <>
      <Button variant="outline-gray" size="sm" gap={1} onClick={() => onOpen()}>
        <CustomIcon name="menu" boxSize={3} />
        Menu
      </Button>
      <Drawer isOpen={isOpen} onClose={onClose} placement="right">
        <DrawerOverlay />
        <DrawerContent w="90%">
          <DrawerHeader alignItems="center" px={4}>
            <Flex align="center" justify="space-between" w="full">
              <Menu onOpen={() => track(AmpEvent.USE_SELECT_NETWORK)}>
                <MenuButton
                  pl={4}
                  pr={2}
                  py={1}
                  borderRadius="8px"
                  borderWidth="1px"
                  borderColor="gray.600"
                  _hover={{ bg: "gray.700" }}
                  transition="all 0.25s ease-in-out"
                  w="220px"
                >
                  <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    display="flex"
                  >
                    <Text
                      textOverflow="ellipsis"
                      variant="body2"
                      overflow="hidden"
                      whiteSpace="nowrap"
                      maxW="220px"
                    >
                      {currentChainId}
                    </Text>
                    <CustomIcon name="chevron-down" color="gray.600" />
                  </Flex>
                </MenuButton>
                <MenuList zIndex="dropdown">
                  {availableChainIds.map((chainId) => {
                    const noConfig = !(chainId in CHAIN_CONFIGS);
                    return (
                      <MenuItem
                        key={chainId}
                        onClick={() => {
                          selectChain(chainId);
                          onClose();
                        }}
                        flexDirection="column"
                        alignItems="flex-start"
                        _hover={{
                          backgroundColor: "gray.800",
                        }}
                        transition="all 0.25s ease-in-out"
                        isDisabled={noConfig}
                      >
                        <Flex justify="space-between" align="center" w="full">
                          <Flex direction="column">
                            <Text variant="body2">
                              {CHAIN_CONFIGS[chainId]?.prettyName || chainId}
                            </Text>
                            <Text color="text.dark" variant="body3">
                              {chainId}
                            </Text>
                          </Flex>
                          {chainId === currentChainId && (
                            <CustomIcon
                              name="check"
                              boxSize={3}
                              color="gray.600"
                            />
                          )}
                        </Flex>
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </Menu>
              <IconButton
                variant="gray"
                aria-label="close"
                onClick={() => onClose()}
                color="gray.600"
                icon={<CustomIcon name="close" />}
              />
            </Flex>
          </DrawerHeader>
          <DrawerBody overflowY="scroll" px={4} pb={4}>
            <Box overflowY="auto">
              {mobileMenu.map((item) => (
                <Box
                  pb={4}
                  mb={4}
                  key={item.category}
                  borderBottom="1px solid"
                  borderColor="gray.700"
                  sx={{
                    "&:last-of-type": {
                      borderBottom: "none",
                      paddingBottom: "0px",
                      marginBottom: "0px",
                    },
                  }}
                >
                  <Flex justifyContent="space-between" alignItems="center">
                    <Text py={2} variant="body3" fontWeight={700}>
                      {item.category}
                    </Text>
                  </Flex>
                  {item.submenu.map((submenu) => (
                    <AppLink
                      href={submenu.slug}
                      key={submenu.slug}
                      onClick={() => {
                        track(AmpEvent.USE_SIDEBAR);
                        onClose();
                      }}
                    >
                      <Flex
                        gap={2}
                        p={2}
                        cursor="pointer"
                        _hover={{ bg: "gray.700", borderRadius: "8px" }}
                        my="1px"
                        transition="all 0.25s ease-in-out"
                        alignItems="center"
                        position="relative"
                        bgColor={
                          isCurrentPage(submenu.slug)
                            ? "gray.800"
                            : "transparent"
                        }
                        borderRadius={
                          isCurrentPage(submenu.slug) ? "8px" : "0px"
                        }
                      >
                        <Flex
                          opacity={isCurrentPage(submenu.slug) ? 1 : 0}
                          width="3px"
                          height="20px"
                          bgColor="primary.light"
                          position="absolute"
                          top="10px"
                          borderRadius="2px"
                          left="0px"
                        />
                        {submenu.icon && (
                          <CustomIcon name={submenu.icon} color="gray.600" />
                        )}
                        {submenu.logo && (
                          <Image
                            src={submenu.logo}
                            borderRadius="full"
                            alt={submenu.slug}
                            boxSize={5}
                          />
                        )}
                        <Text variant="body2" className="ellipsis">
                          {submenu.name}
                        </Text>
                      </Flex>
                    </AppLink>
                  ))}
                </Box>
              ))}
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
