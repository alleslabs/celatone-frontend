import type { MoveVerifyConfig } from "lib/types";
import type { Control, UseFormSetValue } from "react-hook-form";

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
import { SelectInput } from "lib/components/forms";
import { useMemo } from "react";
import { useWatch } from "react-hook-form";

import type { ModuleVerifyForm } from "../types";

import { formatMoveOptions } from "../helpers";

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
            alignItems="center"
            justifyContent="space-between"
            p={4}
            w="full"
          >
            <Flex alignItems="flex-start" direction="column" gap={1}>
              <Text>Advanced options</Text>
              <Text color="text.dark" textAlign="left" variant="body3">
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
              label="Language version"
              menuPortalTarget={document.body}
              options={languageVersionOptions}
              placeholder="Select language version"
              value={languageVersionOptions.find(
                (option) => option.value === languageVersion
              )}
              onChange={(selectedOption) => {
                if (!selectedOption) return;
                setValue("languageVersion", selectedOption.value);
              }}
            />
            <SelectInput
              label="Compiler version"
              menuPortalTarget={document.body}
              options={compilerVersionOptions}
              placeholder="Select compiler version"
              value={compilerVersionOptions.find(
                (option) => option.value === compilerVersion
              )}
              onChange={(selectedOption) => {
                if (!selectedOption) return;
                setValue("compilerVersion", selectedOption.value);
              }}
            />
            <SelectInput
              label="Bytecode version"
              menuPortalTarget={document.body}
              options={bytecodeVersionOptions}
              placeholder="Select bytecode version"
              value={bytecodeVersionOptions.find(
                (option) => option.value === bytecodeVersion
              )}
              onChange={(selectedOption) => {
                if (!selectedOption) return;
                setValue("bytecodeVersion", selectedOption.value);
              }}
            />
          </Stack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
