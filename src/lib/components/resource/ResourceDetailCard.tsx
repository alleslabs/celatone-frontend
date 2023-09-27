import type { ExpandedIndex } from "@chakra-ui/react";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Flex,
  Text,
} from "@chakra-ui/react";

import { CopyButton } from "../copy";
import { CustomIcon } from "../icon";
import type { IndexedResource } from "lib/services/move/resourceService";

interface ResourceDetailCardProps {
  resourceData: IndexedResource;
  defaultIndex: ExpandedIndex;
}
export const ResourceDetailCard = ({
  resourceData,
  defaultIndex,
}: ResourceDetailCardProps) => {
  const moveResourceObject = JSON.parse(resourceData.moveResource);
  const dataObject = moveResourceObject.data;
  const formattedArray: { key: string; value: unknown }[] = Object.entries(
    dataObject
  ).map(([key, value]) => ({
    key: key as string,
    value: value as unknown,
  }));

  return (
    <Accordion allowMultiple width="full" defaultIndex={defaultIndex}>
      <AccordionItem>
        <AccordionButton>
          <Flex p={4} justifyContent="space-between" w="full" align="center">
            <Text variant="body1" fontWeight={600} textAlign="left">
              {resourceData.structTag}
            </Text>
            <Flex alignItems="center" gap={2}>
              {/* TODO  <button> cannot appear as a descendant of <button> */}
              <CopyButton
                value={resourceData.moveResource}
                variant="outline-primary"
                size="sm"
                buttonText="Copy JSON"
              />
              <CustomIcon name="chevron-down" color="gray.600" />
            </Flex>
          </Flex>
        </AccordionButton>
        <AccordionPanel p={4} borderTop="1px solid" borderColor="gray.700">
          <Flex direction="column" gap={3}>
            {formattedArray.map((item) => (
              <Flex gap={4}>
                <Text variant="body2" color="text.dark" w={52}>
                  {item.key}
                </Text>
                {typeof item.value === "object" ? (
                  <Text variant="body2" color="text.main">
                    {JSON.stringify(item.value)}
                  </Text>
                ) : (
                  <Text variant="body2" color="text.main">
                    {item.value?.toString()}
                  </Text>
                )}
              </Flex>
            ))}
          </Flex>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
