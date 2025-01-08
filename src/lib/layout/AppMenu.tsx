import {
  Flex,
  Image,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import Link from "next/link";

import { CustomIcon } from "lib/components/icon";

const appList = [
  {
    link: "https://app.testnet.initia.xyz/",
    logo: "https://assets.alleslabs.dev/integrations/initia/app-logo/app.svg",
    name: "app",
  },
  {
    link: "https://scan.testnet.initia.xyz/",
    logo: "https://assets.alleslabs.dev/integrations/initia/app-logo/scan.svg",
    name: "scan",
  },
  {
    link: "https://usernames.testnet.initia.xyz/",
    logo: "https://assets.alleslabs.dev/integrations/initia/app-logo/usernames.svg",
    name: "usernames",
  },
  {
    link: "https://bridge.testnet.initia.xyz/",
    logo: "https://assets.alleslabs.dev/integrations/initia/app-logo/bridge.svg",
    name: "bridge",
  },
  {
    link: "https://faucet.testnet.initia.xyz/",
    logo: "https://assets.alleslabs.dev/integrations/initia/app-logo/faucet.svg",
    name: "faucet",
  },
];

export const AppMenu = ({
  trigger = "hover",
}: {
  trigger?: "click" | "hover" | undefined;
}) => {
  return (
    <Popover trigger={trigger}>
      <PopoverTrigger>
        <Flex
          align="center"
          h="full"
          justify="center"
          w="full"
          _hover={{
            "> svg": { color: "gray.400" },
            background: "gray.900",
            cursor: "pointer",
          }}
          transition="all 0.25s ease-in-out"
        >
          <CustomIcon name="apps" color="gray.600" />
        </Flex>
      </PopoverTrigger>
      <PopoverContent
        width="256px"
        bg="gray.800"
        ml={2}
        p={2}
        zIndex={4}
        _focusVisible={{
          outline: "none",
        }}
        border="0"
        boxShadow="0px 20px 30px 5px var(--chakra-colors-background-main)"
        top="-8px"
      >
        <Flex direction="column">
          {appList.map((app) => (
            <Flex
              key={app.name}
              px={4}
              py={3}
              w="full"
              _hover={{
                background: app.name !== "scan" && "gray.700",
              }}
              background={app.name === "scan" ? "gray.900" : "transparent"}
              borderRadius={8}
              cursor="pointer"
              transition="all 0.25s ease-in-out"
            >
              {app.name === "scan" ? (
                <Flex
                  alignItems="center"
                  w="full"
                  justifyContent="space-between"
                >
                  <Image
                    alt={app.name}
                    height="20px"
                    minH="20px"
                    src={app.logo}
                  />
                  <CustomIcon name="check" boxSize={3} color="gray.100" />
                </Flex>
              ) : (
                <Link
                  style={{ width: "100%" }}
                  rel="noopener noreferrer"
                  target="_blank"
                  href={app.link}
                >
                  <Flex
                    alignItems="center"
                    w="full"
                    justifyContent="space-between"
                  >
                    <Image
                      alt={app.name}
                      height="20px"
                      minH="20px"
                      src={app.logo}
                    />
                  </Flex>
                </Link>
              )}
            </Flex>
          ))}
        </Flex>
      </PopoverContent>
    </Popover>
  );
};
