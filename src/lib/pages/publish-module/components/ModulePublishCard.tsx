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
  const { file, decodeRes } = module;
  return (
    <Flex
      bg="gray.900"
      border="1px solid"
      borderColor="gray.700"
      borderRadius="8px"
      p={4}
      direction="column"
      gap={4}
    >
      <Flex align="center" gap={2}>
        <CustomIcon name="contract-address" color="primary.main" />
        <Heading variant="h6" as="h6">
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
            <Text variant="body2" color="text.dark" fontWeight={600}>
              {title}
            </Text>
            {value}
          </Flex>
        ))}
      </Flex>
      <Grid templateColumns="1fr 1fr 1fr" columnGap={4}>
        <Button
          rightIcon={<CustomIcon name="launch" boxSize={3} />}
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
        >
          See Module
        </Button>
        <Button
          leftIcon={<CustomIcon name="query" boxSize={3} color="text.main" />}
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
                moduleName: decodeRes?.abi.name,
                functionType: "view",
              },
            });
          }}
        >
          View
        </Button>
        <Button
          leftIcon={<CustomIcon name="execute" boxSize={3} color="text.main" />}
          variant="outline-white"
          onClick={() => {
            track(AmpEvent.USE_PUBLISHED_MODULE_ACTION, {
              label: "Execute",
              executeCount:
                module.decodeRes?.abi.exposed_functions.filter(
                  (fn) => !fn.is_view
                ).length ?? 0,
            });
            openNewTab({
              pathname: "/interact",
              query: {
                address: decodeRes?.abi.address,
                moduleName: decodeRes?.abi.name,
                functionType: "execute",
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
