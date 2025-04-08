import type { Struct } from "lib/types";

import {
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  chakra,
  Flex,
  IconButton,
  Tag,
  Text,
} from "@chakra-ui/react";
import { trackUseExpand } from "lib/amplitude";

import { CustomIcon } from "../icon";
import { LabelText } from "../LabelText";

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

const STRUCT_ABILITIES = ["copy", "drop", "key", "store"];

export const StructCard = ({ struct }: StructCardProps) => (
  <AccordionItem
    _hover={{ bg: "gray.700" }}
    bg="gray.800"
    borderRadius={8}
    flexDirection="column"
    gap={1}
    px={4}
    py={3}
    transition="all .25s ease-in-out"
  >
    {({ isExpanded }) => (
      <>
        <AccordionButton
          _hover={{ bg: "transparent" }}
          alignItems="flex-start"
          flexDirection="column"
          onClick={() =>
            trackUseExpand({
              action: !isExpanded ? "expand" : "collapse",
              component: "module_struct_accordion",
              info: { structAbilities: struct.abilities },
            })
          }
        >
          <Flex
            alignItems={{ base: "flex-start", md: "center" }}
            direction={{ base: "column", md: "row" }}
            justifyContent="space-between"
            w="full"
          >
            <Text variant="body2">{struct.name}</Text>
            <Flex
              align="center"
              justifyContent="space-between"
              w={{ base: "full", md: "auto" }}
            >
              <Flex gap={1}>
                {STRUCT_ABILITIES.map((item) => (
                  <Tag
                    key={item}
                    opacity={struct.abilities.includes(item) ? 1 : 0.3}
                    size="sm"
                    variant="gray"
                  >
                    {item}
                  </Tag>
                ))}
              </Flex>
              <StyledIconButton
                _hover={{ backgroundColor: "gray.700" }}
                aria-label="external"
                icon={
                  <CustomIcon
                    name="chevron-down"
                    transform={isExpanded ? "rotate(180deg)" : "rotate(0)"}
                    transition="all .25s ease-in-out"
                  />
                }
                variant="none"
              />
            </Flex>
          </Flex>
        </AccordionButton>
        <AccordionPanel bg="gray.900" borderRadius={8} mt={2} px={4} py={3}>
          <Flex direction="column" gap={3}>
            <Flex gap={8}>
              <LabelText
                isSmall
                label="is_native"
                labelColor="text.disabled"
                labelWeight={700}
              >
                <Text variant="body3">{String(struct.is_native)}</Text>
              </LabelText>
              <LabelText
                isSmall
                label="abilities"
                labelColor="text.disabled"
                labelWeight={700}
              >
                <Text variant="body3">{JSON.stringify(struct.abilities)}</Text>
              </LabelText>
            </Flex>
            <LabelText
              isSmall
              label="generic_type_params"
              labelColor="text.disabled"
              labelWeight={700}
            >
              <Text variant="body3">
                {JSON.stringify(struct.generic_type_params)}
              </Text>
            </LabelText>
            <LabelText
              isSmall
              label="fields"
              labelColor="text.disabled"
              labelWeight={700}
            >
              <Text variant="body3">{JSON.stringify(struct.fields)}</Text>
            </LabelText>
          </Flex>
        </AccordionPanel>
      </>
    )}
  </AccordionItem>
);
