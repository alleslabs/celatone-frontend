import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Button,
  Flex,
  Text,
} from "@chakra-ui/react";

import { CustomIcon } from "../icon";

interface ResourceDetailCardProps {
  name: string;
}
export const ResourceDetailCard = ({ name }: ResourceDetailCardProps) => {
  return (
    <Accordion allowToggle width="full">
      <AccordionItem>
        <AccordionButton>
          <Flex p={4} justifyContent="space-between" w="full">
            <Text variant="body1" fontWeight={600}>
              {name}
            </Text>
            <Flex alignItems="center" gap={2}>
              <Button
                variant="outline-primary"
                size="sm"
                leftIcon={<CustomIcon name="copy" />}
              >
                Copy JSON
              </Button>
              <CustomIcon name="chevron-down" color="gray.600" />
            </Flex>
          </Flex>
        </AccordionButton>
        <AccordionPanel p={4} borderTop="1px solid" borderColor="gray.700">
          <Flex direction="column" gap={3}>
            content goes here content goes here content goes here content goes
            here Lorem ipsum, dolor sit amet consectetur adipisicing elit. Est
            quia, impedit sed assumenda ex quibusdam earum quae, ipsum
            recusandae, saepe quaerat obcaecati labore? Aspernatur, vitae
            adipisci ex consequatur officiis at.
          </Flex>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
