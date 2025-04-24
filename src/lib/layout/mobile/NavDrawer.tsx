import type { IconKeys } from "lib/components/icon";

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
import { CustomIcon } from "lib/components/icon";
import { useIsCurrentPage } from "lib/hooks";
import { usePublicProjectStore } from "lib/providers/store";
import { useMemo } from "react";

import { NetworkMenu } from "../network-menu";
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
        category: "Public projects",
        slug: "public-projects",
        submenu: [
          ...getSavedPublicProjects().map((list) => ({
            logo: list.logo,
            name: list.name,
            slug: `/projects/${list.slug}`,
          })),
          {
            icon: "public-project" as IconKeys,
            name: "View all projects",
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
        borderRadius={0}
        gap={1}
        h="full"
        variant="ghost-gray"
        onClick={onOpen}
      >
        <CustomIcon boxSize={6} name="menu" />
      </Button>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent w="90%">
          <DrawerHeader alignItems="center" px={4}>
            <Flex align="center" justify="space-between" w="full">
              <NetworkMenu />
              <IconButton
                aria-label="close"
                color="gray.600"
                icon={<CustomIcon name="close" />}
                variant="gray"
                onClick={() => onClose()}
              />
            </Flex>
          </DrawerHeader>
          <DrawerBody overflowY="scroll" px={4}>
            {navMenu.map((item) => (
              <Box
                key={item.category}
                borderBottomWidth="1px"
                borderColor="gray.700"
                mb={4}
                pb={4}
                sx={{
                  "&:last-of-type": {
                    borderBottom: "none",
                    marginBottom: "0px",
                    paddingBottom: "0px",
                  },
                }}
              >
                <Text fontWeight={700} py={2} variant="body3">
                  {item.category}
                </Text>
                {item.submenu.map((submenu) => (
                  <AppLink
                    key={submenu.slug}
                    href={submenu.slug}
                    onClick={() => {
                      track(AmpEvent.USE_SIDEBAR);
                      onClose();
                    }}
                  >
                    <Flex
                      _hover={{ bg: "gray.700", borderRadius: "8px" }}
                      alignItems="center"
                      bgColor={
                        isCurrentPage(submenu.slug) ? "gray.800" : "transparent"
                      }
                      borderRadius={isCurrentPage(submenu.slug) ? "8px" : "0px"}
                      cursor="pointer"
                      gap={2}
                      my="1px"
                      p={2}
                      position="relative"
                      transition="all 0.25s ease-in-out"
                    >
                      <Flex
                        bgColor="primary.light"
                        borderRadius="2px"
                        height="20px"
                        left="0px"
                        opacity={isCurrentPage(submenu.slug) ? 1 : 0}
                        position="absolute"
                        top="10px"
                        width="3px"
                      />
                      {submenu.icon && (
                        <CustomIcon color="gray.600" name={submenu.icon} />
                      )}
                      {submenu.logo && (
                        <Image
                          alt={submenu.slug}
                          borderRadius="full"
                          boxSize={5}
                          src={submenu.logo}
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
