import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  Image,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useMemo } from "react";

import { NetworkMenu } from "../network-menu";
import { AmpEvent, track } from "lib/amplitude";
import {
  useGovConfig,
  useMoveConfig,
  useNftConfig,
  usePublicProjectConfig,
  useTierConfig,
  useWasmConfig,
} from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import type { IconKeys } from "lib/components/icon";
import { CustomIcon } from "lib/components/icon";
import { useIsCurrentPage } from "lib/hooks";
import { usePublicProjectStore } from "lib/providers/store";

import {
  getNavDrawerFull,
  getNavDrawerLite,
  getNavDrawerSequencer,
} from "./utils";

export const NavDrawer = () => {
  const { tier } = useTierConfig();
  const govConfig = useGovConfig({ shouldRedirect: false });
  const wasmConfig = useWasmConfig({ shouldRedirect: false });
  const moveConfig = useMoveConfig({ shouldRedirect: false });
  const nftConfig = useNftConfig({ shouldRedirect: false });
  const publicProject = usePublicProjectConfig({ shouldRedirect: false });

  const isCurrentPage = useIsCurrentPage();
  const { getSavedPublicProjects } = usePublicProjectStore();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const navMenu = useMemo(() => {
    let navMenuTmp = [];
    switch (tier) {
      case "full":
        navMenuTmp = getNavDrawerFull(
          govConfig.enabled,
          wasmConfig.enabled,
          moveConfig.enabled,
          nftConfig.enabled
        );
        break;
      case "lite":
        navMenuTmp = getNavDrawerLite(
          govConfig.enabled,
          wasmConfig.enabled,
          moveConfig.enabled
        );
        break;
      case "sequencer":
        navMenuTmp = getNavDrawerSequencer(
          govConfig.enabled,
          wasmConfig.enabled,
          moveConfig.enabled
        );
        break;
      default:
        throw new Error(`Invalid tier: ${tier}`);
    }

    if (publicProject.enabled)
      navMenuTmp.push({
        category: "Public Projects",
        slug: "public-projects",
        submenu: [
          ...getSavedPublicProjects().map((list) => ({
            logo: list.logo,
            name: list.name,
            slug: `/projects/${list.slug}`,
          })),
          {
            icon: "public-project" as IconKeys,
            name: "View All Projects",
            slug: "/projects",
          },
        ],
      });

    return navMenuTmp;
  }, [
    getSavedPublicProjects,
    govConfig.enabled,
    moveConfig.enabled,
    nftConfig.enabled,
    publicProject.enabled,
    tier,
    wasmConfig.enabled,
  ]);

  return (
    <>
      <Button
        gap={1}
        h="full"
        variant="ghost-gray"
        borderRadius={0}
        onClick={onOpen}
      >
        <CustomIcon name="menu" boxSize={3} />
        Menu
      </Button>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent w="90%">
          <DrawerHeader alignItems="center" px={4}>
            <Flex align="center" justify="space-between" w="full">
              <NetworkMenu />
              <IconButton
                aria-label="close"
                variant="gray"
                color="gray.600"
                icon={<CustomIcon name="close" />}
                onClick={() => onClose()}
              />
            </Flex>
          </DrawerHeader>
          <DrawerBody px={4} overflowY="scroll">
            {navMenu.map((item) => (
              <Box
                key={item.category}
                mb={4}
                pb={4}
                sx={{
                  "&:last-of-type": {
                    borderBottom: "none",
                    marginBottom: "0px",
                    paddingBottom: "0px",
                  },
                }}
                borderBottom="1px solid"
                borderColor="gray.700"
              >
                <Text py={2} variant="body3" fontWeight={700}>
                  {item.category}
                </Text>
                {item.submenu.map((submenu) => (
                  <AppLink
                    key={submenu.slug}
                    onClick={() => {
                      track(AmpEvent.USE_SIDEBAR);
                      onClose();
                    }}
                    href={submenu.slug}
                  >
                    <Flex
                      alignItems="center"
                      gap={2}
                      my="1px"
                      p={2}
                      _hover={{ bg: "gray.700", borderRadius: "8px" }}
                      bgColor={
                        isCurrentPage(submenu.slug) ? "gray.800" : "transparent"
                      }
                      borderRadius={isCurrentPage(submenu.slug) ? "8px" : "0px"}
                      cursor="pointer"
                      position="relative"
                      transition="all 0.25s ease-in-out"
                    >
                      <Flex
                        width="3px"
                        height="20px"
                        left="0px"
                        bgColor="primary.light"
                        borderRadius="2px"
                        opacity={isCurrentPage(submenu.slug) ? 1 : 0}
                        position="absolute"
                        top="10px"
                      />
                      {submenu.icon && (
                        <CustomIcon name={submenu.icon} color="gray.600" />
                      )}
                      {submenu.logo && (
                        <Image
                          alt={submenu.slug}
                          src={submenu.logo}
                          borderRadius="full"
                          boxSize={5}
                        />
                      )}
                      <Text className="ellipsis" variant="body2">
                        {submenu.name}
                      </Text>
                    </Flex>
                  </AppLink>
                ))}
              </Box>
            ))}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
