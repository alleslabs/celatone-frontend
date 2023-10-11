import type { TextProps } from "@chakra-ui/react";
import { Button, Flex, Heading, Text } from "@chakra-ui/react";

import { useInternalNavigate, useMobile } from "lib/app-provider";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { CopyButton } from "lib/components/copy";
import { CopyLink } from "lib/components/CopyLink";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { Tooltip } from "lib/components/Tooltip";
import type { ModuleVerificationInternal } from "lib/services/module";
import type { IndexedModule } from "lib/services/moduleService";

interface ModuleTopProps {
  moduleData: IndexedModule;
  verificationData: ModuleVerificationInternal | null | undefined;
}

const baseTextStyle: TextProps = {
  color: "text.dark",
  variant: "body2",
  fontWeight: 500,
  whiteSpace: "nowrap",
};

export const ModuleTop = ({ moduleData, verificationData }: ModuleTopProps) => {
  const isMobile = useMobile();
  const navigate = useInternalNavigate();
  if (!moduleData) return <Loading />;

  return (
    <Flex direction="column">
      <Breadcrumb
        items={[
          // TODO recheck how to get account
          {
            text: moduleData.parsedAbi.address,
            href: `/accounts/${moduleData.parsedAbi.address}`,
          },
          { text: "Modules" },
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
            {verificationData && (
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
            <Text {...baseTextStyle}>
              {moduleData.parsedAbi.address}::
              {moduleData.parsedAbi.name}
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
                      <span>,</span>
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
          <Button
            variant="outline-primary"
            w={{ base: "full", md: "auto" }}
            leftIcon={<CustomIcon name="query" />}
            size={{ base: "sm", md: "md" }}
            onClick={() =>
              navigate({
                pathname: "/interact",
                query: {
                  address: moduleData.address,
                  moduleName: moduleData.moduleName,
                  functionType: "view",
                },
              })
            }
          >
            View
          </Button>
          <Button
            variant="outline-primary"
            w={{ base: "full", md: "auto" }}
            leftIcon={<CustomIcon name="execute" />}
            size={{ base: "sm", md: "md" }}
            onClick={() =>
              navigate({
                pathname: "/interact",
                query: {
                  address: moduleData.address,
                  moduleName: moduleData.moduleName,
                  functionType: "execute",
                },
              })
            }
          >
            Execute
          </Button>
          <CopyButton
            value={moduleData.abi}
            variant="outline-primary"
            size={{ base: "sm", md: "md" }}
            buttonText="Copy ABI"
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
