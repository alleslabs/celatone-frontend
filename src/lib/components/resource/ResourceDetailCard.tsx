import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Text,
} from "@chakra-ui/react";

import { Copier, CopyButton } from "../copy";
import { CustomIcon } from "../icon";
import { trackUseExpand } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import type { InternalResource } from "lib/types";
import { parseJsonStr } from "lib/utils";

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
      <Flex alignItems="center" bg="gray.900" p={4} borderRadius={8}>
        <CustomIcon
          mr={3}
          name="alert-triangle-solid"
          boxSize={4}
          color="gray.600"
        />
        <Text textAlign="center" color="text.dark">
          Invalid Data, resource and module provided are incompatible or contain
          invalid data within the module.
        </Text>
      </Flex>
    );

  const moveResourceObject = parsedMoveResource as {
    data: Record<string, unknown>;
    type: string;
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
              p={4}
              w="full"
              justifyContent="space-between"
            >
              <Flex alignItems="center">
                <Text
                  textAlign="left"
                  variant="body1"
                  fontWeight={600}
                  wordBreak="break-word"
                >
                  {resourceData.structTag}
                </Text>
                <Copier
                  display={!isMobile ? "none" : "inline"}
                  type="resource"
                  value={resourceData.structTag}
                  copyLabel="Copied!"
                />
              </Flex>
              <Flex alignItems="center" gap={2}>
                <CopyButton
                  display={{ base: "none", md: "flex" }}
                  gap={1}
                  px={2}
                  size="xs"
                  value={resourceData.moveResource}
                  variant="outline-gray"
                  buttonText="Copy JSON"
                />
                <AccordionIcon color="gray.600" />
              </Flex>
            </Flex>
          </AccordionButton>
          <AccordionPanel
            p={4}
            borderColor="gray.700"
            borderTop="1px solid"
            borderTopRadius={0}
          >
            <Flex gap={3} direction="column">
              {formattedArray.map((item) => (
                <Flex
                  key={item.key}
                  gap={{ base: 1, md: 4 }}
                  direction={{ base: "column", md: "row" }}
                >
                  <Text
                    minW={40}
                    variant="body2"
                    color="text.dark"
                    fontWeight="600"
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
