import type { InternalResource } from "lib/types";

import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Text,
} from "@chakra-ui/react";
import { trackUseExpand } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import { parseJsonStr } from "lib/utils";

import { Copier, CopyButton } from "../copy";
import { CustomIcon } from "../icon";

interface ResourceDetailCardProps {
  resourceData: InternalResource;
}

export const ResourceDetailCard = ({
  resourceData,
}: ResourceDetailCardProps) => {
  const parsedMoveResource = parseJsonStr(resourceData.moveResource);
  const isMobile = useMobile();

  // Handle fallback case where the Move resource is invalid
  // TODO: revisit later
  if (parsedMoveResource === "")
    return (
      <Flex alignItems="center" bg="gray.900" borderRadius={8} p={4}>
        <CustomIcon
          boxSize={4}
          color="gray.600"
          mr={3}
          name="alert-triangle-solid"
        />
        <Text color="text.dark" textAlign="center">
          Invalid Data, resource and module provided are incompatible or contain
          invalid data within the module.
        </Text>
      </Flex>
    );

  const moveResourceObject = parsedMoveResource as {
    type: string;
    data: Record<string, unknown>;
  };

  const formattedArray: { key: string; value: unknown }[] = Object.entries(
    moveResourceObject.data
  ).map(([key, value]) => ({
    key: key as string,
    value: value as unknown,
  }));

  return (
    <AccordionItem mb={4}>
      {({ isExpanded }) => (
        <>
          <AccordionButton
            onClick={() =>
              trackUseExpand({
                action: !isExpanded ? "expand" : "collapse",
                component: "resources_detail_card",
                section: "account detail resource tab",
              })
            }
          >
            <Flex
              className="copier-wrapper"
              align="center"
              justifyContent="space-between"
              p={4}
              w="full"
            >
              <Flex alignItems="center">
                <Text
                  fontWeight={600}
                  textAlign="left"
                  variant="body1"
                  wordBreak="break-word"
                >
                  {resourceData.structTag}
                </Text>
                <Copier
                  copyLabel="Copied!"
                  display={!isMobile ? "none" : "inline"}
                  type="resource"
                  value={resourceData.structTag}
                />
              </Flex>
              <Flex alignItems="center" gap={2}>
                <CopyButton
                  buttonText="Copy JSON"
                  display={{ base: "none", md: "flex" }}
                  gap={1}
                  px={2}
                  size="xs"
                  value={resourceData.moveResource}
                  variant="outline-gray"
                />
                <AccordionIcon color="gray.600" />
              </Flex>
            </Flex>
          </AccordionButton>
          <AccordionPanel
            borderColor="gray.700"
            borderStyle="solid"
            borderTopRadius={0}
            borderTopWidth="1px"
            p={4}
          >
            <Flex direction="column" gap={3}>
              {formattedArray.map((item) => (
                <Flex
                  key={item.key}
                  direction={{ base: "column", md: "row" }}
                  gap={{ base: 1, md: 4 }}
                >
                  <Text
                    color="text.dark"
                    fontWeight="600"
                    minW={40}
                    variant="body2"
                  >
                    {item.key}
                  </Text>
                  {typeof item.value === "object" ? (
                    <Text
                      color="text.main"
                      variant="body2"
                      wordBreak="break-all"
                    >
                      {JSON.stringify(item.value)}
                    </Text>
                  ) : (
                    <Text
                      color="text.main"
                      variant="body2"
                      wordBreak="break-word"
                    >
                      {item.value?.toString()}
                    </Text>
                  )}
                </Flex>
              ))}
            </Flex>
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  );
};
