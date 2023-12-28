import JsonReadOnly from "lib/components/json/JsonReadOnly";
import { UploadSchemaSection } from "lib/components/json-schema";
import type { Nullable, Option } from "lib/types";
import { jsonPrettify } from "lib/utils";

interface SchemaPanelProps {
  codeId: number;
  codeHash: string;
  schema: Option<Nullable<object>>;
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
