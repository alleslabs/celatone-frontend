import type { TextProps } from "@chakra-ui/react";
import type { Addr, IndexedModule, MoveVerifyStatus } from "lib/types";

import { Button, Flex, Heading, Text } from "@chakra-ui/react";
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
import { MoveVerifyBadge } from "lib/components/MoveVerifyBadge";
import { Tooltip } from "lib/components/Tooltip";
import { UpgradePolicy } from "lib/types";
import {
  isHexModuleAddress,
  isHexWalletAddress,
  mergeModulePath,
  truncate,
} from "lib/utils";
import { useMemo } from "react";

interface ModuleTopProps {
  moduleData: IndexedModule;
  moveVerifyStatus: MoveVerifyStatus;
}

const baseTextStyle: TextProps = {
  color: "text.dark",
  fontWeight: 500,
  variant: "body2",
  whiteSpace: "nowrap",
};

const ModuleCta = ({
  moduleAddress,
  moduleData,
}: {
  moduleAddress: Addr;
  moduleData: IndexedModule;
}) => {
  const isMobile = useMobile();
  const navigate = useInternalNavigate();
  const { address } = useCurrentChain();

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
    <Flex
      gap={{ base: 2, md: 3 }}
      justifyContent={{ md: "end" }}
      mt={{ base: 4, md: 0 }}
      w={{ base: "full", md: "auto" }}
    >
      <Button
        leftIcon={<CustomIcon mr={0} name="query" />}
        size={{ base: "sm", md: "md" }}
        variant="outline-white"
        w={{ base: "full", md: "auto" }}
        onClick={() => {
          track(AmpEvent.USE_MODULE_DETAILS_MAIN_CTA, {
            label: "view",
          });
          navigate({
            pathname: "/interact",
            query: {
              address: moduleData.address,
              functionType: "view",
              moduleName: moduleData.moduleName,
            },
          });
        }}
      >
        View
      </Button>
      {!isMobile && (
        <>
          <Button
            leftIcon={<CustomIcon mr={0} name="execute" />}
            variant="outline-white"
            onClick={() => {
              track(AmpEvent.USE_MODULE_DETAILS_MAIN_CTA, {
                label: "execute",
              });
              navigate({
                pathname: "/interact",
                query: {
                  address: moduleData.address,
                  functionType: "execute",
                  moduleName: moduleData.moduleName,
                },
              });
            }}
          >
            Execute
          </Button>
          <Tooltip
            closeOnClick={false}
            label={republishRemark}
            variant="primary-light"
          >
            <Button
              isDisabled={!canRepublish}
              leftIcon={<CustomIcon mr={0} name="migrate" />}
              variant="outline-white"
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
        buttonText="Copy ABI"
        iconGap={2}
        size={{ base: "sm", md: "md" }}
        value={moduleData.abi}
        variant="outline-primary"
        w={{ base: "full", md: "auto" }}
      />
    </Flex>
  );
};

export const ModuleTop = ({ moduleData, moveVerifyStatus }: ModuleTopProps) => {
  const isMobile = useMobile();

  const { convertHexModuleAddress, convertHexWalletAddress } =
    useConvertHexAddress();

  const moduleAddress = useMemo(() => {
    if (isHexWalletAddress(moduleData.address))
      return convertHexWalletAddress(moduleData.address);
    if (isHexModuleAddress(moduleData.address))
      return convertHexModuleAddress(moduleData.address);
    return moduleData.address;
  }, [convertHexModuleAddress, convertHexWalletAddress, moduleData.address]);

  return (
    <Flex direction="column">
      <Breadcrumb
        items={[
          {
            href: `/accounts/${moduleData.address}`,
            text: truncate(moduleData.address),
          },
          {
            href: `/accounts/${moduleData.address}/modules`,
            text: "Modules",
          },
          { text: moduleData.moduleName },
        ]}
      />
      <Flex
        alignItems={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }}
        justifyContent="space-between"
        mb={3}
        mt={5}
        w="full"
      >
        <Flex
          align={{ base: "start", md: "center" }}
          gap={1}
          maxW={{ md: "640px" }}
        >
          <CustomIcon
            boxSize={5}
            color="primary.main"
            name="contract-address"
          />
          <Heading
            className={!isMobile ? "ellipsis" : ""}
            as="h5"
            ml={{ base: 1, md: 0 }}
            mt={{ base: 1, md: 0 }}
            variant={{ base: "h6", md: "h5" }}
          >
            {moduleData.moduleName}
          </Heading>
          <MoveVerifyBadge hasTooltip status={moveVerifyStatus} />
        </Flex>
        {!isMobile && (
          <ModuleCta moduleAddress={moduleAddress} moduleData={moduleData} />
        )}
      </Flex>
      <Flex direction="column" gap={{ base: 2, md: 1 }} textOverflow="ellipsis">
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={{ base: 0, md: 2 }}
          mt={{ base: 2, md: 2 }}
        >
          <Text {...baseTextStyle} color="text.main">
            Module path:
          </Text>
          <CopyLink
            amptrackSection="module_top"
            type="module_path"
            value={mergeModulePath(moduleData.address, moduleData.moduleName)}
          />
        </Flex>
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={{ base: 0, md: 2 }}
          mt={{ base: 2, md: 0 }}
        >
          <Text {...baseTextStyle} color="text.main">
            Creator:
          </Text>
          <ExplorerLink
            ampCopierSection="module_top"
            fixedHeight={false}
            maxWidth="fit-content"
            textFormat="normal"
            type="user_address"
            value={moduleAddress}
          />
        </Flex>
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={{ base: 0, md: 2 }}
          mt={{ base: 2, md: 0 }}
        >
          <Text {...baseTextStyle} color="text.main" mt="1px">
            Friends:
          </Text>
          <Flex gap={1} wordBreak="break-all">
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
      {isMobile && (
        <ModuleCta moduleAddress={moduleAddress} moduleData={moduleData} />
      )}
    </Flex>
  );
};
