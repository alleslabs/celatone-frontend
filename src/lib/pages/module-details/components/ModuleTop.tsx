import { Button, Flex, Heading, Text } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { CopyLink } from "lib/components/CopyLink";
import { CustomIcon } from "lib/components/icon";
import { Tooltip } from "lib/components/Tooltip";

interface ModuleTopProps {
  isVerified?: boolean;
}

export const ModuleTop = ({ isVerified = false }: ModuleTopProps) => {
  const isMobile = useMobile();
  //   TODO Name
  const displayName = "Module Name";

  return (
    <Flex direction="column">
      <Breadcrumb
        items={[
          { text: "TODO Account Address", href: "/" },
          { text: "Module" },
          { text: "Module Name" },
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
              {displayName}
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
            <Text
              color="text.dark"
              variant="body2"
              fontWeight={500}
              whiteSpace="nowrap"
            >
              Module Path:
            </Text>
            {/* TODO module path */}
            <Flex>
              <Text
                color="text.main"
                variant="body2"
                fontWeight={500}
                whiteSpace="nowrap"
              >
                cltn13a2sywe6g4a9w84g98w4g1dasdrfafdstlju97::
              </Text>
              <Text
                color="text.main"
                variant="body2"
                fontWeight={500}
                whiteSpace="nowrap"
              >
                beeb
              </Text>
            </Flex>
          </Flex>
          <Flex
            mt={{ base: 2, md: 0 }}
            gap={{ base: 0, md: 2 }}
            direction={{ base: "column", md: "row" }}
          >
            <Text
              color="text.dark"
              variant="body2"
              fontWeight={500}
              whiteSpace="nowrap"
            >
              Creator:
            </Text>
            {/* TODO Creator */}
            <CopyLink
              value="cltn1m9y7um59yxtmek68qkwg3ykm28s52rrell6prx"
              amptrackSection="contract_top"
              type="contract_address"
            />
          </Flex>
          <Flex
            mt={{ base: 2, md: 0 }}
            gap={{ base: 0, md: 2 }}
            direction={{ base: "column", md: "row" }}
          >
            <Text
              color="text.dark"
              variant="body2"
              fontWeight={500}
              whiteSpace="nowrap"
            >
              Friends:
            </Text>
            {/* TODO Friends */}
            <Flex gap={1}>
              <Text
                color="text.dark"
                variant="body2"
                fontWeight={500}
                whiteSpace="nowrap"
              >
                0x1::any,
              </Text>
              <Text
                color="text.dark"
                variant="body2"
                fontWeight={500}
                whiteSpace="nowrap"
              >
                0x1::copyable_any
              </Text>
              <Text
                color="text.dark"
                variant="body2"
                fontWeight={500}
                whiteSpace="nowrap"
              >
                0x1::copyable_any::function_name
              </Text>
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
          >
            View
          </Button>
          <Button
            variant="outline-primary"
            w={{ base: "full", md: "auto" }}
            leftIcon={<CustomIcon name="execute" />}
            size={{ base: "sm", md: "md" }}
          >
            Execute
          </Button>
          <Button
            variant="outline-primary"
            w={{ base: "full", md: "auto" }}
            leftIcon={<CustomIcon name="copy" />}
            size={{ base: "sm", md: "md" }}
          >
            Copy ABI
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};
