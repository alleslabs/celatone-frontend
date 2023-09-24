import {
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Flex,
  IconButton,
  chakra,
  Text,
  Tag,
} from "@chakra-ui/react";

import { CustomIcon } from "../icon";
import { LabelText } from "../LabelText";
import type { Struct } from "lib/types";

interface StructCardProps {
  struct: Struct;
}

const StyledIconButton = chakra(IconButton, {
  baseStyle: {
    display: "flex",
    alignItems: "center",
    fontSize: "24px",
    color: "gray.600",
  },
});
export const StructCard = ({ struct }: StructCardProps) => {
  const structAbilities = ["copy", "drop", "key", "store"];
  return (
    <AccordionItem
      bg="gray.800"
      _hover={{ bg: "gray.700" }}
      borderRadius={8}
      px={4}
      py={3}
      transition="all .25s ease-in-out"
      flexDirection="column"
      gap={1}
    >
      {({ isExpanded }) => (
        <>
          <AccordionButton
            flexDirection="column"
            alignItems="flex-start"
            onClick={() => ({
              action: !isExpanded ? "expand" : "collapse",
              component: "unsupported_pool",
              section: "pool-list-page",
            })}
          >
            <Flex justifyContent="space-between" w="full" alignItems="center">
              <Text variant="body2">{struct.name}</Text>
              <Flex align="center">
                <Flex gap={1}>
                  {structAbilities.map((item) => (
                    <Tag
                      size="sm"
                      variant="gray"
                      opacity={struct.abilities.includes(item) ? 1 : 0.3}
                    >
                      {item}
                    </Tag>
                  ))}
                </Flex>
                <StyledIconButton
                  variant="none"
                  aria-label="external"
                  _hover={{ backgroundColor: "gray.700" }}
                  icon={
                    <CustomIcon
                      name="chevron-down"
                      transform={isExpanded ? "rotate(180deg)" : "rotate(0)"}
                      transition="all .25s ease-in-out"
                    />
                  }
                />
              </Flex>
            </Flex>
          </AccordionButton>
          <AccordionPanel bg="gray.900" borderRadius={8} mt={2} py={3} px={4}>
            <Flex gap={3} direction="column">
              <Flex gap={8}>
                <LabelText
                  isSmall
                  label="is_native"
                  labelWeight={700}
                  labelColor="text.disabled"
                >
                  <Text variant="body3">{String(struct.is_native)}</Text>
                </LabelText>
                <LabelText
                  isSmall
                  label="abilities"
                  labelWeight={700}
                  labelColor="text.disabled"
                >
                  <Text variant="body3">
                    {JSON.stringify(struct.abilities)}
                  </Text>
                </LabelText>
              </Flex>
              <LabelText
                isSmall
                label="generic_type_params"
                labelWeight={700}
                labelColor="text.disabled"
              >
                <Text variant="body3">
                  {JSON.stringify(struct.generic_type_params)}
                </Text>
              </LabelText>
              <LabelText
                isSmall
                label="fields"
                labelWeight={700}
                labelColor="text.disabled"
              >
                <Text variant="body3">{JSON.stringify(struct.fields)}</Text>
              </LabelText>
            </Flex>
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  );
};
