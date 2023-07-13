import { Flex, Text, Switch, FormControl, FormLabel } from "@chakra-ui/react";

import { usePoolConfig, useWasmConfig } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import type { IconKeys } from "lib/components/icon";
import { CustomIcon } from "lib/components/icon";
import { useIsCurrentPage } from "lib/hooks";
import { useLocalStorage } from "lib/hooks/useLocalStorage";

interface SubHeaderMenuInfo {
  name: string;
  slug: string;
  icon: IconKeys;
}
const SubHeader = () => {
  const [isDevMode, setIsDevMode] = useLocalStorage("devMode", false);

  const wasmConfig = useWasmConfig({ shouldRedirect: false });
  const poolConfig = usePoolConfig({ shouldRedirect: false });

  const subHeaderMenu: SubHeaderMenuInfo[] = [
    { name: "Overview", slug: "/", icon: "home" },
    { name: "Transactions", slug: "/txs", icon: "file" },
    { name: "Blocks", slug: "/blocks", icon: "block" },
    ...(wasmConfig.enabled
      ? ([
          { name: "Codes", slug: "/codes", icon: "code" },
          { name: "Contracts", slug: "/contracts", icon: "website" },
        ] as const)
      : []),
    { name: "Proposals", slug: "/proposals", icon: "proposal" },
    ...(poolConfig.enabled
      ? ([{ name: "Osmosis Pools", slug: "/pools", icon: "pool" }] as const)
      : []),
  ];
  const isCurrentPage = useIsCurrentPage();

  const activeColor = "primary.light";

  return (
    <Flex px={6} alignItems="center" h="full" justifyContent="space-between">
      <Flex h="full">
        {subHeaderMenu.map((item) => (
          <AppLink href={item.slug} key={item.slug}>
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
      <FormControl display="flex" alignItems="center" width="fit-content">
        <FormLabel mb={0} cursor="pointer">
          <Text variant="body2" color="text.dark">
            Dev Mode
          </Text>
        </FormLabel>
        <Switch
          size="md"
          defaultChecked={isDevMode}
          onChange={(e) => {
            setIsDevMode(e.target.checked);
          }}
        />
      </FormControl>
    </Flex>
  );
};

export default SubHeader;
