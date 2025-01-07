import { Text } from "@chakra-ui/react";

import { AttachSchemaCard } from "../AttachSchemaCard";
import { CustomIcon } from "lib/components/icon";
import type { CodeSchema, Nullish, Option } from "lib/types";

interface SchemaInputNotExistProps {
  codeHash: string;
  codeId: number;
  localSchema: Option<CodeSchema>;
  openModal: () => void;
  prettyType: string;
  verifiedSchema: Nullish<CodeSchema>;
}

export const SchemaInputNotExist = ({
  codeHash,
  codeId,
  localSchema,
  openModal,
  prettyType,
  verifiedSchema,
}: SchemaInputNotExistProps) => {
  if (verifiedSchema)
    return (
      <Text variant="body1" color="text.main" fontWeight={700}>
        Verified JSON Schema doesn’t have {prettyType}Msg
      </Text>
    );

  return (
    <>
      <Text variant="body1" color="text.main" fontWeight={700}>
        {localSchema ? (
          `Attached JSON Schema doesn’t have ${prettyType}Msg`
        ) : (
          <>
            You haven&#39;t attached the JSON Schema for{" "}
            <CustomIcon mx={1} name="code" color="gray.400" />
            code {codeId} yet
          </>
        )}
      </Text>
      <Text
        mb={4}
        mt={2}
        variant="body2"
        color="text.disabled"
        fontWeight={500}
      >
        {localSchema
          ? `Please fill in ${prettyType} Message manually or change the schema`
          : "Your attached JSON schema will be stored locally on your device"}
      </Text>
      <AttachSchemaCard
        attached={Boolean(localSchema)}
        codeHash={codeHash}
        codeId={codeId}
        localSchema={localSchema}
        openModal={openModal}
      />
    </>
  );
};
