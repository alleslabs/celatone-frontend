import { Button, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { CountBadge } from "lib/components/module";
import { useOpenNewTab } from "lib/hooks";

import type { Module } from "../formConstants";

interface ModulePublishCardProps {
  module: Module;
}

export const ModulePublishCard = ({ module }: ModulePublishCardProps) => {
  const openNewTab = useOpenNewTab();
  const { decodeRes, file } = module;
  return (
    <Flex
      bg="gray.900"
      border="1px solid"
      borderColor="gray.700"
      borderRadius="8px"
      direction="column"
      gap={4}
      p={4}
    >
      <Flex align="center" gap={2}>
        <CustomIcon color="primary.main" name="contract-address" />
        <Heading as="h6" variant="h6">
          {decodeRes?.abi.name}
        </Heading>
        <Flex align="center" gap={1}>
          <CountBadge
            count={
              module.decodeRes?.abi.exposed_functions.filter((fn) => fn.is_view)
                .length ?? 0
            }
            variant="view"
          />
          <CountBadge
            count={
              module.decodeRes?.abi.exposed_functions.filter(
                (fn) => !fn.is_view
              ).length ?? 0
            }
            variant="execute"
          />
        </Flex>
      </Flex>
      <Flex direction="column" gap={2}>
        {[
          {
            title: "Uploaded file",
            value: <Text variant="body2">{file?.name}</Text>,
          },
          {
            title: "Module address",
            value: (
              <ExplorerLink
                type="user_address"
                value={decodeRes?.abi.address ?? ""}
              />
            ),
          },
          {
            title: "Module name",
            value: <Text variant="body2">{decodeRes?.abi.name}</Text>,
          },
        ].map(({ title, value }) => (
          <Flex key={title} align="center" justify="space-between">
            <Text color="text.dark" fontWeight={600} variant="body2">
              {title}
            </Text>
            {value}
          </Flex>
        ))}
      </Flex>
      <Grid columnGap={4} templateColumns="1fr 1fr 1fr">
        <Button
          rightIcon={<CustomIcon boxSize={3} name="launch" />}
          variant="primary"
          onClick={() => {
            track(AmpEvent.USE_PUBLISHED_MODULE_ACTION, {
              label: "See module",
            });
            openNewTab({
              pathname: `/modules/${decodeRes?.abi.address}/${decodeRes?.abi.name}`,
              query: {},
            });
          }}
        >
          See module
        </Button>
        <Button
          leftIcon={<CustomIcon boxSize={3} color="text.main" name="query" />}
          variant="outline-white"
          onClick={() => {
            track(AmpEvent.USE_PUBLISHED_MODULE_ACTION, {
              label: "View",
              viewCount:
                module.decodeRes?.abi.exposed_functions.filter(
                  (fn) => fn.is_view
                ).length ?? 0,
            });
            openNewTab({
              pathname: "/interact",
              query: {
                address: decodeRes?.abi.address,
                functionType: "view",
                moduleName: decodeRes?.abi.name,
              },
            });
          }}
        >
          View
        </Button>
        <Button
          leftIcon={<CustomIcon boxSize={3} color="text.main" name="execute" />}
          variant="outline-white"
          onClick={() => {
            track(AmpEvent.USE_PUBLISHED_MODULE_ACTION, {
              executeCount:
                module.decodeRes?.abi.exposed_functions.filter(
                  (fn) => !fn.is_view
                ).length ?? 0,
              label: "Execute",
            });
            openNewTab({
              pathname: "/interact",
              query: {
                address: decodeRes?.abi.address,
                functionType: "execute",
                moduleName: decodeRes?.abi.name,
              },
            });
          }}
        >
          Execute
        </Button>
      </Grid>
    </Flex>
  );
};
