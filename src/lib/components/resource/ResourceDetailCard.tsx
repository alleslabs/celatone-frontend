import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Text,
} from "@chakra-ui/react";

import { CopyButton } from "../copy";
import { CustomIcon } from "../icon";
import type { InternalResource } from "lib/types";
import { parseJsonStr } from "lib/utils";

interface ResourceDetailCardProps {
  resourceData: InternalResource;
}

export const ResourceDetailCard = ({
  resourceData,
}: ResourceDetailCardProps) => {
  // TODO Revisit later
  if (resourceData.moveResource === '""')
    return (
      <Flex bg="gray.900" p={4} borderRadius={8} alignItems="center">
        <CustomIcon
          name="alert-circle-solid"
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

  const moveResourceObject = parseJsonStr(resourceData.moveResource) as {
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
      <AccordionButton>
        <Flex
          p={4}
          justifyContent="space-between"
          w="full"
          align="center"
          gap={8}
        >
          <Text
            variant="body1"
            fontWeight={600}
            textAlign="left"
            wordBreak="break-word"
          >
            {resourceData.structTag}
          </Text>
          <Flex alignItems="center" gap={2} minW={36}>
            <CopyButton
              value={resourceData.moveResource}
              variant="outline-primary"
              size="xs"
              buttonText="Copy JSON"
            />
            <AccordionIcon color="gray.600" />
          </Flex>
        </Flex>
      </AccordionButton>
      <AccordionPanel p={4} borderTop="1px solid" borderColor="gray.700">
        <Flex direction="column" gap={3}>
          {formattedArray.map((item) => (
            <Flex key={item.key} gap={4}>
              <Text variant="body2" color="text.dark" minW={40}>
                {item.key}
              </Text>
              {typeof item.value === "object" ? (
                <Text variant="body2" color="text.main" wordBreak="break-all">
                  {JSON.stringify(item.value)}
                </Text>
              ) : (
                <Text variant="body2" color="text.main" wordBreak="break-word">
                  {item.value?.toString()}
                </Text>
              )}
            </Flex>
          ))}
        </Flex>
      </AccordionPanel>
    </AccordionItem>
  );
};
