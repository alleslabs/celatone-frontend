import { UploadSchemaSection } from "lib/components/json-schema";
import JsonReadOnly from "lib/components/json/JsonReadOnly";
import type { Option } from "lib/types";
import { jsonPrettify } from "lib/utils";

interface SchemaPanelProps {
  codeId: string;
  codeHash: string;
  schema: Option<object | null>;
}

export const SchemaPanel = ({ codeId, codeHash, schema }: SchemaPanelProps) =>
  schema === undefined ? (
    <UploadSchemaSection schema={schema} codeId={codeId} codeHash={codeHash} />
  ) : (
    <JsonReadOnly
      text={schema ? jsonPrettify(JSON.stringify(schema)) : "null"}
      canCopy
      showLines={28}
    />
  );
