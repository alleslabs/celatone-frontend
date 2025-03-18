import {
  Flex,
  Image,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import Link from "next/link";

import { SUPPORTED_NETWORK_TYPES } from "env";
import { CustomIcon } from "lib/components/icon";

const getAppLink = (appName: string) => {
  const isMainnet = SUPPORTED_NETWORK_TYPES[0] === "mainnet";

  if (isMainnet) return `https://${appName}.initia.xyz/`;
  return `https://${appName}.testnet.initia.xyz/`;
};

const appList = [
  {
    name: "app",
    logo: "https://assets.alleslabs.dev/integrations/initia/app-logo/app.svg",
    link: getAppLink("app"),
  },
  {
    name: "scan",
    logo: "https://assets.alleslabs.dev/integrations/initia/app-logo/scan.svg",
    link: getAppLink("scan"),
  },
  {
    name: "bridge",
    logo: "https://assets.alleslabs.dev/integrations/initia/app-logo/bridge.svg",
    link: getAppLink("bridge"),
  },
];

export const AppMenu = ({
  trigger = "hover",
}: {
  trigger?: "hover" | "click" | undefined;
}) => {
  return (
    <Popover trigger={trigger}>
      <PopoverTrigger>
        <Flex
          w="full"
          h="full"
          align="center"
          justify="center"
          transition="all 0.25s ease-in-out"
          _hover={{
            cursor: "pointer",
            background: "gray.900",
            "> svg": { color: "gray.400" },
          }}
        >
          <CustomIcon name="apps" color="gray.600" />
        </Flex>
      </PopoverTrigger>
      <PopoverContent
        border="0"
        zIndex={4}
        width="256px"
        bg="gray.800"
        ml={2}
        p={2}
        top="-8px"
        boxShadow="0px 20px 30px 5px var(--chakra-colors-background-main)"
        _focusVisible={{
          outline: "none",
        }}
      >
        <Flex direction="column">
          {appList.map((app) =>
            app ? (
              <Flex
                key={app.name}
                py={3}
                px={4}
                borderRadius={8}
                w="full"
                cursor="pointer"
                transition="all 0.25s ease-in-out"
                _hover={{
                  background: app.name !== "scan" && "gray.700",
                }}
                background={app.name === "scan" ? "gray.900" : "transparent"}
              >
                {app.name === "scan" ? (
                  <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    w="full"
                  >
                    <Image
                      src={app.logo}
                      alt={app.name}
                      height="20px"
                      minH="20px"
                    />
                    <CustomIcon name="check" color="gray.100" boxSize={3} />
                  </Flex>
                ) : (
                  <Link
                    href={app.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ width: "100%" }}
                  >
                    <Flex
                      alignItems="center"
                      justifyContent="space-between"
                      w="full"
                    >
                      <Image
                        src={app.logo}
                        alt={app.name}
                        height="20px"
                        minH="20px"
                      />
                    </Flex>
                  </Link>
                )}
              </Flex>
            ) : null
          )}
        </Flex>
      </PopoverContent>
    </Popover>
  );
};
