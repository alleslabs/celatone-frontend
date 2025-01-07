import { Button, Flex, Grid, Heading, Text } from "@chakra-ui/react";

import type { Module } from "../formConstants";
import { AmpEvent, track } from "lib/amplitude";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { CountBadge } from "lib/components/module";
import { useOpenNewTab } from "lib/hooks";

interface ModulePublishCardProps {
  module: Module;
}

export const ModulePublishCard = ({ module }: ModulePublishCardProps) => {
  const openNewTab = useOpenNewTab();
  const { decodeRes, file } = module;
  return (
    <Flex
      bg="gray.900"
      gap={4}
      p={4}
      border="1px solid"
      borderColor="gray.700"
      borderRadius="8px"
      direction="column"
    >
      <Flex align="center" gap={2}>
        <CustomIcon name="contract-address" color="primary.main" />
        <Heading as="h6" variant="h6">
          {decodeRes?.abi.name}
        </Heading>
        <Flex align="center" gap={1}>
          <CountBadge
            variant="view"
            count={
              module.decodeRes?.abi.exposed_functions.filter((fn) => fn.is_view)
                .length ?? 0
            }
          />
          <CountBadge
            variant="execute"
            count={
              module.decodeRes?.abi.exposed_functions.filter(
                (fn) => !fn.is_view
              ).length ?? 0
            }
          />
        </Flex>
      </Flex>
      <Flex gap={2} direction="column">
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
            <Text variant="body2" color="text.dark" fontWeight={600}>
              {title}
            </Text>
            {value}
          </Flex>
        ))}
      </Flex>
      <Grid columnGap={4} templateColumns="1fr 1fr 1fr">
        <Button
          variant="primary"
          onClick={() => {
            track(AmpEvent.USE_PUBLISHED_MODULE_ACTION, {
              label: "See Module",
            });
            openNewTab({
              pathname: `/modules/${decodeRes?.abi.address}/${decodeRes?.abi.name}`,
              query: {},
            });
          }}
          rightIcon={<CustomIcon name="launch" boxSize={3} />}
        >
          See Module
        </Button>
        <Button
          variant="outline-white"
          leftIcon={<CustomIcon name="query" boxSize={3} color="text.main" />}
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
          variant="outline-white"
          leftIcon={<CustomIcon name="execute" boxSize={3} color="text.main" />}
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
