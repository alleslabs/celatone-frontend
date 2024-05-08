import { Flex, Text } from "@chakra-ui/react";

import { AmpEvent, track } from "lib/amplitude";
import {
  useGovConfig,
  useMoveConfig,
  useNftConfig,
  usePoolConfig,
  useTierConfig,
  useWasmConfig,
} from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import type { IconKeys } from "lib/components/icon";
import { CustomIcon } from "lib/components/icon";
import { useIsCurrentPage } from "lib/hooks";

import { getSubHeaderFull, getSubHeaderLite } from "./utils";

const ACTIVE_COLOR = "primary.light";

interface SubHeaderMenuInfo {
  name: string;
  slug: string;
  icon: IconKeys;
}

const SubHeader = () => {
  const tier = useTierConfig();
  const govConfig = useGovConfig({ shouldRedirect: false });
  const wasmConfig = useWasmConfig({ shouldRedirect: false });
  const moveConfig = useMoveConfig({ shouldRedirect: false });
  const nftConfig = useNftConfig({ shouldRedirect: false });
  const poolConfig = usePoolConfig({ shouldRedirect: false });

  const isCurrentPage = useIsCurrentPage();

  const subMenu: SubHeaderMenuInfo[] =
    tier === "full"
      ? (getSubHeaderFull(
          govConfig.enabled,
          wasmConfig.enabled,
          moveConfig.enabled,
          nftConfig.enabled,
          poolConfig.enabled
        ) as SubHeaderMenuInfo[])
      : (getSubHeaderLite(
          govConfig.enabled,
          wasmConfig.enabled
        ) as SubHeaderMenuInfo[]);

  return (
    <Flex px={6} h="full">
      {subMenu.map((item) => (
        <AppLink
          href={item.slug}
          key={item.slug}
          onClick={() => track(AmpEvent.USE_TOPBAR, { tab: item.name })}
        >
          <Flex
            alignItems="center"
            px={4}
            gap={2}
            h="full"
            borderBottomWidth={2}
            borderColor={
              isCurrentPage(item.slug) ? ACTIVE_COLOR : "transparent"
            }
            transition="all 0.25s ease-in-out"
            _hover={{ borderColor: ACTIVE_COLOR }}
            sx={{
              _hover: {
                "> svg, > p": {
                  color: ACTIVE_COLOR,
                  transition: "all .25s ease-in-out",
                },
                borderBottomWidth: 2,
                borderColor: ACTIVE_COLOR,
              },
            }}
          >
            <CustomIcon
              boxSize={3}
              name={item.icon}
              color={isCurrentPage(item.slug) ? ACTIVE_COLOR : "gray.600"}
            />
            <Text
              variant="body2"
              fontWeight={700}
              color={isCurrentPage(item.slug) ? ACTIVE_COLOR : "text.dark"}
            >
              {item.name}
            </Text>
          </Flex>
        </AppLink>
      ))}
    </Flex>
  );
};

export default SubHeader;
