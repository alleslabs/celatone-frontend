import type { TextProps } from "@chakra-ui/react";
import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useMemo } from "react";

import { AmpEvent, track } from "lib/amplitude";
import {
  useConvertHexAddress,
  useCurrentChain,
  useInternalNavigate,
  useMobile,
} from "lib/app-provider";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { CopyButton } from "lib/components/copy";
import { CopyLink } from "lib/components/CopyLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { Tooltip } from "lib/components/Tooltip";
import { UpgradePolicy } from "lib/types";
import type { HexAddr, ModuleData } from "lib/types";
import { isHexModuleAddress, isHexWalletAddress, truncate } from "lib/utils";

interface ModuleTopProps {
  moduleData: ModuleData;
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
  const { convertHexWalletAddress, convertHexModuleAddress } =
    useConvertHexAddress();

  const moduleAddress = useMemo(() => {
    if (isHexWalletAddress(moduleData.address))
      return convertHexWalletAddress(moduleData.address as HexAddr);
    if (isHexModuleAddress(moduleData.address))
      return convertHexModuleAddress(moduleData.address as HexAddr);
    return moduleData.address;
  }, [convertHexModuleAddress, convertHexWalletAddress, moduleData.address]);

  const { canRepublish, republishRemark } = useMemo(() => {
    // cannot republish if upgrade policy is IMMUTABLE
    if (moduleData.upgradePolicy === UpgradePolicy.IMMUTABLE)
      return {
        canRepublish: false,
        republishRemark:
          "This module cannot be republished due to “IMMUTABLE” upgrade policy.",
      };
    // cannot republish if not connect to wallet
    if (!address)
      return {
        canRepublish: false,
        republishRemark: "You need to connect wallet to republish modules.",
      };
    // can republish if wallet addr === creator
    if (address === moduleAddress)
      return { canRepublish: true, republishRemark: null };
    // cannot republish if wallet addr !== creator
    return {
      canRepublish: false,
      republishRemark:
        "You can republish only modules that published by your account.",
    };
  }, [moduleData.upgradePolicy, moduleAddress, address]);

  return (
    <Flex direction="column">
      <Breadcrumb
        items={[
          {
            text: truncate(moduleData.address),
            href: `/accounts/${moduleData.address}`,
          },
          {
            text: "Modules",
            href: `/accounts/${moduleData.address}/modules`,
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
            mt={{ base: 2, md: 2 }}
            gap={{ base: 0, md: 2 }}
            direction={{ base: "column", md: "row" }}
          >
            <Text {...baseTextStyle} color="text.main">
              Module Path:
            </Text>
            <CopyLink
              value={`${moduleData.address}::${moduleData.moduleName}`}
              amptrackSection="module_top"
              type="module_path"
            />
          </Flex>
          <Flex
            mt={{ base: 2, md: 0 }}
            gap={{ base: 0, md: 2 }}
            direction={{ base: "column", md: "row" }}
          >
            <Text {...baseTextStyle} color="text.main">
              Creator:
            </Text>
            <ExplorerLink
              value={moduleAddress}
              ampCopierSection="module_top"
              textFormat="normal"
              maxWidth="fit-content"
              type="user_address"
              fixedHeight={false}
            />
          </Flex>
          <Flex
            mt={{ base: 2, md: 0 }}
            gap={{ base: 0, md: 2 }}
            direction={{ base: "column", md: "row" }}
          >
            <Text {...baseTextStyle} color="text.main" mt="1px">
              Friends:
            </Text>
            <Flex gap={1}>
              {moduleData.parsedAbi.friends.length ? (
                <Flex
                  display="inline"
                  sx={{
                    "> p:last-child > span": {
                      display: "none",
                    },
                  }}
                >
                  {moduleData.parsedAbi.friends.map((item) => (
                    <Text key={item} {...baseTextStyle} display="inline-flex">
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
        <Flex
          gap={{ base: 2, md: 4 }}
          mt={{ base: 8, md: 0 }}
          w={{ base: "full", md: "auto" }}
        >
          {!isMobile && (
            <>
              <Button
                variant="outline-white"
                w={{ base: "full", md: "auto" }}
                leftIcon={<CustomIcon name="query" mr={0} />}
                size={{ base: "sm", md: "md" }}
                onClick={() => {
                  track(AmpEvent.USE_MODULE_DETAILS_MAIN_CTA, {
                    label: "view",
                  });
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
                  track(AmpEvent.USE_MODULE_DETAILS_MAIN_CTA, {
                    label: "execute",
                  });
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
                  isDisabled={!canRepublish}
                  variant="outline-white"
                  w={{ base: "full", md: "auto" }}
                  leftIcon={<CustomIcon name="migrate" mr={0} />}
                  size={{ base: "sm", md: "md" }}
                  onClick={() => {
                    track(AmpEvent.USE_MODULE_DETAILS_MAIN_CTA, {
                      label: "republish",
                    });
                    navigate({
                      pathname: "/publish-module",
                    });
                  }}
                >
                  Republish
                </Button>
              </Tooltip>
            </>
          )}
          <CopyButton
            amptrackSection="[Module Detail CTA] Copy ABI "
            value={moduleData.abi}
            variant="outline-primary"
            size={{ base: "sm", md: "md" }}
            buttonText="Copy ABI"
            iconGap={2}
            w={{ base: "full", md: "auto" }}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
