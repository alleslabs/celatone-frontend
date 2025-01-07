import { chakra, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { capitalize } from "lodash";

import { CustomTab } from "lib/components/CustomTab";
import type { CodeSchema, Nullish, Option } from "lib/types";
import { SchemaProperties } from "lib/types";

import { SchemaPanel } from "./SchemaPanel";

const StyledCustomTab = chakra(CustomTab, {
  baseStyle: {
    _selected: { bgColor: "gray.800" },
    border: "unset",
    borderRadius: "4px",
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
  codeHash: string;
  codeId: number;
  localSchema: Option<CodeSchema>;
  verifiedSchema: Nullish<CodeSchema>;
}

export const CodeSchemaTabs = ({
  codeHash,
  codeId,
  localSchema,
  verifiedSchema,
}: CodeSchemaTabsProps) => {
  const schema = verifiedSchema ?? localSchema;
  const hasSchema = Boolean(schema);
  return (
    <Tabs mt={6} variant="unstyled" orientation="vertical">
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
            hasSchema={hasSchema}
            codeHash={codeHash}
            codeId={codeId}
            jsonSchema={schema}
          />
        </StyledTabPanel>
        {SchemaMsgTabList.map((schemaProperty) => (
          <StyledTabPanel key={schemaProperty}>
            <SchemaPanel
              hasSchema={hasSchema}
              codeHash={codeHash}
              codeId={codeId}
              jsonSchema={schema?.[schemaProperty]}
              schemaProperty={schemaProperty}
            />
          </StyledTabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};
