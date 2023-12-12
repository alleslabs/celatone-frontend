import { Box, Button, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";

import { MobileCardTemplate } from "../MobileCardTemplate";
import { MobileLabel } from "../MobileLabel";
import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { ModuleInfo } from "lib/services/move";
import { dateFromNow, formatUTC, truncate } from "lib/utils";

export const ModulesTableMobileCard = ({ module }: { module: ModuleInfo }) => {
  const modulePath = `${truncate(module.address, [5, 7])}::${module.name}`;
  const timeStamp = new Date(module.latest_updated);
  const navigate = useInternalNavigate();
  return (
    <MobileCardTemplate
      onClick={() =>
        navigate({ pathname: `/modules/${module.address}/${module.name}` })
      }
      topContent={
        <Flex w="100%" justifyContent="space-between">
          <Box>
            <MobileLabel label="Module Path" />
            <Link href={`/modules/${module.address}/${module.name}`}>
              <Text
                color="secondary.main"
                transition="all 0.25s ease-in-out"
                _hover={{ color: "secondary.light" }}
                wordBreak={{ base: "break-all", md: "inherit" }}
                cursor="pointer"
              >
                {modulePath.toLowerCase()}
              </Text>
            </Link>
          </Box>

          <Link
            href={`/interact?address=${module.address}&moduleName=${module.name}&functionType=view`}
          >
            <Button
              border="1px solid"
              borderColor="gray.600"
              bg="inherit"
              borderRadius="8px"
              fontSize={12}
              textColor="gray.600"
              p="4px 8px"
            >
              View
            </Button>
          </Link>
        </Flex>
      }
      middleContent={
        <Flex direction="column" gap={3}>
          <Flex direction="column">
            <MobileLabel label="owner" />
            <ExplorerLink
              value={module.address}
              type="user_address"
              showCopyOnHover
            />
          </Flex>
          <Flex direction="column">
            <Text variant="body3">{formatUTC(timeStamp)}</Text>
            <Text variant="body3" color="text.dark">
              {`(${dateFromNow(timeStamp)})`}
            </Text>
          </Flex>
        </Flex>
      }
    />
  );
};
