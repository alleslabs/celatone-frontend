import { chakra, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { capitalize } from "lodash";

import { CustomTab } from "lib/components/CustomTab";
import type { CodeSchema, Nullish, Option } from "lib/types";
import { SchemaProperties } from "lib/types";

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

const SchemaMsgTabList = [
  SchemaProperties.INSTANTIATE as "instantiate",
  SchemaProperties.EXECUTE as "execute",
  SchemaProperties.QUERY as "query",
  SchemaProperties.MIGRATE as "migrate",
];

interface CodeSchemaTabsProps {
  codeId: number;
  codeHash: string;
  verifiedSchema: Nullish<CodeSchema>;
  localSchema: Option<CodeSchema>;
}

export const CodeSchemaTabs = ({
  codeId,
  codeHash,
  verifiedSchema,
  localSchema,
}: CodeSchemaTabsProps) => {
  const schema = verifiedSchema ?? localSchema;
  const hasSchema = Boolean(schema);
  return (
    <Tabs variant="unstyled" orientation="vertical" mt={6}>
      <TabList>
        <StyledCustomTab>Full schema</StyledCustomTab>
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
            jsonSchema={schema}
            hasSchema={hasSchema}
          />
        </StyledTabPanel>
        {SchemaMsgTabList.map((schemaProperty) => (
          <StyledTabPanel key={schemaProperty}>
            <SchemaPanel
              codeId={codeId}
              codeHash={codeHash}
              jsonSchema={schema?.[schemaProperty]}
              hasSchema={hasSchema}
              schemaProperty={schemaProperty}
            />
          </StyledTabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};
