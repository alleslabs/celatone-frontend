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

import { CustomIcon } from "../icon";
import { LabelText } from "../LabelText";
import { trackUseExpand } from "lib/amplitude";
import type { Struct } from "lib/types";

interface StructCardProps {
  struct: Struct;
}

const StyledIconButton = chakra(IconButton, {
  baseStyle: {
    alignItems: "center",
    color: "gray.600",
    display: "flex",
    fontSize: "24px",
  },
});

const STRUCT_ABILITIES = ["copy", "drop", "key", "store"];

export const StructCard = ({ struct }: StructCardProps) => (
  <AccordionItem
    bg="gray.800"
    gap={1}
    px={4}
    py={3}
    _hover={{ bg: "gray.700" }}
    borderRadius={8}
    flexDirection="column"
    transition="all .25s ease-in-out"
  >
    {({ isExpanded }) => (
      <>
        <AccordionButton
          alignItems="flex-start"
          _hover={{ bg: "transparent" }}
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
            w="full"
            direction={{ base: "column", md: "row" }}
            justifyContent="space-between"
          >
            <Text variant="body2">{struct.name}</Text>
            <Flex
              align="center"
              w={{ base: "full", md: "auto" }}
              justifyContent="space-between"
            >
              <Flex gap={1}>
                {STRUCT_ABILITIES.map((item) => (
                  <Tag
                    key={item}
                    size="sm"
                    variant="gray"
                    opacity={struct.abilities.includes(item) ? 1 : 0.3}
                  >
                    {item}
                  </Tag>
                ))}
              </Flex>
              <StyledIconButton
                aria-label="external"
                variant="none"
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
        <AccordionPanel bg="gray.900" mt={2} px={4} py={3} borderRadius={8}>
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
                <Text variant="body3">{JSON.stringify(struct.abilities)}</Text>
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
