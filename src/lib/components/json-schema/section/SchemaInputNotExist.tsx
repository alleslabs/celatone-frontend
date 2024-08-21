import { Text } from "@chakra-ui/react";

import { AttachSchemaCard } from "../AttachSchemaCard";
import { CustomIcon } from "lib/components/icon";
import type { CodeSchema, Nullish, Option } from "lib/types";

interface SchemaInputNotExistProps {
  prettyType: string;
  verifiedSchema: Nullish<CodeSchema>;
  localSchema: Option<CodeSchema>;
  codeId: number;
  codeHash: string;
  openModal: () => void;
}

export const SchemaInputNotExist = ({
  prettyType,
  verifiedSchema,
  localSchema,
  codeId,
  codeHash,
  openModal,
}: SchemaInputNotExistProps) => {
  if (verifiedSchema)
    return (
      <Text color="text.main" fontWeight={700} variant="body1">
        `Verified JSON Schema doesn’t have ${prettyType}Msg`
      </Text>
    );

  return (
    <>
      <Text color="text.main" fontWeight={700} variant="body1">
        {localSchema ? (
          `Attached JSON Schema doesn’t have ${prettyType}Msg`
        ) : (
          <>
            You haven&#39;t attached the JSON Schema for{" "}
            <CustomIcon name="code" mx={1} color="gray.400" />
            code {codeId} yet
          </>
        )}
      </Text>
      <Text
        color="text.disabled"
        fontWeight={500}
        variant="body2"
        mt={2}
        mb={4}
      >
        {localSchema
          ? `Please fill in ${prettyType} Message manually or change the schema`
          : "Your attached JSON schema will be stored locally on your device"}
      </Text>
      <AttachSchemaCard
        attached={Boolean(localSchema)}
        localSchema={localSchema}
        codeId={codeId}
        codeHash={codeHash}
        openModal={openModal}
      />
    </>
  );
};
