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
import { CustomIcon } from "lib/components/icon";
import {
  JsonSchemaDrawer,
  EditSchemaButtons,
} from "lib/components/json-schema";
import { Loading } from "lib/components/Loading";
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
  codeHash: Option<string>;
  isCodeHashLoading: boolean;
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
  isCodeHashLoading,
  jsonSchema,
}: CodeSchemaSectionProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  if (isCodeHashLoading) return <Loading />;
  return codeHash ? (
    <>
      <Flex justify="space-between" mt={6} mb={3}>
        <Heading as="h6" variant="h6">
          JSON Schema
        </Heading>
        {!!jsonSchema && (
          <EditSchemaButtons
            codeId={codeId}
            codeHash={codeHash}
            openDrawer={onOpen}
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
              openDrawer={onOpen}
            />
          </StyledTabPanel>
          {SchemaMsgTabList.map((schemaProperty) => (
            <StyledTabPanel>
              <SchemaPanel
                codeId={codeId}
                codeHash={codeHash}
                schema={jsonSchema?.[schemaProperty]}
                openDrawer={onOpen}
              />
            </StyledTabPanel>
          ))}
        </TabPanels>
      </Tabs>
      <JsonSchemaDrawer
        isOpen={isOpen}
        onClose={onClose}
        codeId={String(codeId)}
        codeHash={codeHash}
        isReattach={!!jsonSchema}
      />
    </>
  ) : (
    <Flex m={6}>
      <CustomIcon
        name="alert-circle-solid"
        color="gray.600"
        boxSize={4}
        mr={3}
      />
      Error fetching code hash. Please try again later.
    </Flex>
  );
};
