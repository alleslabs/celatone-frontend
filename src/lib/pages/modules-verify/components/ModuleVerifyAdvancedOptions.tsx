import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { useWatch } from "react-hook-form";
import type { Control, UseFormSetValue } from "react-hook-form";
import { SelectInput } from "lib/components/forms";
import type { MoveVerifyConfig } from "lib/types";
import { formatMoveOptions } from "../helpers";
import type { ModuleVerifyForm } from "../types";

interface ModuleVerifyAdvancedOptionsProps {
  control: Control<ModuleVerifyForm>;
  setValue: UseFormSetValue<ModuleVerifyForm>;
  moveVerifyConfig: MoveVerifyConfig;
}

export const ModuleVerifyAdvancedOptions = ({
  control,
  setValue,
  moveVerifyConfig,
}: ModuleVerifyAdvancedOptionsProps) => {
  const [bytecodeVersion, compilerVersion, languageVersion] = useWatch({
    control,
    name: ["bytecodeVersion", "compilerVersion", "languageVersion"],
  });

  const {
    languageVersionOptions,
    compilerVersionOptions,
    bytecodeVersionOptions,
  } = useMemo(() => {
    return {
      languageVersionOptions: formatMoveOptions(
        moveVerifyConfig.enableLanguageVersions
      ),
      compilerVersionOptions: formatMoveOptions(
        moveVerifyConfig.enableCompilerVersions
      ),
      bytecodeVersionOptions: formatMoveOptions(
        moveVerifyConfig.enableBytecodeVersions
      ),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(moveVerifyConfig)]);

  return (
    <Accordion allowToggle width="full">
      <AccordionItem>
        <AccordionButton>
          <Flex
            p={4}
            justifyContent="space-between"
            w="full"
            alignItems="center"
          >
            <Flex direction="column" gap={1} alignItems="flex-start">
              <Text>Advanced Options</Text>
              <Text variant="body3" color="text.dark" textAlign="left">
                Skip this section if you built your module with default
                settings. Otherwise, ensure your specified versions match here
                to prevent verification errors.
              </Text>
            </Flex>
            <AccordionIcon boxSize={6} color="gray.600" />
          </Flex>
        </AccordionButton>
        <AccordionPanel>
          <Stack gap={6}>
            <SelectInput
              label="Language Version"
              menuPortalTarget={document.body}
              placeholder="Select language version"
              options={languageVersionOptions}
              onChange={(selectedOption) => {
                if (!selectedOption) return;
                setValue("languageVersion", selectedOption.value);
              }}
              value={languageVersionOptions.find(
                (option) => option.value === languageVersion
              )}
              labelBg="gray.900"
            />
            <SelectInput
              label="Compiler Version"
              menuPortalTarget={document.body}
              placeholder="Select compiler version"
              options={compilerVersionOptions}
              onChange={(selectedOption) => {
                if (!selectedOption) return;
                setValue("compilerVersion", selectedOption.value);
              }}
              value={compilerVersionOptions.find(
                (option) => option.value === compilerVersion
              )}
              labelBg="gray.900"
            />
            <SelectInput
              label="Bytecode Version"
              menuPortalTarget={document.body}
              placeholder="Select bytecode version"
              options={bytecodeVersionOptions}
              onChange={(selectedOption) => {
                if (!selectedOption) return;
                setValue("bytecodeVersion", selectedOption.value);
              }}
              value={bytecodeVersionOptions.find(
                (option) => option.value === bytecodeVersion
              )}
              labelBg="gray.900"
            />
          </Stack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
