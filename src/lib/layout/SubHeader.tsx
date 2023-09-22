import { Flex, Text } from "@chakra-ui/react";
import { useCallback } from "react";

import { AmpEvent, useTrack } from "lib/amplitude";
import {
  usePoolConfig,
  useGovConfig,
  useWasmConfig,
  useMoveConfig,
} from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import type { IconKeys } from "lib/components/icon";
import { CustomIcon } from "lib/components/icon";
import { useIsCurrentPage } from "lib/hooks";

interface SubHeaderMenuInfo {
  name: string;
  slug: string;
  icon: IconKeys;
}

const SubHeader = () => {
  const wasmConfig = useWasmConfig({ shouldRedirect: false });
  const moveConfig = useMoveConfig({ shouldRedirect: false });
  const poolConfig = usePoolConfig({ shouldRedirect: false });
  const govConfig = useGovConfig({ shouldRedirect: false });
  const { track } = useTrack();

  const subHeaderMenu: SubHeaderMenuInfo[] = [
    { name: "Overview", slug: "/", icon: "home" },
    { name: "Transactions", slug: "/txs", icon: "file" },
    { name: "Blocks", slug: "/blocks", icon: "block" },
  ];

  if (moveConfig.enabled)
    subHeaderMenu.push({
      name: "Modules",
      slug: "/modules",
      icon: "contract-address",
    });

  if (wasmConfig.enabled)
    subHeaderMenu.push(
      { name: "Codes", slug: "/codes", icon: "code" },
      { name: "Contracts", slug: "/contracts", icon: "contract-address" }
    );

  if (govConfig.enabled)
    subHeaderMenu.push({
      name: "Proposals",
      slug: "/proposals",
      icon: "proposal",
    });

  if (poolConfig.enabled)
    subHeaderMenu.push({ name: "Osmosis Pools", slug: "/pools", icon: "pool" });

  const isCurrentPage = useIsCurrentPage();

  const activeColor = "primary.light";

  const trackOnClick = useCallback(
    (tab: string) => {
      track(AmpEvent.USE_TOPBAR, { tab });
    },
    [track]
  );

  return (
    <Flex px={6} alignItems="center" h="full" justifyContent="space-between">
      <Flex h="full">
        {subHeaderMenu.map((item) => (
          <AppLink
            href={item.slug}
            key={item.slug}
            onClick={() => trackOnClick(item.name)}
          >
            <Flex
              alignItems="center"
              px={4}
              gap={2}
              h="full"
              borderBottomWidth={2}
              borderColor={
                isCurrentPage(item.slug) ? activeColor : "transparent"
              }
              transition="all .25s ease-in-out"
              _hover={{ borderColor: activeColor }}
              sx={{
                _hover: {
                  "> svg, > p": {
                    color: activeColor,
                    transition: "all .25s ease-in-out",
                  },
                  borderBottomWidth: 2,
                  borderColor: activeColor,
                },
              }}
            >
              <CustomIcon
                boxSize={3}
                name={item.icon}
                color={isCurrentPage(item.slug) ? activeColor : "gray.600"}
              />
              <Text
                variant="body2"
                fontWeight={700}
                color={isCurrentPage(item.slug) ? activeColor : "text.dark"}
              >
                {item.name}
              </Text>
            </Flex>
          </AppLink>
        ))}
      </Flex>
    </Flex>
  );
};

export default SubHeader;
