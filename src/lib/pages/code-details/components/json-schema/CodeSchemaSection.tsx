import {
  Button,
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

import { CustomTab } from "lib/components/CustomTab";
import { CustomIcon } from "lib/components/icon";
import { JsonSchemaDrawer } from "lib/components/json-schema";
import { Loading } from "lib/components/Loading";
import { RemoveSchemaModal } from "lib/components/modal/RemoveSchemaModal";
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
          <Flex gap={1}>
            <Button
              variant="outline-gray"
              p="8px 6px"
              leftIcon={<CustomIcon name="edit" boxSize={4} />}
              onClick={onOpen}
            >
              Reattach Schema
            </Button>
            <RemoveSchemaModal
              codeId={String(codeId)}
              codeHash={codeHash}
              trigger={
                <Button variant="outline-gray" p={0}>
                  <CustomIcon name="delete" boxSize={4} />
                </Button>
              }
            />
          </Flex>
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
        Uploaded JSON schemas are stored locally on your device. Public projects
        with verified JSON schemas are visible and accessible to others.
      </Text>
      <Tabs variant="unstyled" orientation="vertical" mt={6}>
        <TabList>
          <StyledCustomTab>Full Schema</StyledCustomTab>
          <StyledCustomTab>InstantiateMsg</StyledCustomTab>
          <StyledCustomTab>ExecuteMsg</StyledCustomTab>
          <StyledCustomTab>QueryMsg</StyledCustomTab>
          <StyledCustomTab>MigrateMsg</StyledCustomTab>
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
          <StyledTabPanel>
            <SchemaPanel
              codeId={codeId}
              codeHash={codeHash}
              schema={jsonSchema?.[SchemaProperties.INSTANTIATE]}
              openDrawer={onOpen}
            />
          </StyledTabPanel>
          <StyledTabPanel>
            <SchemaPanel
              codeId={codeId}
              codeHash={codeHash}
              schema={jsonSchema?.[SchemaProperties.EXECUTE]}
              openDrawer={onOpen}
            />
          </StyledTabPanel>
          <StyledTabPanel>
            <SchemaPanel
              codeId={codeId}
              codeHash={codeHash}
              schema={jsonSchema?.[SchemaProperties.QUERY]}
              openDrawer={onOpen}
            />
          </StyledTabPanel>
          <StyledTabPanel>
            <SchemaPanel
              codeId={codeId}
              codeHash={codeHash}
              schema={jsonSchema?.[SchemaProperties.MIGRATE]}
              openDrawer={onOpen}
            />
          </StyledTabPanel>
        </TabPanels>
      </Tabs>
      <JsonSchemaDrawer
        isOpen={isOpen}
        onClose={onClose}
        codeId={String(codeId)}
        codeHash={codeHash}
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
