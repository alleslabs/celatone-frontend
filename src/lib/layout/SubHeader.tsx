import {
  Flex,
  Text,
  Switch,
  FormControl,
  FormLabel,
  Button,
} from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";

import { useMobile, usePoolConfig, useWasmConfig } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import type { IconKeys } from "lib/components/icon";
import { CustomIcon } from "lib/components/icon";
import { useIsCurrentPage } from "lib/hooks";
import { useLocalStorage } from "lib/hooks/useLocalStorage";
import type { Option } from "lib/types";

interface SubHeaderMenuInfo {
  name: string;
  slug: string;
  icon: IconKeys;
}

const FirstLandPrompt = ({
  setIsDevMode,
}: {
  setIsDevMode: Dispatch<SetStateAction<Option<boolean>>>;
}) => (
  <Flex
    position="absolute"
    right="24px"
    mt={1}
    direction="column"
    bg="gray.800"
    color="text.main"
    w="430px"
    borderRadius={1}
    zIndex="popover"
    sx={{
      "& > header": { p: "16px 24px", fontSize: "18px", fontWeight: 500 },
      "& > div": { p: "8px 24px", fontSize: "14px" },
      "& > footer": {
        p: "12px",
        display: "flex",
        justifyContent: "flex-end",
        gap: 2,
      },
    }}
  >
    <header>Looking for developer features?</header>
    <div>
      For quick access to our deploy, query, and other developer features, try
      our Dev Mode. You can change it back at any time
    </div>
    <footer>
      <Button variant="outline-primary" onClick={() => setIsDevMode(false)}>
        No, I just want to explore
      </Button>
      <Button onClick={() => setIsDevMode(true)}>Try Dev Mode!</Button>
    </footer>
  </Flex>
);

const SubHeader = () => {
  const isMobile = useMobile();
  const [isDevMode, setIsDevMode] = useLocalStorage<Option<boolean>>(
    "devMode",
    isMobile ? false : undefined
  );
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
    <>
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
            isChecked={isDevMode}
            onChange={(e) => {
              setIsDevMode(e.target.checked);
            }}
          />
        </FormControl>
      </Flex>
      {isDevMode === undefined && (
        <FirstLandPrompt setIsDevMode={setIsDevMode} />
      )}
    </>
  );
};

export default SubHeader;
