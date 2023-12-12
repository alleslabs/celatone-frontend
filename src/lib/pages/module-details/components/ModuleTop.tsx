import type { TextProps } from "@chakra-ui/react";
import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useMemo } from "react";

import { AmpEvent, track } from "lib/amplitude";
import {
  useCurrentChain,
  useInternalNavigate,
  useMobile,
} from "lib/app-provider";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { CopyButton } from "lib/components/copy";
import { CopyLink } from "lib/components/CopyLink";
import { CustomIcon } from "lib/components/icon";
import { Tooltip } from "lib/components/Tooltip";
import type { IndexedModule } from "lib/services/move/moduleService";
import type { HumanAddr } from "lib/types";
import { UpgradePolicy } from "lib/types";
import { bech32AddressToHex } from "lib/utils";

interface ModuleTopProps {
  moduleData: IndexedModule;
  isVerified: boolean;
}

const baseTextStyle: TextProps = {
  color: "text.dark",
  variant: "body2",
  fontWeight: 500,
  whiteSpace: "nowrap",
};

export const ModuleTop = ({ moduleData, isVerified }: ModuleTopProps) => {
  const isMobile = useMobile();
  const navigate = useInternalNavigate();
  const { address } = useCurrentChain();

  const { canRepublish, republishRemark } = useMemo(() => {
    // cannot republish if not connect to wallet
    if (moduleData.upgradePolicy === UpgradePolicy.IMMUTABLE)
      return {
        canRepublish: false,
        republishRemark:
          "This module cannot be republished due to “IMMUTABLE” upgrade policy.",
      };
    if (!address)
      return {
        canRepublish: false,
        republishRemark: "You need to connect wallet to republish modules.",
      };
    // cannot republish if upgrade policy is IMMUTABLE
    // can republish if wallet addr === creator
    if (bech32AddressToHex(address as HumanAddr) === moduleData.address)
      return { canRepublish: true, republishRemark: null };
    // cannot republish if wallet addr !== creator
    return {
      canRepublish: false,
      republishRemark:
        "You can republish only modules that published by your account.",
    };
  }, [moduleData.upgradePolicy, moduleData.address, address]);

  return (
    <Flex direction="column">
      <Breadcrumb
        items={[
          {
            text: moduleData.parsedAbi.address,
            href: `/accounts/${moduleData.parsedAbi.address}`,
          },
          {
            text: "Modules",
            href: `/accounts/${moduleData.parsedAbi.address}/modules`,
          },
          { text: moduleData.moduleName },
        ]}
      />
      <Flex
        justify="space-between"
        mt={{ base: 3, md: 6 }}
        direction={{ base: "column", md: "row" }}
        gap={{ md: 4 }}
      >
        <Flex
          direction="column"
          textOverflow="ellipsis"
          gap={{ base: 2, md: 1 }}
        >
          <Flex
            gap={1}
            align={{ base: "start", md: "center" }}
            maxW={{ md: "670px" }}
          >
            <CustomIcon
              name="contract-address"
              boxSize={5}
              color="secondary.main"
            />
            <Heading
              as="h5"
              mt={{ base: 1, md: 0 }}
              ml={{ base: 1, md: 0 }}
              variant={{ base: "h6", md: "h5" }}
              className={!isMobile ? "ellipsis" : ""}
            >
              {moduleData.moduleName}
            </Heading>
            {isVerified && (
              <Tooltip label="This module's verification is supported by its provided source code.">
                <Flex>
                  <CustomIcon
                    name="check-circle-solid"
                    boxSize={5}
                    color="success.main"
                  />
                </Flex>
              </Tooltip>
            )}
          </Flex>
          <Flex
            mt={{ base: 2, md: 0 }}
            gap={{ base: 0, md: 2 }}
            direction={{ base: "column", md: "row" }}
          >
            <Text {...baseTextStyle} color="text.main">
              Module Path:
            </Text>
            <Text {...baseTextStyle} whiteSpace="normal">
              {moduleData.parsedAbi.address}::{moduleData.parsedAbi.name}
            </Text>
          </Flex>
          <Flex
            mt={{ base: 2, md: 0 }}
            gap={{ base: 0, md: 2 }}
            direction={{ base: "column", md: "row" }}
          >
            <Text {...baseTextStyle} color="text.main">
              Creator:
            </Text>
            <CopyLink
              value={moduleData.parsedAbi.address}
              amptrackSection="contract_top"
              type="contract_address"
            />
          </Flex>
          <Flex
            mt={{ base: 2, md: 0 }}
            gap={{ base: 0, md: 2 }}
            direction={{ base: "column", md: "row" }}
          >
            <Text {...baseTextStyle} color="text.main">
              Friends:
            </Text>
            <Flex gap={1}>
              {moduleData.parsedAbi.friends.length ? (
                <Flex
                  sx={{
                    "> p:last-child > span": {
                      display: "none",
                    },
                  }}
                >
                  {moduleData.parsedAbi.friends.map((item) => (
                    <Text {...baseTextStyle}>
                      {item}
                      <span>,&nbsp;</span>
                    </Text>
                  ))}
                </Flex>
              ) : (
                <Text {...baseTextStyle}>-</Text>
              )}
            </Flex>
          </Flex>
        </Flex>
        {!isMobile && (
          <Flex
            gap={{ base: 2, md: 4 }}
            mt={{ base: 8, md: 0 }}
            w={{ base: "full", md: "auto" }}
          >
            <Button
              variant="outline-white"
              w={{ base: "full", md: "auto" }}
              leftIcon={<CustomIcon name="query" mr={0} />}
              size={{ base: "sm", md: "md" }}
              onClick={() => {
                track(AmpEvent.USE_MAIN_CTA, { label: "View" });
                navigate({
                  pathname: "/interact",
                  query: {
                    address: moduleData.address,
                    moduleName: moduleData.moduleName,
                    functionType: "view",
                  },
                });
              }}
            >
              View
            </Button>
            <Button
              variant="outline-white"
              w={{ base: "full", md: "auto" }}
              leftIcon={<CustomIcon name="execute" mr={0} />}
              size={{ base: "sm", md: "md" }}
              onClick={() => {
                track(AmpEvent.USE_MAIN_CTA, { label: "Execute" });
                navigate({
                  pathname: "/interact",
                  query: {
                    address: moduleData.address,
                    moduleName: moduleData.moduleName,
                    functionType: "execute",
                  },
                });
              }}
            >
              Execute
            </Button>
            <Tooltip
              variant="primary-light"
              label={republishRemark}
              closeOnClick={false}
            >
              <Button
                disabled={!canRepublish}
                variant="outline-white"
                w={{ base: "full", md: "auto" }}
                leftIcon={<CustomIcon name="migrate" mr={0} />}
                size={{ base: "sm", md: "md" }}
                onClick={() => {
                  track(AmpEvent.USE_MAIN_CTA, { label: "View" });
                  navigate({
                    pathname: "/publish-module",
                  });
                }}
              >
                Republish
              </Button>
            </Tooltip>
            <CopyButton
              amptrackSection="[Module Detail CTA] Copy ABI "
              value={moduleData.abi}
              variant="outline-primary"
              size={{ base: "sm", md: "md" }}
              buttonText="Copy ABI"
              iconGap={2}
            />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};
