import {
  chakra,
  Flex,
  Heading,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { capitalize } from "lodash";

import { CustomTab } from "lib/components/CustomTab";
import { EditSchemaButtons, JsonSchemaModal } from "lib/components/json-schema";
import type { CodeSchema } from "lib/stores/schema";
import { SchemaProperties } from "lib/stores/schema";
import type { Option } from "lib/types";

import { SchemaPanel } from "./SchemaPanel";

const StyledCustomTab = chakra(CustomTab, {
  baseStyle: {
    border: "unset",
    borderRadius: "4px",
    _selected: { bgColor: "gray.800" },
  },
});

const StyledTabPanel = chakra(TabPanel, {
  baseStyle: {
    p: 0,
  },
});

interface CodeSchemaSectionProps {
  codeId: number;
  codeHash: string;
  jsonSchema: Option<CodeSchema>;
}

const SchemaMsgTabList = [
  SchemaProperties.INSTANTIATE as "instantiate",
  SchemaProperties.EXECUTE as "execute",
  SchemaProperties.QUERY as "query",
  SchemaProperties.MIGRATE as "migrate",
];

export const CodeSchemaSection = ({
  codeId,
  codeHash,
  jsonSchema,
}: CodeSchemaSectionProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <Flex mt={8} mb={3} alignItems="center" gap={2}>
        <Heading as="h6" variant="h6">
          JSON Schema
        </Heading>
        {Boolean(jsonSchema) && (
          <EditSchemaButtons
            codeId={codeId}
            codeHash={codeHash}
            openModal={onOpen}
          />
        )}
      </Flex>
      <Text
        variant="body2"
        px={4}
        py={3}
        textColor="text.dark"
        bgColor="gray.800"
        border="1px solid var(--chakra-colors-gray-700)"
        borderRadius="8px"
      >
        Uploaded JSON schemas are stored locally on your device.
      </Text>
      <Tabs variant="unstyled" orientation="vertical" mt={6}>
        <TabList>
          <StyledCustomTab>Full Schema</StyledCustomTab>
          {SchemaMsgTabList.map((schemaProperty) => (
            <StyledCustomTab key={schemaProperty}>
              {capitalize(schemaProperty)}Msg
            </StyledCustomTab>
          ))}
        </TabList>
        <TabPanels pl={6}>
          <StyledTabPanel>
            <SchemaPanel
              codeId={codeId}
              codeHash={codeHash}
              schema={jsonSchema}
            />
          </StyledTabPanel>
          {SchemaMsgTabList.map((schemaProperty) => (
            <StyledTabPanel key={schemaProperty}>
              <SchemaPanel
                codeId={codeId}
                codeHash={codeHash}
                schema={jsonSchema?.[schemaProperty]}
              />
            </StyledTabPanel>
          ))}
        </TabPanels>
      </Tabs>
      <JsonSchemaModal
        isOpen={isOpen}
        onClose={onClose}
        codeId={codeId}
        codeHash={codeHash}
        isReattach={Boolean(jsonSchema)}
      />
    </>
  );
};
