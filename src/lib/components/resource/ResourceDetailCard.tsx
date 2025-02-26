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
import type { InternalResource } from "lib/types";
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

  // Handle fallback case where the move resource is invalid
  // TODO: revisit later
  if (parsedMoveResource === "")
    return (
      <Flex bg="gray.900" p={4} borderRadius={8} alignItems="center">
        <CustomIcon
          name="alert-triangle-solid"
          color="gray.600"
          boxSize={4}
          mr={3}
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
              p={4}
              justifyContent="space-between"
              w="full"
              align="center"
              className="copier-wrapper"
            >
              <Flex alignItems="center">
                <Text
                  variant="body1"
                  fontWeight={600}
                  textAlign="left"
                  wordBreak="break-word"
                >
                  {resourceData.structTag}
                </Text>
                <Copier
                  type="resource"
                  display={!isMobile ? "none" : "inline"}
                  value={resourceData.structTag}
                  copyLabel="Copied!"
                />
              </Flex>
              <Flex alignItems="center" gap={2}>
                <CopyButton
                  value={resourceData.moveResource}
                  variant="outline-gray"
                  size="xs"
                  gap={1}
                  px={2}
                  buttonText="Copy JSON"
                  display={{ base: "none", md: "flex" }}
                />
                <AccordionIcon color="gray.600" />
              </Flex>
            </Flex>
          </AccordionButton>
          <AccordionPanel
            p={4}
            borderTop="1px solid"
            borderColor="gray.700"
            borderTopRadius={0}
          >
            <Flex direction="column" gap={3}>
              {formattedArray.map((item) => (
                <Flex
                  key={item.key}
                  gap={{ base: 1, md: 4 }}
                  direction={{ base: "column", md: "row" }}
                >
                  <Text
                    variant="body2"
                    color="text.dark"
                    fontWeight="600"
                    minW={40}
                  >
                    {item.key}
                  </Text>
                  {typeof item.value === "object" ? (
                    <Text
                      variant="body2"
                      color="text.main"
                      wordBreak="break-all"
                    >
                      {JSON.stringify(item.value)}
                    </Text>
                  ) : (
                    <Text
                      variant="body2"
                      color="text.main"
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
