import {
  Flex,
  Text,
  Switch,
  FormControl,
  FormLabel,
  Button,
  Heading,
} from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import type { CSSProperties, Dispatch, SetStateAction } from "react";
import { useEffect, useRef } from "react";

import { usePoolConfig, useGovConfig, useWasmConfig } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import type { IconKeys } from "lib/components/icon";
import { CustomIcon } from "lib/components/icon";
import { MotionBox } from "lib/components/MotionBox";
import { Tooltip } from "lib/components/Tooltip";
import { useIsCurrentPage } from "lib/hooks";
import type { Option } from "lib/types";

interface SubHeaderMenuInfo {
  name: string;
  slug: string;
  icon: IconKeys;
}

const boxShadow = "0px 4px 8px 0px var(--chakra-colors-gray-900)";
const FirstLandPrompt = ({
  setIsDevMode,
}: {
  setIsDevMode: Dispatch<SetStateAction<Option<boolean>>>;
}) => (
  <AnimatePresence>
    <MotionBox
      key="modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        delay: "1",
        duration: "0.5",
        ease: "easeInOut",
      }}
      position="absolute"
      right="24px"
      mt={1}
      gap={2}
      p={6}
      display="flex"
      flexDirection="column"
      bg="gray.800"
      w="430px"
      borderRadius={4}
      boxShadow={boxShadow}
      zIndex="popover"
    >
      <Flex>
        <Heading as="h6" variant="h6" fontWeight={600}>
          Want to
          <Text as="span" color="accent.main" pl={1}>
            Deploy, Query, or Execute?
          </Text>
        </Heading>
      </Flex>
      <Text variant="body2" color="text.main" my={1}>
        Turn on Dev Features to get full access to our deploy, query, execute
        and other developer features through{" "}
        <Text as="span" fontWeight={600}>
          sidebar navigation
        </Text>
        .
      </Text>
      <Flex direction="column" gap={2}>
        <Button onClick={() => setIsDevMode(true)}>Turn on Dev Feature!</Button>
        <Button variant="outline-primary" onClick={() => setIsDevMode(false)}>
          Use Celatone as Explorer
        </Button>
        <Text variant="body3" textAlign="center" color="text.dark">
          You can change it back anytime
        </Text>
      </Flex>
    </MotionBox>
  </AnimatePresence>
);

interface SubHeaderProps {
  isExpand: boolean;
  isDevMode: Option<boolean>;
  setIsDevMode: Dispatch<SetStateAction<Option<boolean>>>;
  setIsExpand: Dispatch<SetStateAction<boolean>>;
}
const SubHeader = ({
  isExpand,
  isDevMode,
  setIsDevMode,
  setIsExpand,
}: SubHeaderProps) => {
  const wasmConfig = useWasmConfig({ shouldRedirect: false });
  const poolConfig = usePoolConfig({ shouldRedirect: false });
  const govConfig = useGovConfig({ shouldRedirect: false });

  const prevIsDevModeRef = useRef<boolean>(Boolean(isDevMode));

  const subHeaderMenu: SubHeaderMenuInfo[] = [
    { name: "Overview", slug: "/", icon: "home" },
    { name: "Transactions", slug: "/txs", icon: "file" },
    { name: "Blocks", slug: "/blocks", icon: "block" },
    ...(wasmConfig.enabled
      ? ([
          { name: "Codes", slug: "/codes", icon: "code" },
          { name: "Contracts", slug: "/contracts", icon: "contract-address" },
        ] as const)
      : []),
    ...(govConfig.enabled
      ? ([{ name: "Proposals", slug: "/proposals", icon: "proposal" }] as const)
      : []),
    ...(poolConfig.enabled
      ? ([{ name: "Osmosis Pools", slug: "/pools", icon: "pool" }] as const)
      : []),
  ];
  const isCurrentPage = useIsCurrentPage();

  const activeColor = "primary.light";

  const switchHighlight: CSSProperties = {
    borderRadius: "4px",
    padding: "6px 8px",
    backgroundColor: "var(--chakra-colors-gray-700)",
  };

  useEffect(() => {
    // Basic to dev and nav is  collapse -> should exapnd
    if (isDevMode && !prevIsDevModeRef.current && !isExpand) setIsExpand(true);
    prevIsDevModeRef.current = Boolean(isDevMode);
  }, [isDevMode, isExpand, setIsExpand]);

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
        <FormControl
          display="flex"
          alignItems="center"
          width="fit-content"
          style={isDevMode === undefined ? switchHighlight : undefined}
        >
          <FormLabel mb={0} cursor="pointer" mr={2}>
            <Tooltip
              label="Enable to access to our deploy, query, execute, and other developer features."
              placement="bottom"
              isDisabled={isDevMode === undefined}
            >
              <Text variant="body2" color="text.dark" fontWeight={600}>
                Dev Features
              </Text>
            </Tooltip>
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
