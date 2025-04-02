import type { CodeSchema, Nullish, Option } from "lib/types";

import { chakra, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { CustomTab } from "lib/components/CustomTab";
import { SchemaProperties } from "lib/types";
import { capitalize } from "lodash";

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
    <Tabs mt={6} orientation="vertical" variant="unstyled">
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
            codeHash={codeHash}
            codeId={codeId}
            hasSchema={hasSchema}
            jsonSchema={schema}
          />
        </StyledTabPanel>
        {SchemaMsgTabList.map((schemaProperty) => (
          <StyledTabPanel key={schemaProperty}>
            <SchemaPanel
              codeHash={codeHash}
              codeId={codeId}
              hasSchema={hasSchema}
              jsonSchema={schema?.[schemaProperty]}
              schemaProperty={schemaProperty}
            />
          </StyledTabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};
