import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";

import type { CodeSchema, Dict, Option } from "lib/types";
import { SchemaProperties } from "lib/types";

const normalize = (codeHash: string) => {
  return codeHash.toLowerCase();
};

export class SchemaStore {
  /**
   * @remarks code hash as key and json schema as value (annotated as Dict<string, unknown>>)
   * e.g.
   * {
   *   "ad5b2af9a177ffc": {
   *        "contract_name": ...,
   *        "instantiate": { ... },
   *        ...
   *      }
   * }
   */
  jsonSchemas: Dict<string, CodeSchema>;

  constructor() {
    this.jsonSchemas = {};

    makeAutoObservable(this, {}, { autoBind: true });

    makePersistable(this, {
      name: "SchemaStore",
      properties: ["jsonSchemas"],
    });
  }

  deleteSchema(codeHash: string) {
    delete this.jsonSchemas[normalize(codeHash)];
  }

  getSchemaByCodeHash(codeHash: string): Option<CodeSchema> {
    return this.jsonSchemas[normalize(codeHash)];
  }

  // TODO: add test
  getSchemaCount(): number {
    return Object.keys(this.jsonSchemas).length;
  }

  saveNewSchema(codeHash: string, codeId: string, schema: CodeSchema) {
    this.jsonSchemas[normalize(codeHash)] = {
      ...schema,
      [SchemaProperties.ATTACHED_CODE_ID]: codeId,
    };
  }
}
